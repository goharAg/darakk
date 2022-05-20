import React, { useState, useEffect, useRef } from 'react';
import closeBtn from '../../../Assets/Images/closeBtn.svg';
import client from '../../../services/requests.service';
import LoadingButton from '../../shared/LoadingButton';

const CreateBoardPopover = ({ boards, setBoards, setPopupOpen }) => {
  const createBoardPopover = useRef(null);

  const [state, setState] = useState({
    boardName: '',
    createBtnDisabled: true,
  });

  useEffect(() => {
    const handleClick = (e) => {
      const popover = createBoardPopover.current;
      if (popover && !popover.contains(e.target)) {
        if (createBoardPopover) setPopupOpen(false);
      }
    };

    // add a listener for click outside of popover
    window.addEventListener('click', handleClick);

    return () => {
      window.removeEventListener('click', handleClick);
    };
  }, []);

  const handleChange = (e) => {
    let createBtnDisabled;
    if (e.target.value.length > 0) {
      createBtnDisabled = false;
    } else {
      createBtnDisabled = true;
    }

    setState({ boardName: e.target.value, createBtnDisabled });
  };

  const handleCloseBtnClick = () => {
    setPopupOpen(false);
  };

  const handleCreateBtnClick = async () => {
    if (state.boardName) {
      const createdBoard = await client.createBoard(state.boardName);
      const boardObj = { ...createdBoard, UserBoardMapping: { is_admin: true } };

      setBoards([...boards, boardObj]);
      setPopupOpen(false);
    }
  };

  return (
    <div ref={createBoardPopover} className="create-board-popover">
      <div className="popover-header">
        <span>Create a board</span>
        <img onClick={handleCloseBtnClick} className="close-btn" src={closeBtn} />
        {/* TO DO: replace with CloseButton component */}
      </div>
      <div className="popover-body">
        <span>Board name</span>
        <input onChange={handleChange} type="text" />
        <LoadingButton onClick={handleCreateBtnClick} disabled={state.createBtnDisabled} className="create-btn" text="Create" />
      </div>
    </div>
  );
};

export default CreateBoardPopover;
