
import React, { useRef, useState } from "react";
import TaskList from "./TaskList";

function SearchBar() {
  const searchRef = useRef(null);
  const [query, setQuery] = useState("");

  function handleSearch() {
    setQuery(searchRef.current.value);
  }

  return (
    <div>
      <input
        ref={searchRef}
        type="text"
        placeholder="Search tasks..."
        onChange={handleSearch}
      />
      <TaskList query={query} />
    </div>
  );
}

export default SearchBar;
