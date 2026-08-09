import axios from "axios";
import Cookies from "js-cookie";
import { Endpoints } from "../config/Config";
import { MediaType } from "../models/Movie";
import { fetchAllPages } from "../utils/Utils";
import { getCurrentUser } from "./UserService";
import { requestAuth } from "../pages/shared/modals/modal-utils";

export const showLoginModal = (type: "fav" | "watch", mediaType: any): void => {
    requestAuth({
        intent: type,
        subject: mediaType == MediaType.MOVIE ? "this movie" : "this TV show",
    });
};

export const toggleFavorite = async (mediaId: any, mediaType: any, setIsFavorite: any): Promise<boolean> => {
    try {
        const me: any = await getCurrentUser();
        if (!me?.username) {
            showLoginModal("fav", mediaType);
            setIsFavorite(false);
            return false;
        }

        // await refreshAccessToken();
        const token = Cookies.get("accessToken");
        // if (!token) {
        //     showLoginModal("fav", mediaType);
        //     return false;
        // }

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

export const toggleWatchlist = async (mediaId: any, mediaType: any, setIsInWatchList: any): Promise<boolean> => {
    try {
        const me: any = await getCurrentUser();
        if (!me?.username) {
            showLoginModal("watch", mediaType);
            setIsInWatchList(false)
            return false;
        }

        // await refreshAccessToken();
        const token = Cookies.get("accessToken");
        // if (!token) {
        //     showLoginModal("watch", mediaType);
        //     return false;
        // }

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
        const me: any = await getCurrentUser();
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
        const me: any = await getCurrentUser();
        if (!me?.username) return false;

        const watchlistResp = await fetchAllPages(`${Endpoints.WATCHLIST}?username=${me.username}`)
        const mediaIdStr = String(mediaId);
        return watchlistResp.some((item: any) => String(item.tmdbId) === mediaIdStr) || false;
    } catch (error) {
        console.error(error);
        return false;
    }
};