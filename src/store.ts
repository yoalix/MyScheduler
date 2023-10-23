"use client";

import { proxy } from "valtio";
import { DEFAULT_STATE } from "./lib/config";

export const store = proxy({
  state: DEFAULT_STATE,
  resetStore: () => {
    store.state = { ...DEFAULT_STATE };
  },
});
