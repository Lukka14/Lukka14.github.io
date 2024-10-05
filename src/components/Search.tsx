interface SearchBarProps {
    onClick: (query: string) => void; // Let it accept a search term
  }
  
  export function Search({ onClick }: SearchBarProps) {
    const handleSearch = () => {
      const searchInput = document.querySelector(
        ".searchBar input"
      ) as HTMLInputElement;
      const query = searchInput.value;
      onClick(query); // Pass the query back to the parent
    };
  
    return (
      <div className="searchBar">
        <input type="text" placeholder="Search..." />
        <button type="button" onClick={handleSearch}>
          Search
        </button>
      </div>
    );
  }
  