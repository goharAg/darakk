import React, { useState, useEffect, useRef } from 'react';
import { Outlet, useParams } from 'react-router-dom';
import List from './List';
import Member from './Member';
import client from '../../../services/requests.service';
import './Board.css';
import Loading from '../../shared/Loading';
import ErrorWrapper from '../../shared/ErrorWrapper';
import LoadingButton from '../../shared/LoadingButton';
import { useAuth } from '../../../AuthContext';

import { updateStates, updateTasks, updateMembers } from '../../../handlers/socket.handler';
import { io } from 'socket.io-client';
const socket = io(client.HOST_NAME);

const Board = () => {
  const id = Number(useParams().boardId);
  const createListContainer = useRef(null);
  const createListInput = useRef(null);
  const { user } = useAuth();

  const [state, setState] = useState({
    boardObj: {},
    isLoading: true,
    error: null,
  });
  const [openListInput, setOpenListInput] = useState(false);
  //TODO: add another state to listen to in useEffect, only when list is created
  const [listChanged, setListChanged] = useState(false);
  const [currentState, setCurrentState] = useState(null);
  const [currentTask, setCurrentTask] = useState(null);
  const [members, setMembers] = useState([]);

  useEffect(async () => {
    setMembers(await client.getBoardMembers(id));
  }, []);

  const handleCreateListClick = async () => {
    setOpenListInput(true);
  };

  const setBoardObj = (boardObj) => {
    setState({ ...state, ...boardObj });
  };

  const fetchBoard = async () => {
    await new Promise((res) => setTimeout(res, 800));
    try {
      const boardObj = await client.getBoardById(id);
      setState({ isLoading: false, error: null, boardObj });
    } catch (error) {
      setState({ ...state, isLoading: false, error });
    }
  };

  const handleSocketStateChange = (res) => {
    if (user.id === res.userId) return; // activate to skip change requested user state update
    updateStates(res, state, setState, fetchBoard);
  };
  const handleSocketTaskChange = (res) => {
    // if (user.id === res.userId) return; // activate to skip change requested user state update
    updateTasks(res, state, setState, listChanged, setListChanged, fetchBoard);
  };

  const handleSocketMemberChange = (res) => {
    if (user.id === res.userId) return; // activate to skip change requested user state update
    updateMembers(res, setMembers, members);
  };
  const fetchCreateList = async (listObj) => {
    await new Promise((res) => setTimeout(res, 800));
    try {
      const name = createListInput.current.value;
      const listObj = await client.createState(id, name);
      setState({ ...state, boardObj: { ...state.boardObj, states: [...state.boardObj.states, listObj] } });
      setListChanged(!listChanged);
      setOpenListInput(false);
    } catch (error) {
      setState({ ...state, error });
    }
  };

  const removeList = (id) => {
    const newStatesArr = state.boardObj.states.filter((cur) => cur.id != id);
    setState({ ...state, boardObj: { ...state.boardObj, states: newStatesArr } });
    setListChanged(!listChanged);
  };

  useEffect(() => {
    fetchBoard();
  }, [listChanged]);
  //listChanged
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (createListContainer.current && !createListContainer.current.contains(event.target)) {
        setOpenListInput(false);
      }
    };
    window.addEventListener('click', handleClickOutside, { capture: true });

    return () => {
      window.removeEventListener('click', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    socket.emit('boardId', id);
  }, []);

  useEffect(() => {
    socket.on('state', handleSocketStateChange);
    socket.on('task', handleSocketTaskChange);
    socket.on('member', handleSocketMemberChange);
    return () => {
      socket.off('state', handleSocketStateChange);
      socket.off('task', handleSocketTaskChange);
      socket.off('member', handleSocketMemberChange);
    };
  }, [handleSocketStateChange, handleSocketTaskChange, handleSocketMemberChange]);

  //drag and drop handling
  //states - state.boardObj.states
  const listElements = state.boardObj.states?.map((listObj, idx) => (
    <List
      currentState={currentState}
      setCurrentState={setCurrentState}
      currentTask={currentTask}
      setCurrentTask={setCurrentTask}
      key={listObj.order}
      listObj={listObj}
      setBoard={setBoardObj}
      board={state.boardObj}
      listChanged={listChanged}
      setListChanged={setListChanged}
      removeListHandler={removeList}
    />
  ));

  return (
    <Loading isLoading={state.isLoading}>
      <ErrorWrapper error={state.error} tryAgainCallback={fetchBoard}>
        <div className="board bg-dark">
          <div className="board-header">
            {state.boardObj.name}
            <Member members={members} setMembers={setMembers} boardId={id} boardState={state} setBoardState={setState} />
          </div>
          <div className="list-container">
            {listElements}
            <div ref={createListContainer} className="mother-div">
              {openListInput ? (
                <div className="create-list-container">
                  <input autoFocus ref={createListInput} type="text" className="create-list-input form-control" />
                  <LoadingButton text="Add" onClick={fetchCreateList} />
                </div>
              ) : (
                <button onClick={handleCreateListClick} className="create-list-btn">
                  Add another list
                </button>
              )}
            </div>
          </div>
          <Outlet context={[state, setState, listChanged, setListChanged, members]} />
        </div>
      </ErrorWrapper>
    </Loading>
  );
};

export default Board;
