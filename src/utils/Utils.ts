import Cookies from "js-cookie";
import { Media, MediaType } from "../models/Movie";
import { RoutePaths } from "../config/Config";

export function normalizeString(str: string): string {
  return str.split("_").map(firstToUppercase).join(" ");
}

function firstToUppercase(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

export const generateHref = (media: Media): string => {
  let seriesSuffix = "";
  if (media.mediaType === MediaType.TV_SERIES) {

    let cookieValue = Cookies.get(String(media?.id));
    if (cookieValue) {
      seriesSuffix = cookieValue;
    } else {
      seriesSuffix = `&s=${1}&e=${1}`;
    }

  }

  return `#${RoutePaths.WATCH}?id=${media.id}${seriesSuffix}`;
};

export const convertMinutes = (totalMinutes: number): { hours: number, minutes: number } => {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  return { hours, minutes };
}

export const formatMoney = (amount: number): string => {
  return amount.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
}