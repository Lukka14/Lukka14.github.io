import { Media, MediaType } from "../models/Movie";
import { RoutePaths } from "../config/Config";
import { getResumeQuery } from "../pages/shared/RecentlyWatchService";
import axios from "axios";

interface MediaWithType extends Media {
  type?: MediaType;
}

export function normalizeString(str: string): string {
  return str.split("_").map(firstToUppercase).join(" ");
}

export function firstToUppercase(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

/**
 * Builds the watch-page path for a media item. Series get their saved resume
 * point appended so a click drops the viewer back on the last episode watched.
 */
export const generateHref = (media: MediaWithType, acc: boolean = false): string => {
  const mediaType = acc ? normalizeType(media.type) : media.mediaType;
  const seriesSuffix =
    mediaType === MediaType.TV_SERIES ? getResumeQuery(media.id) : "";

  return `${RoutePaths.WATCH}?id=${media.id}${seriesSuffix}`;
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

export async function fetchAllPages(endpoint: string) {
  const firstResp = await axios.get(endpoint);
  const totalPages = firstResp.data.page.totalPages
  const allData = [...firstResp.data.content];

  for (let i = 0; i < totalPages; i++) {
    const resp = await axios.get(`${endpoint}&page=${i + 1}`);
    allData.push(...resp.data.content);
  }

  return allData;
}

export function normalizeType(type: string | undefined): MediaType | undefined {
  switch (type?.toUpperCase()) {
    case "MOVIE":
      return MediaType.MOVIE;
    case "TV_SERIES":
      return MediaType.TV_SERIES;
    case "PERSON":
      return MediaType.PERSON;
    default:
      return undefined;
  }
}
