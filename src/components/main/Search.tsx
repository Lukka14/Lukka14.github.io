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

    // search only if enter was pressed
    const enterPressed = (e : React.KeyboardEvent<any>) => {
      e.key === 'Enter' && handleSearch();
      return e;
    }

  
    return (
      <div  className="searchBar">
        {/* <input type="text" placeholder="Search..." onKeyUp={e => enterPressed(e)} /> */}
        <input autoFocus type="text" placeholder="Search..." onChange={handleSearch} />
        <button  type="button" onClick={handleSearch}>
          Search
        </button>
      </div>
    );
  }
  