import React from 'react';

const CrossOut = ({task}) => {
    if (task.done === true) {
      return (
        <div>
          <strike className="item-id">{task.id}</strike>
          <strike className="item-title">{task.title}</strike>
          <strike className='item-description'>{task.description}</strike>
        </div> 
      )
    }
    return (
      <div>
        <span className="item-id">{task.id}</span>
        <span className="item-title" >{task.title}</span>
        <span className='item-description'>{task.description}</span>
      </div>
      
    );
}

export default CrossOut;

