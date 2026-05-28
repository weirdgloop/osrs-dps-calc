import DeferredPromise from './DeferredPromise';

// This is a bit of a hack of Promise, but it is very convenient to use as a result.
// Technically a promise should always be resolved, but we *can* just not resolve to effectively debounce.
class Debouncer {
  private readonly delay: number;

  private windowTimeoutId?: number;

  constructor(ms: number = 250) {
    this.delay = ms;
  }

  /* eslint-disable no-restricted-globals */
  async debounce(): Promise<void> {
    if (this.windowTimeoutId) {
      self.clearTimeout(this.windowTimeoutId);
    }

    const p = new DeferredPromise<void>();
    this.windowTimeoutId = self.setTimeout(() => {
      p.resolve(undefined);
    }, this.delay);

    return p.promise;
  }

  /* eslint-enable no-restricted-globals */
}

export default Debouncer;
