"use client";

import { proxy } from "valtio";
import Day from "@/lib/day";
import { DEFAULT_DURATION, DEFAULT_STATE } from "./lib/config";

export const state = proxy(DEFAULT_STATE);
