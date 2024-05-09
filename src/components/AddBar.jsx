import React from "react";

function AddBar(props) {

    return(
        <div className="addBar">
            <form  onSubmit={props.handleKeyPress} className="addTaskForm">
            <input type="text" placeholder="Add a task" name="task" id="task" className="searchBarInput" />
            {/* <input name="isChecked" id="isChecked" value={false} /> */}
            <input type="submit" className="submitBtn" value={'Add'} />
            </form>
        </div>
    )
}


export default AddBar