import React, { useEffect, useMemo, useState } from "react";
import { Media } from "../../models/Movie";
import "./about.css";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight, Search, Star } from "lucide-react";

interface DataTableProps {
  mediaList: Media[];
  isLoading?: boolean;
}

const ITEMS_PER_PAGE = 10;

const DataTable: React.FC<DataTableProps> = ({ mediaList, isLoading = false }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const rankedData = useMemo(
    () => mediaList.map((media, index) => ({ media, rank: index + 1 })),
    [mediaList]
  );

  const filteredData = useMemo(() => {
    const needle = searchQuery.trim().toLowerCase();
    if (!needle) return rankedData;
    return rankedData.filter((row) =>
      row.media.title?.toLowerCase().includes(needle)
    );
  }, [rankedData, searchQuery]);

  const totalPages = Math.max(1, Math.ceil(filteredData.length / ITEMS_PER_PAGE));

  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(1);
  }, [currentPage, totalPages]);

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedData = filteredData.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  return (
    <>
      <div className="help-chart-toolbar mb-3 mb-md-4">
        <div className="help-search">
          <Search size={17} className="help-muted flex-shrink-0" />
          <input
            type="search"
            className="help-search-input"
            placeholder="Filter the chart by title..."
            value={searchQuery}
            autoComplete="off"
            aria-label="Filter chart by title"
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>
        <span className="help-page-status">
          {isLoading
            ? "Loading chart..."
            : `${filteredData.length} title${filteredData.length === 1 ? "" : "s"}`}
        </span>
      </div>

      {isLoading ? (
        <div aria-busy="true" aria-label="Loading chart">
          {Array.from({ length: ITEMS_PER_PAGE }).map((_, index) => (
            <div className="help-skeleton-row" key={index} />
          ))}
        </div>
      ) : filteredData.length === 0 ? (
        <div className="help-empty">
          No titles match &quot;{searchQuery}&quot;. Try a different search.
        </div>
      ) : (
        <>
          <div className="help-table-wrapper mb-4">
            <table className="help-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th aria-label="Poster" />
                  <th>Title</th>
                  <th>Rating</th>
                  <th>Year</th>
                  <th>Language</th>
                  <th>Genres</th>
                </tr>
              </thead>
              <tbody>
                {paginatedData.map(({ media, rank }) => (
                  <tr
                    key={media.id ?? rank}
                    tabIndex={0}
                    role="link"
                    onClick={() => navigate(`/watch?id=${media.id}`)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault();
                        navigate(`/watch?id=${media.id}`);
                      }
                    }}
                  >
                    <td className={`help-rank${rank <= 3 ? " help-rank--top" : ""}`}>
                      {String(rank).padStart(2, "0")}
                    </td>
                    <td className="help-poster-cell">
                      {media.posterUrl ? (
                        <img
                          className="help-poster"
                          src={media.posterUrl}
                          alt={media.title ?? "Poster"}
                          loading="lazy"
                        />
                      ) : (
                        <div className="help-poster" />
                      )}
                    </td>
                    <td className="help-title-cell">{media.title}</td>
                    <td>
                      {media.rating ? (
                        <span className="help-rating">
                          <Star size={13} fill="currentColor" />
                          {media.rating.toFixed(1)}
                        </span>
                      ) : (
                        <span className="help-muted">N/A</span>
                      )}
                    </td>
                    <td className="help-muted">
                      {media.releaseYear?.split("-")[0] ?? "N/A"}
                    </td>
                    <td className="help-muted">
                      {media.originalLanguage?.toUpperCase() ?? "N/A"}
                    </td>
                    <td>
                      {media.genreList?.length ? (
                        <div className="help-genres">
                          {media.genreList.slice(0, 3).map((genre) => (
                            <span className="help-genre-tag" key={genre}>
                              {genre}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span className="help-muted">N/A</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="help-pagination">
            <button
              type="button"
              className="help-page-btn"
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft size={16} />
              Previous
            </button>
            <span className="help-page-status">
              Page {currentPage} of {totalPages}
            </span>
            <button
              type="button"
              className="help-page-btn"
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              Next
              <ChevronRight size={16} />
            </button>
          </div>
        </>
      )}
    </>
  );
};

export default DataTable;
