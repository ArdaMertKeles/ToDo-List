import React from "react";

function SearchBar(props) {
    return(
        <div className="searchBar">
            <input type="text" onChange={props.search} placeholder="Search a task" className="searchBarInput" />
        </div>
    )
}


export default SearchBar