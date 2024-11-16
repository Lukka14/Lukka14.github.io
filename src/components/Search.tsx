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

    const enterPressed = (e : React.KeyboardEvent<any>) => {
      e.key === 'Enter' && handleSearch();
      return e;
    }

  
    return (
      <div className="searchBar">
        <input type="text" placeholder="Search..." onKeyDown={e => enterPressed(e)} />
        <button type="button" onClick={handleSearch}>
          Search
        </button>
      </div>
    );
  }
  