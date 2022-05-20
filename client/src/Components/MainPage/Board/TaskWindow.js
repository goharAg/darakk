import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, useParams, useOutletContext, useHistory } from 'react-router-dom';
import { io } from 'socket.io-client';
import { updateTaskWindow } from '../../../handlers/socket.handler';
import Comment from './Comment';
import CloseButton from '../../shared/CloseButton';
import Loading from '../../shared/Loading';
import ErrorWrapper from '../../shared/ErrorWrapper';
import CommentArea from './CommentArea';
import AssignTo from './AssignTo';

import cardIcon from '../../../Assets/Images/card.png';
import descriptionIcon from '../../../Assets/Images/description.png';
import commentsIcon from '../../../Assets/Images/comment.webp';
import { useAuth } from '../../../AuthContext';

import './TaskWindow.css';
import profilePicture from '../../../Assets/Images/profilePicture.png';
import client from '../../../services/requests.service';
import ConfirmPopUp from '../../shared/ConfirmPopUp';
const socket = io(client.HOST_NAME);
const TaskWindow = () => {
  const { user } = useAuth();

  const [state, setState, listChanged, setListChanged, members] = useOutletContext();

  const [edit, setEdit] = useState(false);
  const [taskCopy, setTaskCopy] = useState(null);
  const [taskObj, setTaskObj] = useState({
    title: '',
    description: '',
    comments: [],
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [validationError, setValidationError] = useState(null);

  const [assigned, setAssigned] = useState(null);
  const [showAssignmentList, setShowAssignmentList] = useState(false);

  const taskId = Number(useParams().taskId);
  const stateId = Number(useParams().stateId);
  const boardId = useParams().boardId;

  const [isEditComment, setIsEditComment] = useState(false);

  const [changed, setChanged] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const fetchTask = async (id = taskId) => {
    try {
      const taskObj = await client.getTaskById(id);
      if (taskObj.task_assignments.length != 0) {
        let user = await client.getUserById(taskObj.task_assignments[0].user_id);
        setAssigned(user);
      } else {
        setAssigned(null);
      }
      if (showAssignmentList) {
        setShowAssignmentList(false);
      }
      setTaskObj({ ...taskObj });
      setTaskCopy({ ...taskObj });
      setIsLoading(false);
      setError(null);
    } catch (error) {
      setIsLoading(false);
      setError({ message: 'Task with the given Id not found' });
    }
  };

  const handleSocketTaskWindowChange = (res) => {
    if (user.id === res.userId) return;
    updateTaskWindow(res, changed, setChanged, fetchTask, closeWindow);
  };

  useEffect(() => {
    if (location.pathname.indexOf('/create') === -1) {
      fetchTask();
    } else {
      setEdit(true);
      setIsLoading(false);
      setTaskCopy({ ...taskObj });
    }
  }, []); // TO DO: implement cancelation of async calls on unmount

  useEffect(() => {
    socket.emit('taskId', taskId);
  }, [taskId]);

  useEffect(() => {
    socket.on('taskWindow', handleSocketTaskWindowChange);
    return () => {
      socket.off('taskWindow', handleSocketTaskWindowChange);
    };
  }, [handleSocketTaskWindowChange]);

  const closeWindow = () => {
    const locationToBoard = location.pathname.slice(0, location.pathname.indexOf('/task'));
    navigate(locationToBoard, { replace: true });
  };

  const handleClick = (e) => {
    if (e.target === e.currentTarget) {
      closeWindow();
    }
  };

  const handleEditClick = () => {
    setEdit(!edit);
  };

  const handleTitleChange = (e) => {
    setTaskCopy({ ...taskCopy, title: e.target.value });
  };

  const handleDescriptionChange = (e) => {
    setTaskCopy({ ...taskCopy, description: e.target.value });
  };

  const handleSaveClick = async () => {
    if (taskCopy.title.length < 2 || taskCopy.description.length < 2) {
      return setValidationError({
        message: 'title and description should contain at least 2 characters',
      });
    }
    if (location.pathname.indexOf('/create') !== -1) {
      try {
        const newTask = await client.createTask(stateId, taskCopy.title, taskCopy.description, boardId);
        const taskId = newTask.id;
        const rootPath = location.pathname.substring(0, location.pathname.indexOf('create'));
        let statePosition = state.boardObj.states.findIndex((cur) => {
          if (cur.id === stateId) return cur;
        });
        state.boardObj.states[statePosition].tasks.push(newTask);
        setState({ ...state });
        navigate(`${rootPath}${taskId}`);
        setIsLoading(true);
        setListChanged(!listChanged);
        fetchTask(taskId);
      } catch (err) {
        console.log(err);
      }
    } else if (taskObj.title !== taskCopy.title || taskObj.description !== taskCopy.description) {
      await client.updateTask(taskObj.id, taskCopy.title, taskCopy.description, boardId);

      setTaskObj({ ...taskObj, ...taskCopy });
      let statePosition = state.boardObj.states.findIndex((cur) => {
        if (cur.id === taskObj['state_id']) return cur;
      });
      let taskPosition = state.boardObj.states[statePosition].tasks.findIndex((cur) => {
        if (cur.id === taskObj['id']) return cur;
      });
      state.boardObj.states[statePosition].tasks[taskPosition].title = taskCopy.title;
      state.boardObj.states[statePosition].tasks[taskPosition].description = taskCopy.description;
      setState({ ...state });
      setListChanged(!listChanged);
    }
    setValidationError(null);
    setEdit(!edit);
  };

  const handleDeleteClick = async () => {
    if (taskObj.id) {
      const deleted = await client.deleteTask(taskObj.id);
      let statePosition = state.boardObj.states.findIndex((cur) => {
        if (cur.id === taskObj['state_id']) return cur;
      });
      let taskPosition = state.boardObj.states[statePosition].tasks.findIndex((cur) => {
        if (cur.id === taskObj['id']) return cur;
      });
      state.boardObj.states[statePosition].tasks.splice(taskPosition, 1);
      setState({ ...state });
      setListChanged(!listChanged);
    }

    closeWindow();
  };

  const handleRemoveAssignment = async () => {
    const res = await client.deleteAssignment(taskObj.task_assignments[0].id);
    setAssigned(null);
  };

  const handleAssignmentClick = () => {
    setShowAssignmentList(!showAssignmentList);
  };

  const [showConfirmPopUp, setShowConfirmPopUp] = useState(false);
  const openPopUp = () => {
    setShowConfirmPopUp(true);
  };

  const removePopUp = () => {
    setShowConfirmPopUp(false);
  };

  return (
    <>
      {showConfirmPopUp && <ConfirmPopUp removePopUp={removePopUp} handleAction={handleDeleteClick} />}
      <div onClick={handleClick} className="task-window-wrapper">
        <div className="task-window-content">
          <CloseButton onClick={closeWindow} />
          <Loading isLoading={isLoading} width="100px">
            <ErrorWrapper error={error} tryAgainCallback={fetchTask}>
              {error ? (
                <div className="alert alert-danger" role="alert">
                  {error.message}
                </div>
              ) : (
                <>
                  {validationError && (
                    <div className="alert alert-danger" role="alert">
                      {validationError.message}
                    </div>
                  )}

                  <div className="task-window-title d-flex align-items-center">
                    <img className="title-icon" src={cardIcon} />
                    {!edit ? (
                      <span className="task-name">{taskObj.title}</span>
                    ) : (
                      <input autoFocus type="text" name="task-title" className="task-title-input" value={taskCopy.title} onChange={handleTitleChange} placeholder="Enter task title..." />
                    )}
                  </div>
                  <div className="task-window-subtitle d-flex ">
                    <img className="subtitle-icon" src={descriptionIcon} />
                    <section className="task-section d-flex flex-column">
                      <span className="subtitle">Description</span>
                      {!edit ? (
                        <span className="task-description">{typeof taskObj.description === 'string' && taskObj.description}</span>
                      ) : (
                        <textarea
                          type="text"
                          name="task-description"
                          className="task-description-input"
                          value={taskCopy.description}
                          onChange={handleDescriptionChange}
                          placeholder="Enter task description..."
                        />
                      )}
                    </section>
                  </div>
                  {!edit && (
                    <div className="task-window-subtitle d-flex">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className=" subtitle-icon bi bi-clipboard-plus" viewBox="0 0 16 16">
                        <path fillRule="evenodd" d="M8 7a.5.5 0 0 1 .5.5V9H10a.5.5 0 0 1 0 1H8.5v1.5a.5.5 0 0 1-1 0V10H6a.5.5 0 0 1 0-1h1.5V7.5A.5.5 0 0 1 8 7z" />
                        <path d="M4 1.5H3a2 2 0 0 0-2 2V14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3.5a2 2 0 0 0-2-2h-1v1h1a1 1 0 0 1 1 1V14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1h1v-1z" />
                        <path d="M9.5 1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5h3zm-3-1A1.5 1.5 0 0 0 5 1.5v1A1.5 1.5 0 0 0 6.5 4h3A1.5 1.5 0 0 0 11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3z" />
                      </svg>
                      <section className="task-section d-flex flex-column">
                        <span className="subtitle">Assigned to</span>
                        {assigned ? (
                          <div>
                            <div>
                              <img className="rounded-circle member-icon assigned-icon" src={assigned.image_name ? `${client.HOST_NAME}/${assigned.image_name}` : profilePicture} />{' '}
                              <b>
                                {assigned.first_name} {assigned.last_name}
                              </b>
                              <button className="btn btn-outline-secondary remove-assigned-btn" onClick={handleRemoveAssignment}>
                                Remove assignment
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div>
                            <div>This task is not assigned to anyone yet</div>
                            <div>
                              {showAssignmentList ? (
                                <>
                                  <button className="btn btn-outline-secondary assign-btn" onClick={() => handleAssignmentClick()}>
                                    x
                                  </button>
                                  <AssignTo fetchTask={fetchTask} boardId={boardId} members={members} taskId={taskObj.id} />
                                </>
                              ) : (
                                <button className="btn btn-outline-secondary assign-btn" onClick={() => handleAssignmentClick()}>
                                  Assign
                                </button>
                              )}
                            </div>
                          </div>
                        )}
                      </section>
                    </div>
                  )}
                  <div className="task-window-subtitle d-flex control-buttons">
                    <section className="task-section d-flex flex-row">
                      {!edit ? (
                        <button className="btn btn-success" onClick={handleEditClick}>
                          Edit
                        </button>
                      ) : (
                        <button className="btn btn-primary" onClick={handleSaveClick}>
                          Save
                        </button>
                      )}
                      <button className="btn btn-danger" onClick={openPopUp}>
                        Delete
                      </button>
                    </section>
                  </div>

                  {!edit && (
                    <>
                      <div className="task-window-subtitle d-flex">
                        <img className="subtitle-icon" src={commentsIcon} />
                        <section className="task-section d-flex flex-column">
                          <span className="subtitle">Comments</span>
                          <div>
                            {isEditComment ? (
                              <CommentArea setEdit={setIsEditComment} task={taskObj} setTask={setTaskObj} commentObj={false} />
                            ) : (
                              <input onClick={() => setIsEditComment(true)} className="create-comment-area" placeholder="Write a comment…" />
                            )}
                            {taskObj.comments.map((comment, idx) => (
                              <Comment changed={changed} key={comment.id} commentObj={comment} commentPosition={idx} task={taskObj} setTask={setTaskObj} />
                            ))}
                          </div>
                        </section>
                      </div>
                    </>
                  )}
                  {/* 
                <div className="task-window-subtitle d-flex">
                  <img className="subtitle-icon" src={commentsIcon} />
                  <section className="task-section d-flex flex-column">
                    <span className="subtitle">Comments</span>
                    <div>
                      {taskObj.comments.map((comment) => (
                        <Comment key={comment.id} commentObj={comment} setTask={setTaskObj} />
                      ))}
                    </div>
                  </section>
                </div> */}
                </>
              )}
            </ErrorWrapper>
          </Loading>
        </div>
      </div>
    </>
  );
};

export default TaskWindow;
