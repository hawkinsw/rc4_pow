import { toHex } from './utils'

export class Hash {
  v: Array<number>
  constructor(size: number) {
    this.v = new Array<number>(size)
  }

  public length(): number {
    return this.v.length
  }

  public set(index: number, value: number): void {
    this.v[index] = value
    //console.log("this.v[index] = " + this.v[index])
    //console.log("value = " + value)
  }

  public get(index: number): number {
    return this.v[index]
  }

  public print(): string {
    var result = ""
    for (var idx = 0; idx<this.v.length; idx++) {
      result += toHex(this.v[idx]) + " "
    }
    return result
  }
}