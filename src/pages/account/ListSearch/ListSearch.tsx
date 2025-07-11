import { Search, Clock, X, HeartIcon, BookmarkIcon } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useAsyncError, useNavigate, useParams } from "react-router-dom";
import { Endpoints } from "../../../config/Config";
import { Media } from "../../../models/Movie";
import {
    fetchUserByUsername,
} from "../../../services/MediaService";
import { fetchAllPages, generateHref, normalizeType } from "../../../utils/Utils";
import { Background } from "../../main/Background";
import { MediaCard } from "../../main/MediaCard";
import NotFoundPage from "../../shared/NotFoundPage";
import PrimarySearchAppBar from "../../shared/TopNavBar";
import { getCurrentUser, getUsername } from "../../../services/UserService";
import { Pagination } from "../Pagination/Pagination";
import './ListSearch.css';
import { WorkInProgress } from "../../shared/WorkInProgress";
import { LoadingSpinner } from "../../main/LoadingSpinner";

const fetchPageData = async (endpoint: any, page = 0) => {
    try {
        const response = await fetch(`${endpoint}&page=${page}`);
        if (!response.ok) {
            throw new Error('Something went wrong!');
        }
        return await response.json();
    } catch (error) {
        return null;
    }
};

const ListSearch: React.FC = () => {
    const [medias, setMedias] = useState<Media[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [filteredList, setFilteredList] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [is404, setIs404] = useState<boolean>(false);

    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [pageSize, setPageSize] = useState(20);

    const [searchCurrentPage, setSearchCurrentPage] = useState(0);
    const [searchPageSize] = useState(20);

    const [allData, setAllData] = useState<any[]>([]);

    const { username, "list-type": listType } = useParams<{
        username: string;
        "list-type": string;
    }>();

    const [user, setUser] = useState<any>({
        username: username,
        avatar: `https://api.dicebear.com/9.x/bottts-neutral/svg?seed=${username}&backgroundType=gradientLinear,solid`,
        createdAt: new Date("2023-01-01"),
    });

    const [isCurrentUserProfile, setIsCurrentUserProfile] = useState(false);
    const [favourites, setFavourites] = useState<any[]>([]);
    const [watchlist, setWatchlist] = useState<any[]>([]);
    const [watched, setWatched] = useState<any[]>([]);
    const cookieUsername = getUsername();
    const [fav, setFav] = useState([])
    const [watch, setWatch] = useState([])
    const navigate = useNavigate();
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

    const getListInfo = () => {
        switch (listType) {
            case "watchlist":
                return {
                    icon: <BookmarkIcon className="text-primary me-2" style={{
                        cursor: "pointer",
                        fill: "#00BFFF",
                        stroke: "#87CEFA",
                    }} size={22} />,
                    title: "Watchlist",
                    data: watchlist,
                    emptyTitle: isCurrentUserProfile
                        ? "Your watchlist is empty"
                        : `${username}'s watchlist is empty`,
                    emptyMessage: isCurrentUserProfile
                        ? "Add movies and TV shows to watchlist and they will appear here"
                        : `${username} currently has no movies or TV shows added to watchlist`
                };
            case "watched":
                return {
                    icon: <Clock className="text-success me-2" size={22} />,
                    title: "Watched",
                    data: watched,
                    emptyTitle: isCurrentUserProfile
                        ? "Your watched list is empty"
                        : `${username}'s watched list is empty`,
                    emptyMessage: isCurrentUserProfile
                        ? "Watch at least half of a movie and they will appear here"
                        : `${username} currently has not watched any movie`
                };
            default:
                return {
                    icon: <HeartIcon className="me-2" style={{
                        cursor: "pointer",
                        fill: "orange",
                        stroke: "#FFD580",
                    }} size={22} />,
                    title: "favourites",
                    data: favourites,
                    emptyTitle: isCurrentUserProfile
                        ? "Your favourites list is empty"
                        : `${username}'s favourites list is empty`,
                    emptyMessage: isCurrentUserProfile
                        ? "Add movies and TV shows to favourites and they will appear here"
                        : `${username} currently has no movies or TV shows added to favourites`
                };
        }
    };

    function stateHandler(id: any, type: any, action = 'remove') {
        if (type === "watchlist") {
            if (action === 'remove') {
                setWatchlist((prev) => {
                    const updated = prev.filter((item) => item.id !== id);
                    return updated;
                });
                setAllData((prev) => prev.filter((item) => item.id !== id));
                setFilteredList((prev) => prev.filter((item) => item.id !== id));
            }
        } else if (type === "favourites") {
            if (action === 'remove') {
                setFavourites((prev) => {
                    const updated = prev.filter((item) => item.id !== id);
                    return updated;
                });
                setAllData((prev) => prev.filter((item) => item.id !== id));
                setFilteredList((prev) => prev.filter((item) => item.id !== id));
            }
        }
    }

    const handleSearch = (query: string) => {
        setSearchQuery(query);
        setSearchCurrentPage(0);

        if (!query.trim()) {
            if (searchQuery) {
                const startIndex = currentPage * pageSize;
                const endIndex = startIndex + pageSize;
                setFilteredList(allData.slice(startIndex, endIndex));
            }
            return;
        }

        const filtered = allData.filter((item: any) =>
            item.title?.toLowerCase().includes(query.toLowerCase())
        );

        const startIndex = searchCurrentPage * searchPageSize;
        const endIndex = startIndex + searchPageSize;
        setFilteredList(filtered.slice(startIndex, endIndex));
    };

    const handlePageChange = async (newPage: number) => {
        if (newPage < 0) return;

        if (searchQuery.trim()) {
            setSearchCurrentPage(newPage);
            const filtered = allData.filter((item: any) =>
                item.title?.toLowerCase().includes(searchQuery.toLowerCase())
            );
            const startIndex = newPage * searchPageSize;
            const endIndex = startIndex + searchPageSize;
            setFilteredList(filtered.slice(startIndex, endIndex));
            return;
        }

        if (newPage >= totalPages) return;

        setIsLoading(true);
        setCurrentPage(newPage);

        if (allData.length > 0) {
            const startIndex = newPage * pageSize;
            const endIndex = startIndex + pageSize;
            setFilteredList(allData.slice(startIndex, endIndex));
            setIsLoading(false);
            return;
        }

        let endpoint = '';
        let setListFn = setFavourites;

        switch (listType) {
            case 'watchlist':
                endpoint = `${Endpoints.WATCHLIST}?username=${user.username}`;
                setListFn = setWatchlist;
                break;
            case 'watched':
                endpoint = `${Endpoints.WATCHED}?username=${user.username}`;
                setListFn = setWatched;
                break;
            default:
                endpoint = `${Endpoints.FAVOURITES}?username=${user.username}`;
                setListFn = setFavourites;
        }

        const result = await fetchPageData(endpoint, newPage);

        if (result) {
            const processed = result.content
                .map((item: any) => ({
                    ...item,
                    id: item.tmdbId
                }))
                .sort((a: any, b: any) => new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime());

            setFilteredList(processed);
            setTotalPages(result.page.totalPages);
            setPageSize(result.page.size);
        }

        setIsLoading(false);
    };

    useEffect(() => {
        setIs404(false);
        setIsLoading(true);
        setSearchQuery("");
        setFilteredList([]);
        setCurrentPage(0);
        setSearchCurrentPage(0);
        setTotalPages(1);
        setPageSize(20);
        setAllData([]);
        setFavourites([]);
        setWatchlist([]);
        setWatched([]);
        setFav([]);
        setWatch([]);
        setIsCurrentUserProfile(false);
        setIsLoggedIn(false);

        setUser({
            username: username,
            avatar: `https://api.dicebear.com/9.x/bottts-neutral/svg?seed=${username}&backgroundType=gradientLinear,solid`,
            createdAt: new Date("2023-01-01"),
        });

        async function fetchUser() {
            const me = await getCurrentUser();
            if (me?.username && me?.username?.toLowerCase() === username?.toLowerCase()) {
                setUser((prev: any) => {
                    const updated = { ...prev, ...me };
                    setIsCurrentUserProfile(true);
                    return updated;
                });
                setIsLoggedIn(true);
            }
        }

        async function fetchUserByUsrname() {
            const userByUsername = await fetchUserByUsername(username!);
            if (userByUsername) {
                setUser((prev: any) => ({ ...prev, ...userByUsername }));
                window.history.replaceState({}, '', `/#/profile/` + userByUsername.username + `/` + listType);
            } else {
                setIs404(true);
            }
        }

        if (cookieUsername) {
            if (username?.toLowerCase() == cookieUsername?.toLowerCase()) {
                setIsCurrentUserProfile(true);
                fetchUser();
            } else {
                setIsCurrentUserProfile(false);
                fetchUserByUsrname();
            }
        } else {
            setIsCurrentUserProfile(false);
            fetchUserByUsrname();
        }
    }, [username, listType]);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                let endpoint = '';
                let setListFn = setFavourites;

                switch (listType) {
                    case 'watchlist':
                        endpoint = `${Endpoints.WATCHLIST}?username=${user.username}`;
                        setListFn = setWatchlist;
                        break;
                    case 'watched':
                        endpoint = `${Endpoints.WATCHED}?username=${user.username}`;
                        setListFn = setWatched;
                        break;
                    default:
                        endpoint = `${Endpoints.FAVOURITES}?username=${user.username}`;
                        setListFn = setFavourites;
                }

                const allDataResult = await fetchAllPages(endpoint);

                if (allDataResult && allDataResult.length > 0) {
                    const processedAll = allDataResult
                        .map((item: any) => ({
                            ...item,
                            id: item.tmdbId
                        }))
                        .sort((a: any, b: any) => new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime());

                    setAllData(processedAll);
                    setListFn(processedAll);

                    const firstPageData = processedAll.slice(0, pageSize);
                    setFilteredList(firstPageData);
                    setTotalPages(Math.ceil(processedAll.length / pageSize));
                } else {
                    const result = await fetchPageData(endpoint, currentPage);

                    if (result) {
                        const processed = result.content
                            .map((item: any) => ({
                                ...item,
                                id: item.tmdbId
                            }))
                            .sort((a: any, b: any) => new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime());

                        setFilteredList(processed);
                        setListFn(processed);
                        setTotalPages(result.page.totalPages);
                        setPageSize(result.page.size);
                    }
                }

            } catch (error) {
                console.error(error);
            } finally {
                setIsLoading(false);
            }
        };

        if (user.username && listType) fetchData();
    }, [user.username, listType]);

    useEffect(() => {
        async function getT() {
            if (!cookieUsername) return;

            try {
                const favEndpoint = `${Endpoints.FAVOURITES}?username=${cookieUsername}`;
                const watchEndpoint = `${Endpoints.WATCHLIST}?username=${cookieUsername}`;

                const [favouritesData, watchlistData] = await Promise.all([
                    fetchAllPages(favEndpoint),
                    fetchAllPages(watchEndpoint),
                ]);

                setFav(favouritesData as any);
                setWatch(watchlistData as any);
            } catch (err) {
                console.error(err);
            }
        }

        if (username && cookieUsername) {
            getT();
        }
    }, [username, listType, cookieUsername]);

    if (is404) {
        return <NotFoundPage />;
    }

    if (isLoading) {
        return (
            <>
                <Background url="https://github.com/Lukka14/Lukka14.github.io/blob/master/public/assets/movieplus-full-bg.png?raw=true" />
                <PrimarySearchAppBar onClick={() => { }} displaySearch={false} />
                <div className="container-xl d-flex align-items-center justify-content-center" style={{ height: "70vh" }}>
                    <LoadingSpinner initial={true} />
                </div>
            </>
        );
    }

    const { icon, title, data, emptyTitle, emptyMessage } = getListInfo();

    return (
        <>
            <Background url="https://github.com/Lukka14/Lukka14.github.io/blob/master/public/assets/movieplus-full-bg.png?raw=true" />
            <PrimarySearchAppBar onClick={() => { }} displaySearch={false} />

            <div className="container-xl pt-4 pb-0 pb-sm-5 px-0 px-sm-4">

                <div
                    className="rounded shadow-lg p-4 mb-4"
                    style={{
                        background: "rgba(15, 15, 15, 0.75)",
                        backdropFilter: "blur(8px)",
                    }}
                >
                    <div className="d-flex justify-content-between align-items-center flex-wrap mb-4 gap-3">
                        <div className="d-flex align-items-center">
                            {icon}
                            <h1 className="fs-3 fw-bold text-white mb-0 ms-2">
                                {username === cookieUsername ? `Your ${title}` : `${username}'s ${title}`}
                            </h1>
                        </div>

                        <div className="position-relative col-md-4">
                            <input
                                type="text"
                                placeholder={`Search ${title.toLowerCase()}...`}
                                value={searchQuery}
                                onChange={(e) => handleSearch(e.target.value)}
                                className="form-control bg-dark text-white rounded-pill"
                                style={{ paddingLeft: "40px" }}
                            />
                            <Search className="position-absolute text-secondary"
                                style={{ left: "15px", top: "10px" }}
                                size={18} />
                            {searchQuery && (
                                <button
                                    onClick={() => handleSearch("")}
                                    className="btn position-absolute p-0"
                                    style={{ right: "15px", top: "8px" }}
                                >
                                    <X size={18} className="text-secondary" />
                                </button>
                            )}
                        </div>

                        <button
                            onClick={() => navigate(-1)}
                            className="btn btn-outline-primary d-flex items-align-center goBackBtn"
                            style={{ marginRight: "20px", color: "#f5f5f5", border: "none" }}
                        >
                            <span>←</span>
                            <span style={{
                                borderBottom: "1px solid #f5f5f5",
                                borderRadius: "5px",
                                marginLeft: "5px"
                            }}>GO BACK</span>
                        </button>
                    </div>

                    {filteredList && filteredList.length > 0 ? (
                        <>
                            <div className="row row-cols-2 row-cols-sm-3 row-cols-md-4 row-cols-lg-5 g-3 mt-3">
                                {filteredList.map((media: any) => {
                                    const isFav = fav.some((item: any) => item.tmdbId == media.id);
                                    const isWatch = watch.some((item: any) => item.tmdbId == media.id);
                                    const mediaType = normalizeType(media.type);
                                    const link = generateHref(media, true);

                                    return (
                                        <div key={media.id} className="col">
                                            <MediaCard
                                                mediaInfo={{
                                                    id: media.id,
                                                    mediaType: mediaType,
                                                    title: media.title,
                                                    posterUrl: media.posterUrl,
                                                    rating: media.rating,
                                                    releaseYear: media.releaseYear,
                                                    backDropUrl: media.backDropUrl,
                                                    originalLanguage: media.originalLanguage,
                                                    genreList: media.genreList
                                                }}
                                                href={link}
                                                isFav={isFav}
                                                isWatch={isWatch}
                                                stateHandler={stateHandler}
                                                isLoggedIn={isLoggedIn}
                                            />
                                        </div>
                                    );
                                })}
                            </div>

                            <Pagination
                                currentPage={searchQuery.trim() ? searchCurrentPage : currentPage}
                                totalPages={searchQuery.trim() ?
                                    Math.ceil(allData.filter((item: any) =>
                                        item.title?.toLowerCase().includes(searchQuery.toLowerCase())
                                    ).length / searchPageSize) :
                                    totalPages
                                }
                                onPageChange={handlePageChange}
                                searchQuery={searchQuery}
                                maxPageButtons={5}
                                showWhenSearching={true}
                            />
                        </>
                    ) : (
                        <div className="similar-movies-track-container">
                            {searchQuery ? (
                                <WorkInProgress
                                    text="No matches found"
                                    subtext="Try a different search term or clear the search"
                                />
                            ) : (
                                <WorkInProgress
                                    text={emptyTitle}
                                    subtext={emptyMessage}
                                />
                            )}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default ListSearch;