class DeferredPromise<T> {
  private _resolve!: (response: T) => void;

  private _reject!: (reason: Error) => void;

  readonly promise: Promise<T>;

  constructor() {
    this.promise = new Promise((resolve, reject) => {
      this.resolve = resolve;
      this.reject = reject;
    });
  }

  public resolve(response: T): void {
    this._resolve(response);
  }

  public reject(reason: Error): void {
    this._reject(reason);
  }
}

export default DeferredPromise;
