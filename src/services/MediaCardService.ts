import axios from "axios";
import Cookies from "js-cookie";
import { Endpoints } from "../config/Config";
import { fetchMe, refreshAccessToken } from "./MediaService";
import { MediaType } from "../models/Movie";
import { fetchAllPages } from "../utils/Utils";

export const showLoginModal = (type: "fav" | "watch", mediaType: any): void => {
    const button = document.createElement("button");
    button.type = "button";
    button.setAttribute("data-bs-toggle", "modal");
    button.setAttribute("data-bs-target", "#authRequiredModal");
    button.style.display = "none";
    document.body.appendChild(button);
    button.click();
    document.body.removeChild(button);
    const contentEl = document.querySelector("#content");
    if (contentEl) {
        contentEl.innerHTML = `You need to be logged in to add ${mediaType == MediaType.MOVIE ? "this movie" : "this TV show"} to your ${type === "fav" ? "favourites" : "watchlist"}.`;
    }
};

export const toggleFavorite = async (mediaId: any, mediaType: any): Promise<boolean> => {
    try {
        const me: any = await fetchMe();
        if (!me?.username) {
            showLoginModal("fav", mediaType);
            return false;
        }

        await refreshAccessToken();
        const token = Cookies.get("accessToken");
        if (!token) {
            showLoginModal("fav", mediaType);
            return false;
        }

        const favoritesResp = await fetchAllPages(`${Endpoints.FAVOURITES}?username=${me.username}`);
        const mediaIdStr = String(mediaId);
        const isFavorite = favoritesResp.some((item: any) => String(item.tmdbId) === mediaIdStr);

        if (isFavorite) {
            await axios.delete(
                `${Endpoints.HANDLE_FAVOURITES}?id=${mediaId}&type=${mediaType}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            return false;
        } else {
            await axios.post(
                `${Endpoints.HANDLE_FAVOURITES}?id=${mediaId}&type=${mediaType}`,
                {},
                { headers: { Authorization: `Bearer ${token}` } }
            );
            return true;
        }
    } catch (error) {
        console.error(error);
        return false;
    }
};

export const toggleWatchlist = async (mediaId: any, mediaType: any): Promise<boolean> => {
    try {
        const me: any = await fetchMe();
        if (!me?.username) {
            showLoginModal("watch", mediaType);
            return false;
        }

        await refreshAccessToken();
        const token = Cookies.get("accessToken");
        if (!token) {
            showLoginModal("watch", mediaType);
            return false;
        }

        const watchlistResp = await fetchAllPages(`${Endpoints.WATCHLIST}?username=${me.username}`);
        const mediaIdStr = String(mediaId);
        const isInWatchlist = watchlistResp.some((item: any) => String(item.tmdbId) === mediaIdStr);

        if (isInWatchlist) {
            await axios.delete(
                `${Endpoints.HANDLE_WATCHLIST}?id=${mediaId}&type=${mediaType}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            return false;
        } else {
            await axios.post(
                `${Endpoints.HANDLE_WATCHLIST}?id=${mediaId}&type=${mediaType}`,
                {},
                { headers: { Authorization: `Bearer ${token}` } }
            );
            return true;
        }
    } catch (error) {
        console.error(error);
        return false;
    }
};

export const checkIsFavorite = async (mediaId: any): Promise<boolean> => {
    try {
        const me: any = await fetchMe();
        if (!me?.username) return false;

        const favoritesResp = await fetchAllPages(`${Endpoints.FAVOURITES}?username=${me.username}`);
        const mediaIdStr = String(mediaId);
        return favoritesResp.some((item: any) => String(item.tmdbId) === mediaIdStr) || false;
    } catch (error) {
        console.error(error);
        return false;
    }
};

export const checkIsInWatchlist = async (mediaId: any): Promise<boolean> => {
    try {
        const me: any = await fetchMe();
        if (!me?.username) return false;

        const watchlistResp = await fetchAllPages(`${Endpoints.WATCHLIST}?username=${me.username}`)
        const mediaIdStr = String(mediaId);
        return watchlistResp.some((item: any) => String(item.tmdbId) === mediaIdStr) || false;
    } catch (error) {
        console.error(error);
        return false;
    }
};