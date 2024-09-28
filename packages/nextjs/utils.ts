import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function uppercaseFirstLetter(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function trimAddress(address: string, trimSize = 6) {
  return `${address.slice(0, trimSize)}...${address.slice(-trimSize)}`;
}
