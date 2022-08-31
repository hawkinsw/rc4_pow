export function arrayCopy<T>(a: Array<T>): Array<T> {
  var id = (x: T) => x
  return a.map(id)
}

export function toHex(n: number): string {
  if (n == 0)
    return "0"

  var result = ""
  var map = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "a", "b", "c", "d", "e", "f"]
  while (n > 0) {
    var v = n % 16
    result = map[v] + result
    n = Math.floor(n / 16)
  }
  return result
}

export function fromHex(s: string): number {
  if (s.length == 0)
    return 0

  var result = 0
  var map: Record<string, number> = { "0": 0, "1": 1, "2": 2, "3": 3, "4": 4, "5": 5, "6": 6, "7": 7, "8": 8, "9": 9, "a": 10, "b": 11, "c": 12, "d": 13, "e": 14, "f": 15 }
  for (const c of s) {
    result = result * 16 + map[c]
  }
  return result
}


export function swap<L, R>(left: L, right: R): [R, L] {
  return [right, left]
}