const SearchBar = ({ value, onChange }) => {
  return (
    <div className="searchbar">
      <input 
        type="text"
        placeholder="Search students..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      <button className="filter-btn">Filter</button>
    </div>
  );
};

export default SearchBar;
