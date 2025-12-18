declare module 'lodash.debounce' {
  type DebounceOptions = {
    leading?: boolean;
    trailing?: boolean;
    maxWait?: number;
  };

  function debounce<T extends (...args: any[]) => any>(
    func: T,
    wait?: number,
    options?: DebounceOptions
  ): ((...args: Parameters<T>) => ReturnType<T>) & {
    cancel(): void;
    flush(): ReturnType<T>;
    pending(): boolean;
  };

  export default debounce;
}
