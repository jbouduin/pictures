declare global {
  interface Array<T> {
    sortBy<T>(this: T[], selector: (x: T) => string, caseSensitive: boolean): Array<T>;
  }
}

Array.prototype.sortBy = function sortBy<T>(this: Array<T>, selector: (x: T) => string, caseSensitive: boolean) {
  return this.sort((a: T, b: T) => {
    const aa = caseSensitive ? selector(a) : selector(a).toLowerCase();
    const bb = caseSensitive ? selector(b) : selector(b).toLowerCase();
    if ( aa < bb ) {
      return -1;
    } else if ( aa > bb) {
      return 1;
    }
    return 0;
  });
};
export {}
