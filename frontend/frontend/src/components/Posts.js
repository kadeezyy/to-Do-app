import React from "react";
import CrossOut from "./CrossOut";

const Posts = ({ tasks, doneTask, startEdit, deleteTask, loading }) => {
  if (loading) {
    return <h2>Loading...</h2>;
  }
  

  return (
    <div id="list-wrapper">
      {tasks.map(function(task, index) {
        return (
          <div key={(index)} className="task-wrapper flex-wrapper">
            <div className="item-info" onClick={() => {doneTask(task);}}  >
              <CrossOut task={task}/>
            </div>
            <div> 
              <button style={{flex:1}} onClick={() => startEdit(task)} className="btn btn-sm btn-outline-info">Edit</button>
            </div>
            <div >
              <button style={{flex:1}} onClick={() => deleteTask(task)} className="btn btn-sm btn-outline-dark delete">Delete</button>
            </div>
          </div>
        )
      })}
    </div>
  );
};

export default Posts;

