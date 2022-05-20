import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import adminIcon from '../../../Assets/Images/adminIcon.png';
import client from '../../../services/requests.service';
import ConfirmPopUp from '../../shared/ConfirmPopUp';

const BoardItem = ({ boardName, boardId, isAdmin, boards, setBoards, dashboardChanged, setDashboardChanged }) => {
  const [edit, setEdit] = useState(false);
  const [title, setTitle] = useState(boardName);

  const handleDeleteBoard = async (e) => {
    e.preventDefault();
    await client.deleteBoard(boardId);
    let newBoards = boards.filter((cur) => cur.id !== boardId);
    setBoards(newBoards);
  };

  const handleEditBoard = async (e) => {
    e.preventDefault();
    if (!edit) {
      return setEdit(!edit);
    }
    if (title !== boardName) {
      if (title.length < 2) {
        return alert('BOard name should contain at least 2 characters');
      }
      const newBoard = await client.updateBoard(boardId, title);
      setDashboardChanged(!dashboardChanged);
    }
    setEdit(!edit);
  };

  const stopRedirect = (e) => {
    e.preventDefault();
  };
  const [showConfirmPopUp, setShowConfirmPopUp] = useState(null);
  const openPopUp = (e) => {
    e.preventDefault();
    setShowConfirmPopUp(e);
  };

  const removePopUp = (e) => {
    e.preventDefault();
    setShowConfirmPopUp(null);
  };

  return (
    <>
      {showConfirmPopUp && <ConfirmPopUp removePopUp={removePopUp} handleAction={handleDeleteBoard} event={showConfirmPopUp} />}
      <Link draggable={false} className="board-item" to={`/boards/${boardId}`}>
        <div>
          {!edit ? <div>{boardName}</div> : <input autoFocus type="text" className="board-title-input" onClick={(e) => stopRedirect(e)} onChange={(e) => setTitle(e.target.value)} value={title} />}
        </div>

        {isAdmin && (
          <>
            <div className="admin-icon-container">
              <span className="admin-icon-tooltip">You are admin on this board</span>
              <img src={adminIcon} className="admin-icon" />
            </div>
            <div className="delete-icon-container">
              {!edit ? (
                <button type="button" className="btn btn-outline-primary btn-sm" onClick={(e) => handleEditBoard(e)}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-pen" viewBox="0 0 16 16">
                    <path d="m13.498.795.149-.149a1.207 1.207 0 1 1 1.707 1.708l-.149.148a1.5 1.5 0 0 1-.059 2.059L4.854 14.854a.5.5 0 0 1-.233.131l-4 1a.5.5 0 0 1-.606-.606l1-4a.5.5 0 0 1 .131-.232l9.642-9.642a.5.5 0 0 0-.642.056L6.854 4.854a.5.5 0 1 1-.708-.708L9.44.854A1.5 1.5 0 0 1 11.5.796a1.5 1.5 0 0 1 1.998-.001zm-.644.766a.5.5 0 0 0-.707 0L1.95 11.756l-.764 3.057 3.057-.764L14.44 3.854a.5.5 0 0 0 0-.708l-1.585-1.585z" />
                  </svg>
                </button>
              ) : (
                <button type="button" className="btn btn-primary btn-sm" onClick={(e) => handleEditBoard(e)}>
                  Save
                </button>
              )}

              <button type="button" className="btn btn-outline-danger btn-sm" onClick={(e) => openPopUp(e)}>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-trash" viewBox="0 0 16 16">
                  <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"></path>
                  <path
                    fillRule="evenodd"
                    d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"
                  ></path>
                </svg>
              </button>
            </div>
          </>
        )}
      </Link>
    </>
  );
};

export default BoardItem;
