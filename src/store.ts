"use client";

import { proxy } from "valtio";
import { DEFAULT_STATE } from "./lib/config";

export const state = proxy({
  state: DEFAULT_STATE,
  resetStore: () => {
    state.state = { ...DEFAULT_STATE };
  },
});
