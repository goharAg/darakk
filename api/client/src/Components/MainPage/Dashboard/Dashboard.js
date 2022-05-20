import React, { useEffect, useState, useRef } from 'react';
import BoardItem from './BoardItem';
import CreateBoardPopover from './CreateBoardPopover';
import './Dashboard.css';
import boardSvg from '../../../Assets/Images/board.svg';
import client from '../../../services/requests.service';
import Loading from '../../shared/Loading';
import ErrorWrapper from '../../shared/ErrorWrapper';

const Dashboard = () => {
  const [boards, setBoards] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [popupOpen, setPopupOpen] = useState(false);
  const [dashboardChanged, setDashboardChanged] = useState(false);

  const fetchAllBoards = async () => {
    await new Promise((resolve) => setTimeout(resolve, 600));
    try {
      const boards = await client.getBoards();
      setBoards(boards);
      setError(null);
    } catch (error) {
      setError(error);
    }
    setIsLoading(false);
  };

  useEffect(fetchAllBoards, [dashboardChanged]); // TO DO: implement cancelation of async calls on unmount

  const boardItems = boards.map((board) => (
    <BoardItem
      boards={boards}
      setBoards={setBoards}
      key={board.id}
      boardId={board.id}
      boardName={board.name}
      isAdmin={board.UserBoardMapping.is_admin}
      dashboardChanged={dashboardChanged}
      setDashboardChanged={setDashboardChanged}
    />
  ));

  return (
    <Loading isLoading={isLoading}>
      <ErrorWrapper error={error} tryAgainCallback={fetchAllBoards}>
        <div className="dashboard">
          <div className="dashboard-header">
            <img className="boardLogo" src={boardSvg} />
            <span>Your boards</span>
          </div>
          <div>
            <div className="boards-container">{boardItems}</div>
            <div>
              <button onClick={() => setPopupOpen(!popupOpen)} type="button" className="btn btn-success create-board-btn">
                Create new board
              </button>
              {popupOpen && <CreateBoardPopover boards={boards} setBoards={setBoards} setPopupOpen={setPopupOpen} />}
            </div>
          </div>
        </div>
      </ErrorWrapper>
    </Loading>
  );
};

export default Dashboard;
