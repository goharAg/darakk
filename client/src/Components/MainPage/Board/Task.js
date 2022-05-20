import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import EditButton from './EditButton';
import client from '../../../services/requests.service';

const Task = ({ taskObj, listObj, setBoard, board, currentState, setCurrentState, currentTask, setCurrentTask, listChanged, setListChanged }) => {
  const location = useLocation();
  const handleClick = (e) => {};

  function dragOverHandler(e) {
    e.preventDefault();
    if (e.target.classList.contains('task')) {
      e.target.style.boxShadow = '0 -4px 3px red';
    }
  }

  function dragLeaveHandler(e) {
    e.target.style.boxShadow = 'none';
  }

  function dragStartHandler(e, state, task) {
    setCurrentState(state);
    setCurrentTask(task);
  }

  function dragEndHandler(e) {
    e.target.style.boxShadow = 'none';
  }

  async function dropHandler(e, state, task) {
    e.preventDefault();
    const currentIndex = currentState.tasks.indexOf(currentTask);
    currentState.tasks.splice(currentIndex, 1);
    const dropIndex = state.tasks.indexOf(task);
    state.tasks.splice(dropIndex + 1, 0, currentTask);
    await client.moveTask(currentState.id, state.id, currentTask.id, task.id);
    let newStatesArr = board.states.map((st) => {
      switch (st.id) {
        case state.id:
          return state;
        case currentState.id:
          return currentState;
        default:
          return st;
      }
    });
    setBoard((prevState) => {
      let newState = {
        boardObj: {
          ...prevState.boardObj,
          states: newStatesArr,
        },
        isLoading: true,
      };
      return newState;
    });
    setListChanged(!listChanged);
    e.target.style.boxShadow = 'none';
  }
  return (
    <div>
      <Link
        draggable="true"
        onDragOver={(e) => dragOverHandler(e)}
        onDragLeave={(e) => dragLeaveHandler(e)}
        onDragStart={(e) => dragStartHandler(e, listObj, taskObj)}
        onDragEnd={(e) => dragEndHandler(e)}
        onDrop={(e) => dropHandler(e, listObj, taskObj)}
        onClick={handleClick}
        replace={true}
        to={{
          pathname: `${location.pathname}/task/${taskObj.id}`,
        }}
        className="task card card-body"
      >
        <div className="task-title">{taskObj.title}</div>
      </Link>
    </div>
  );
};

export default Task;
