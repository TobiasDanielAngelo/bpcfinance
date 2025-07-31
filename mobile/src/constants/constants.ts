import { Dimensions } from "react-native";

export const { width: winWidth, height: winHeight } = Dimensions.get("window");
export const isWideScreen = winWidth >= 600;

export const DAYS_OF_WEEK_CHOICES = [
  "Sun",
  "Mon",
  "Tue",
  "Wed",
  "Thu",
  "Fri",
  "Sat",
];

export const lowerFirstLetter = (str: string) => {
  return str.charAt(0).toLowerCase() + str.slice(1);
};

export const isTouchDevice = () =>
  "ontouchstart" in window ||
  navigator.maxTouchPoints > 0 ||
  window.matchMedia("(pointer: coarse)").matches;

const getOrdinal = (n: number) => {
  let ord = "th";

  if (n % 10 == 1 && n % 100 != 11) {
    ord = "st";
  } else if (n % 10 == 2 && n % 100 != 12) {
    ord = "nd";
  } else if (n % 10 == 3 && n % 100 != 13) {
    ord = "rd";
  }
  return ord;
};

export const dayOfMonthSelections = Array.from(Array(33).keys()).map((s) => ({
  id: s + 1,
  name:
    s <= 27
      ? `${s + 1}${getOrdinal(s + 1)} Day of the Month`
      : s < 31
      ? `${s + 1}${getOrdinal(s + 1)} Day of the Month (or Earlier)`
      : s === 31
      ? "Last Day of the Month"
      : "Payout Date",
}));

export const COLOR_MAP = [
  ["blue", "lightblue", "blue"],
  ["pink", "salmon", "pink"],
  ["green", "lightgreen", "green"],
  ["purple", "plum", "purple"],
  ["orange", "moccasin", "orange"],
  ["pink", "lightpink", "pink"],
  ["teal", "paleturquoise", "teal"],
  ["cyan", "lightcyan", "cyan"],
  ["indigo", "mediumpurple", "indigo"],
  ["goldenrod", "lightyellow", "goldenrod"],
];

export const DARK_COLOR_MAP = [
  ["#1e3a8a", "#3b82f6", "#1e40af"], // blue-900, blue-500, blue-800
  ["#7f1d1d", "#ef4444", "#991b1b"], // red-900, red-500, red-800
  ["#065f46", "#10b981", "#047857"], // emerald-900, green-500, emerald-800
  ["#4c1d95", "#8b5cf6", "#6d28d9"], // violet-900, violet-500, violet-700
  ["#7c2d12", "#f97316", "#c2410c"], // orange-900, orange-500, orange-700
  ["#831843", "#ec4899", "#be185d"], // pink-900, pink-500, pink-700
  ["#134e4a", "#14b8a6", "#0f766e"], // teal-900, teal-500, teal-700
  ["#164e63", "#06b6d4", "#0e7490"], // cyan-900, cyan-500, cyan-700
  ["#312e81", "#6366f1", "#4338ca"], // indigo-900, indigo-500, indigo-700
  ["#78350f", "#eab308", "#b45309"], // amber-900, yellow-500, amber-700
];
