export { }
declare global {
  interface Array<T> {
    remove(elem: T): Array<T> | T[];
    arrayTake(takeN: number): Array<T> | T[];
    arraySkip(skipN: number): Array<T> | T[];
  }
}
if (!Array.prototype.remove) {
  Array.prototype.remove = function <T>(elem: T): Array<T> | T[] {
    return this.filter((e: T) => e !== elem);
  }
}
if (!Array.prototype.arrayTake) {
  Array.prototype.arrayTake = function <T>(c:any): Array<T> | T[] {
    return this.filter((_x: any, i: number) => {
      if (i <= (c - 1)) { return true } else return false;
    })
  }
}
if (!Array.prototype.arraySkip) {
  Array.prototype.arraySkip = function <T>(c:any): Array<T> | T[] {
    return this.filter((_x: any, i: number) => {
      if (i > (c - 1)) { return true } else return false;
    })
  }
}




