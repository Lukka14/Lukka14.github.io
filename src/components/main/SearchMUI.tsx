import * as React from "react";
import Paper from "@mui/material/Paper";
import InputBase from "@mui/material/InputBase";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import DirectionsIcon from "@mui/icons-material/Directions";

interface SearchBarProps {
  onClick: (query: string) => void;
}

export default function SearchMUI({ onClick }: SearchBarProps) {
  const handleSearch = () => {
    const searchInput = document.querySelector(
      "#movieSearchInput"
    ) as HTMLInputElement;
    const query = searchInput.value;
    onClick(query);
  };

  return (
    <Paper
      component="form"
      sx={{ p: "2px 4px", display: "flex", alignItems: "center", width: 300 }}
    >
      {/* <IconButton sx={{ p: "10px" }} aria-label="menu">
        <MenuIcon />
      </IconButton> */}
      <InputBase
      id="movieSearchInput"
        onChange={handleSearch}
        sx={{ ml: 1, flex: 1 }}
        placeholder="Search Movies"
        inputProps={{ "aria-label": "breaking bad" }}
        autoFocus
      />
      <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
      <IconButton type="button" sx={{ p: "10px" }} aria-label="search" onClick={handleSearch}>
        <SearchIcon />
      </IconButton>
      {/* <IconButton color="primary" sx={{ p: "10px" }} aria-label="directions">
        <DirectionsIcon />
      </IconButton> */}
    </Paper>
  );
}
