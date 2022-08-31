import { arrayCopy, swap } from './utils'
import { Hash } from './hash'

export const CreatedBeforeInitialization: Error = new Error('Used RC4 before initialization')

// Testable input:
// ogwdyyvmacwxkltbgohznvrxfwhkhfutpcqkxwjcibanjvsnsshpvmmzctlrabgqjslpumzpjopwdiczfinfkxntwqvnpccjlziplfulniopvbjezoxefcnbemumftyhuaokkidllrbvchrbwvmoegqksvcvhhyakxnrebagacagteezqkrkpfhnetlggckagphwqaiecxtdvrhxkwynmxxxpdptsaalythhfwdhjwhlgbvcxbrzzlfiocjibjxq
// 1 2 3 4
// Expected result: 12 8f 7e 3b 3c d1 88 d6 30 dd 8d 39 63 28 c2 0 9 2d dc ab 10

export class RC4 {
  private static default_s: Array<number>
  private static initialized: boolean = false
  private S: Array<number>
  private i: number = 0
  private j: number = 0

  constructor() {
    if (!RC4.initialized) {
      throw CreatedBeforeInitialization
    }
    this.S = arrayCopy(RC4.default_s)
    this.i = 0
    this.j = 0
  }


  public static initialize() {
    var s = new Array<number>()
    for (var i = 0; i < 256; i++) {
      s[i] = i
    }
    RC4.default_s = s
    RC4.initialized = true
  }


  public schedule(keymat: Array<number>): void {
    var j = 0;
    for (var i = 0; i < 256; i++) {
      j = (j + this.S[i] + keymat[i % keymat.length]) % 256;
      //console.log("Si: " + this.S[i]);
      //console.log("Sj: " + this.S[j]);
      //console.log("keymat: " + keymat[i % keymat.length])
      //console.log("keymat.length: " + keymat.length)
      //console.log("j: " + j);
      //console.log("j: " + j);
      [this.S[i], this.S[j]] = swap(this.S[i], this.S[j]);
      //console.log("After swap: ")
      //console.log("Si: " + this.S[i]);
      //console.log("Sj: " + this.S[j]);
      //console.log("Si: " + this.S[i])
      //console.log("--------")
    }
  }

  public hash(size: number): Hash {
    var result = new Hash(size)
    for (var idx = 0; idx < result.length(); idx++) {
      this.i = (this.i + 1) % 256
      this.j = (this.j + this.S[this.i]) % 256;
      [this.S[this.i], this.S[this.j]] = swap(this.S[this.i], this.S[this.j])
      result.set(idx, this.S[(this.S[this.i] + this.S[this.j]) % 256])
    }
    return result
  }
} 