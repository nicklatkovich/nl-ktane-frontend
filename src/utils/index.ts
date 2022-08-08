import { MonoRandom } from "monorandom";
import { ElOrArr } from "nl-ktane-lib";

import { DAY } from "../constants";

export * from "./ts.utils";

export function shuffled<T>(arr: T[], rnd?: MonoRandom): T[] {
  const res = [...arr];
  for (let i = 0; i < res.length; i++) {
    const j = rand(res.length, rnd);
    [res[i], res[j]] = [res[j], res[i]];
  }
  return res;
}

export function rand(limit: number, rnd?: MonoRandom): number {
  if (!rnd) return Math.floor(Math.random() * limit);
  return rnd.nextMax(limit);
}

export function getCurrentDayIndex(): number {
  return getDayIndex(Date.now());
}

export function getDayIndex(time: number): number {
  return Math.floor(time / DAY);
}

export function strOrArrToString(value: ElOrArr<string>): string {
  return typeof value === "string" ? value : value.join(" & ");
}

export function elOrArrToArr<T>(elOrArr: ElOrArr<T>): T[] {
  if (Array.isArray(elOrArr)) return elOrArr;
  return [elOrArr];
}

export function timeToString(time: number): string {
  return `${Math.floor(time / 60)}:${(time % 60).toString().padStart(2, "0")}`;
}
