import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Task from './Task';
import EditButton from './EditButton';
import DeleteButton from './DeleteButton';
import client from '../../../services/requests.service';
import ConfirmPopUp from '../../shared/ConfirmPopUp';

const List = ({ listObj, setBoard, board, currentState, setCurrentState, currentTask, setCurrentTask, listChanged, setListChanged, removeListHandler }) => {
  const [order, setOrder] = useState([]);
  const [edit, setEdit] = useState(false);
  const [title, setTitle] = useState(listObj.state_name);
  const getOrder = async () => {
    const stateOrder = await client.getStateOrderById(listObj.id);
    const orderArr = stateOrder.split('_');
    orderArr.shift();
    setOrder(orderArr);
  };
  useEffect(() => {
    getOrder();
  }, [listObj]);
  const handleClick = (e) => {};
  const location = useLocation();
  const tasks = [];
  for (let element of order) {
    let item = listObj.tasks?.find((obj) => obj.id == element);
    if (item) {
      tasks.push(item);
    }
  }

  const deleteState = async () => {
    await client.deleteState(listObj.id);
    removeListHandler(listObj.id);
  };

  const editState = async () => {
    if (edit && listObj.state_name !== title) {
      if (title.length >= 2) {
        const newState = await client.updateState(listObj.id, title);
        let newStatesArr = board.states.map((cur) => {
          if (cur.id == listObj.id) {
            return newState;
          }
          return cur;
        });
        setBoard((prevState) => {
          let newState = {
            boardObj: {
              ...prevState.boardObj,
              states: newStatesArr,
            },
          };
          return newState;
        });
        setListChanged(!listChanged);
        return setEdit(!edit);
      }
      return alert('title should have at least 2 characters');
    }
    setEdit(!edit);
  };

  function dragOverHandler(e) {
    e.preventDefault();
    if (e.target.classList.contains('task')) {
      e.target.style.boxShadow = '0 4px 3px red';
    }
  }

  async function dropTaskHandler(e, state) {
    await client.moveTask(currentState.id, state.id, currentTask.id, 0);
    listObj.tasks.push(currentTask);
    const currentIndex = currentState.tasks.indexOf(currentTask);
    currentState.tasks.splice(currentIndex, 1);
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
      };
      return newState;
    });
    setListChanged(!listChanged);
    e.target.style.boxShadow = 'none';
  }

  const [showConfirmPopUp, setShowConfirmPopUp] = useState(false);
  const openPopUp = () => {
    setShowConfirmPopUp(true);
  };

  const removePopUp = () => {
    setShowConfirmPopUp(false);
  };

  const taskElements = tasks.map((taskObj, idx) => (
    <Task
      key={taskObj.id}
      listObj={listObj}
      taskObj={taskObj}
      setBoard={setBoard}
      board={board}
      currentState={currentState}
      setCurrentState={setCurrentState}
      currentTask={currentTask}
      setCurrentTask={setCurrentTask}
      listChanged={listChanged}
      setListChanged={setListChanged}
    />
  ));

  return (
    <>
      {showConfirmPopUp && <ConfirmPopUp removePopUp={removePopUp} handleAction={deleteState} />}
      <div className="list">
        {!edit ? (
          <div className="list-title">
            <span className="list-name">{listObj.state_name}</span>
            <div className="btn-wrapper">
              <EditButton handleClick={editState} />
              <DeleteButton handleClick={openPopUp} />
            </div>
          </div>
        ) : (
          <div className="edit-wrapper">
            <input minLength={2} autoFocus type="text" name="state-title" className="state-title-input" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Enter state title..." />
            <button className="btn btn-secondary btn-sm" onClick={() => editState()}>
              Save
            </button>
          </div>
        )}

        <div className="task-container">
          {taskElements}
          <Link
            onClick={handleClick}
            replace={true}
            to={{
              pathname: `${location.pathname}/task/create/${listObj.id}`,
            }}
            onDragOver={(e) => dragOverHandler(e)}
            onDrop={(e) => dropTaskHandler(e, listObj)}
          >
            <button className="add-task-btn card">
              <span>Add a task</span>
            </button>
          </Link>
        </div>
      </div>
    </>
  );
};

export default List;
