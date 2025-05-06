import axios from "axios";
import Cookies from "js-cookie";
import { Endpoints } from "../config/Config";
import { User } from "../pages/shared/TopNavBar";

const accessTokenCookieName = "accessToken";
const usernameCookieName = "username";

// Refresh token from server and store in cookies
const refreshAccessToken = async (): Promise<string | undefined> => {
    try {
        const res = await axios.post(Endpoints.ACCESS_TOKEN, {}, { withCredentials: true });

        const accessToken = res.data.token;

        Cookies.set(accessTokenCookieName, accessToken, {
            expires: new Date(Date.now() + res.data.expiresIn),
            secure: true,
            sameSite: "Strict",
        });

        return accessToken;
    } catch (error) {
        return undefined;
    }
};

// Gets the current access token (from cookie or by refreshing)
export const getAccessToken = async (): Promise<string | undefined> => {
    let accessToken = Cookies.get(accessTokenCookieName);

    if (!accessToken) {
        accessToken = await refreshAccessToken();
    }

    return accessToken;
};

const fetchUserData = async (token: string): Promise<User | undefined> => {
    try {
        const res = await axios.get(Endpoints.ME, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        Cookies.set(usernameCookieName, res.data.username, {
            expires: new Date(Date.now() + res.data.expiresIn),
            secure: true,
            sameSite: "Strict",
        });

        return res.data;
    } catch (err: any) {
        if (err.response?.status === 401) {
            throw new Error("Unauthorized");
        }
        console.error("Error fetching user data:", err);
        return undefined;
    }
};

const handle401AndRetry = async (): Promise<User | undefined> => {
    const newToken = await refreshAccessToken();

    if (!newToken) return undefined;

    try {
        return await fetchUserData(newToken);
    } catch (retryErr) {
        console.error("Retry after token refresh failed:", retryErr);
        return undefined;
    }
};

export const getCurrentUser = async (): Promise<User | undefined> => {
    const accessToken = await getAccessToken();
    if (!accessToken) {
        return undefined
    }

    try {
        return await fetchUserData(accessToken);
    } catch (err: any) {
        if (err.message === "Unauthorized") {
            return await handle401AndRetry();
        }
        console.error("Error in getCurrentUser():", err);
        return undefined;
    }
};


// Get the username from cookies
export const getUsername = (): string | undefined => {
    return Cookies.get(usernameCookieName);
};

export const logout = async (): Promise<void> => {
    try {
        await axios.post(Endpoints.LOGOUT, {}, { withCredentials: true });
    } catch (error) {
        console.error("Error during logout:", error);
    } finally {
        Cookies.remove(accessTokenCookieName);
        Cookies.remove(usernameCookieName);
    }
}
