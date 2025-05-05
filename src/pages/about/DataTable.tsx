import React, { useState } from "react";
import { Media } from "../../models/Movie";
import "./about.css"
import { useNavigate } from "react-router-dom";

interface DataTableProps {
  mediaList: Media[];
}

const style = `
.table-dark {
  --mdb-table-color: #fff;
  --mdb-table-bg: #232323;
  --mdb-table-border-color: #474242;
  --mdb-table-striped-bg: #1a1919;
  --mdb-table-striped-color: #fff;
  --mdb-table-active-bg: #474242;
  --mdb-table-active-color: #fff;
  --mdb-table-hover-bg: #423d3d;
  --mdb-table-hover-color: #fff;

  color: var(--mdb-table-color);
  background-color: var(--mdb-table-bg) !important;
  border-color: var(--mdb-table-border-color);
}
`;

const DataTable: React.FC<DataTableProps> = ({ mediaList }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const itemsPerPage = 10;

  const filteredData = mediaList.filter((media) =>
    media.title?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = filteredData.slice(startIndex, startIndex + itemsPerPage);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const navigate = useNavigate();

  return (
    <>
      <style>
        {style}
      </style>
      <div
        style={{
          padding: "20px",
          borderRadius: "8px",
        }}
      >
        <div style={{ marginBottom: "20px", textAlign: "center" }}>
          <input
            type="text"
            placeholder="Search by title..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            style={{
              backgroundColor: "#1c2231",
              color: "#f5f5f5",
              padding: "10px",
              width: "60%",
              borderRadius: "5px",
              border: "1px solid #ccc",
            }}
          />
        </div>

        <div style={{ overflowX: "auto", marginBottom: "20px" }}>
          <table
            className="table table-dark table-striped"
            style={{ width: "100%", marginBottom: "20px" }}
          >
            <thead>
              <tr>
                <th>Title</th>
                <th>Rating</th>
                <th>Year</th>
                <th>Language</th>
                <th>Genres</th>
                <th>Poster</th>
              </tr>
            </thead>
            <tbody>
              {paginatedData.map((media, index) => (
                <tr
                  key={index}
                  onClick={() => navigate(`/watch?id=${media.id}`)}
                  style={{ cursor: "pointer" }}
                >
                  <td>{media.title}</td>
                  <td>{media.rating}</td>
                  <td>{media.releaseYear?.split("-")[0]}</td>
                  <td>{media.originalLanguage?.toLocaleUpperCase()}</td>
                  <td>{media.genreList?.join(" | ") || "N/A"}</td>
                  <td>
                    <img
                      src={media.posterUrl}
                      alt={media.title}
                      style={{ width: "50px", height: "auto" }}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div style={{ textAlign: "center" }} className="d-flex align-items-center justify-content-center ">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            style={{ marginRight: "10px" }}
            className="btn btn-outline-primary"
          >
            Previous
          </button>
          <span style={{
            color: "#f5f5f5"
          }}>
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
            style={{ marginLeft: "10px" }}
            className="btn btn-outline-primary"
          >
            Next
          </button>
        </div>
      </div>
    </>
  );
};

export default DataTable;
