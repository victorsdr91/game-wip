interface Navigator {
  keyboard?: {
    lock: (keys?: string[]) => Promise<void>;
  };
}