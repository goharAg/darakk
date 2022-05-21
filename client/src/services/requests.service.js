import axios from 'axios';

const HOST_NAME = process.env.REACT_APP_HOST_NAME || 'http://localhost:5000';

const client = axios.create({
  baseURL: HOST_NAME,
  timeout: 10000,
  withCredentials: true,
});

const authenticate = async () => {
  const res = await client.get('/profile');
  const user = res.data.data.user;
  return user;
};

const login = async (payload) => {
  return await client.post('/login', payload);
};

const logout = async () => {
  await client.delete('/logout');
};

const signup = async (payload) => {
  return await client.post('/signup', payload);
};

const updateProfile = async (payload) => {
  return await client.put('/profile', payload);
};

const updateSecurity = async (payload) => {
  return await client.put('/profile/security', payload);
};

const deleteAccount = async () => {
  return await client.delete('/profile');
};

const getBoards = async () => {
  const res = await client.get('/boards');
  const data = await res.data;
  return data.data.boards;
};

const getBoardById = async (boardId) => {
  const res = await client.get(`/boards/${boardId}`);
  const data = res.data.data;
  return data;
};

const createBoard = async (name) => {
  const res = await client.post('/boards', { name });
  const data = res.data.data;
  return data;
};

const updateBoard = async (boardId, name) => {
  const res = await client.put(`/boards/${boardId}`, { name });
  const data = await res.data;
  return data.data;
};

const deleteBoard = async (boardId) => {
  const res = await client.delete(`/boards/${boardId}`);
  const data = await res.data;
  return data.data.boards;
};

const createState = async (boardId, state_name) => {
  const res = await client.post(`/boards/${boardId}/states`, { state_name });
  const data = await res.data.data;
  return data;
};

const updateState = async (stateId, state_name) => {
  const res = await client.put(`/boards/states/${stateId}`, { state_name });
  const data = await res.data;
  return data.data;
};

const deleteState = async (stateId) => {
  const res = await client.delete(`/boards/states/${stateId}`);
  const data = await res.data;
  return data;
};

const getTaskById = async (taskId) => {
  const res = await client.get(`/boards/states/tasks/${taskId}`);

  const data = res.data.data;
  return data;
};

const createTask = async (stateId, title, description, boardId) => {
  const res = await client.post(`/boards/states/${stateId}/tasks`, { title, description, boardId });
  const data = await res.data;
  return data.data;
};

const updateTask = async (taskId, title, description, boardId) => {
  const res = await client.put(`/boards/states/tasks/${taskId}`, { title, description, boardId });
  const data = await res.data;
  return data.data.tasks;
};

const deleteTask = async (taskId) => {
  const res = await client.delete(`/boards/states/tasks/${taskId}`);
  const data = await res.data;
  return data.data.tasks;
};

const getBoardMembers = async (boardId) => {
  const res = await client.get(`/boards/${boardId}/members`);
  return res.data.data;
};

const deleteComment = async (commentId) => {
  return await client.delete(`/boards/states/tasks/comments/${commentId}`);
};

const updateComment = async (commentId, content) => {
  return await client.put(`/boards/states/tasks/comments/${commentId}`, { content });
};

const createComment = async (taskId, content) => {
  const commentObj = await client.post(`/boards/states/tasks/${taskId}/comments`, { content });
  return commentObj.data;
};

const findMatchUsers = async (userEmail) => {
  const res = await client.post(`/users`, { userEmail });
  return res.data.data;
};
const findBoardUsers = async (boardId, userEmail) => {
  const res = await client.post(`/boardUsers`, { boardId, userEmail });
  return res.data.data;
};

const getUserById = async (userId) => {
  const res = await client.get(`/users/${userId}`);
  const data = await res.data;
  return data.data;
};

const addMemberToBoard = async (boardId, userId) => {
  const res = await client.put(`/boards/${boardId}/members/${userId}`);
  // const data = await res.data;
  return res.data.data;
};

const removeMemberFromBoard = async (boardId, userId) => {
  const res = await client.delete(`/boards/${boardId}/members/${userId}`);
  const data = await res.data;
  return data.data;
};

const promoteUserToAdmin = async (boardId, userId) => {
  const res = await client.put(`/boards/${boardId}/law/${userId}`);
  const data = await res.data;
  return data.data;
};

const demoteUserFromAdmin = async (boardId, userId) => {
  const res = await client.delete(`/boards/${boardId}/law/${userId}`);
  const data = await res.data;
  return data.data;
};

const leaveBoard = async (boardId) => {
  const res = await client.delete(`/boards/${boardId}/members`);
  return res.data;
};
const getStateOrderById = async (stateId) => {
  const res = await client.get(`/boards/states/order/${stateId}`);
  const data = await res.data;
  return data.data.order;
};

const moveTask = async (fromStateId, toStateId, taskId, beforeTaskId) => {
  ///boards/states/update/:fromStateId/:toStateId/:taskId/:afterTaskId
  const res = await client.put(`/boards/states/update/${fromStateId}/${toStateId}/${taskId}/${beforeTaskId}/`);
  const data = await res.data;
  return data.data;
};

const updatePhoto = async (image) => {
  const res = await client.post('/profile/image', image);
  return res.data.data.profilePicture;
};

const deletePhoto = async () => {
  return await client.delete('/profile/image');
};

const createAssignment = async (taskId, userId) => {
  const res = await client.post(`/boards/states/tasks/${taskId}/assignment/${userId}`);
  return res.data.data;
};

const deleteAssignment = async (assignmentId) => {
  const res = await client.delete(`/boards/states/tasks/assignment/${assignmentId}`);
  return res.data.data;
};

export default {
  HOST_NAME,
  authenticate,
  login,
  signup,
  logout,
  updateProfile,
  deletePhoto,
  updateSecurity,
  deleteAccount,
  getBoards,
  getBoardById,
  createBoard,
  updateBoard,
  deleteBoard,
  createState,
  updateState,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
  getBoardMembers,
  deleteComment,
  updateComment,
  createComment,
  findMatchUsers,
  findBoardUsers,
  getUserById,
  addMemberToBoard,
  removeMemberFromBoard,
  promoteUserToAdmin,
  demoteUserFromAdmin,
  leaveBoard,
  getStateOrderById,
  moveTask,
  deleteState,
  updatePhoto,
  createAssignment,
  deleteAssignment,
};
