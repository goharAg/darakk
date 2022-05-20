const controllers = require('../controllers');
const middlewares = require('../middlewares');
const router = require('express').Router();
const validate = middlewares.validation.validateSchema;
router.get('/v1', (req, res) => {
  res.json({ api_version: '1.0.0' });
});

router.post('/signup', validate('user', 'signup'), controllers.user.create); // create new user
router.post('/login', validate('user', 'login'), middlewares.authenticate.checkBeforeLogin, controllers.user.login); // login

router.use(middlewares.authenticate.authenticateToken); //middleware to check if the user is authenticated

router.get('/profile', controllers.user.getProfile); // get user profile
router.put('/profile', validate('user', 'update'), controllers.user.update); // update current user
router.delete('/profile', controllers.user.delete); // delete current user
router.post('/profile/image', middlewares.upload.uploadImage, controllers.user.uploadProfilePicture); // Upload profile picture
router.delete('/profile/image', controllers.user.deleteProfilePicture); // Delete profile picture
router.put('/profile/security', validate('user', 'changePassword'), controllers.user.changePassword);
router.delete('/logout', controllers.user.logout); // logout
router.get('/users/:id', validate('user', 'get'), controllers.user.getById); // get specific user by id
router.post('/users', controllers.member.findMatchUsers); // search users by email to add on board
router.post('/boardUsers', controllers.member.findBoardMembers); // find users of the board by email

router.post('/boards/states/tasks/:taskId/comments', validate('comment', 'create'), controllers.comment.create); // create comment on task
router.put('/boards/states/tasks/comments/:commentId', validate('comment', 'update'), controllers.comment.update); // edit comment
router.delete('/boards/states/tasks/comments/:commentId', validate('comment', 'delete'), controllers.comment.delete); // delete comment

router.post('/boards/states/tasks/comments/:commentId/emoji', controllers.emoji.reactComment); // react on comment

router.post('/boards/states/tasks/:taskId/assignment/:userId', validate('assignment', 'create'), controllers.assignment.create); // assign task to user
router.delete('/boards/states/tasks/assignment/:assignmentId', validate('assignment', 'delete'), controllers.assignment.delete); // delete assignment

router.post('/boards/', validate('board', 'create'), controllers.board.create); // create new board
router.get('/boards/', controllers.board.getUserBoards); // get user boards
router.get('/boards/:boardId', middlewares.board.checkBoardAccess, validate('board', 'get'), controllers.board.getById); // get specific board by id
router.delete('/boards/:boardId/members', middlewares.board.checkBoardAccess, validate('member', 'leave'), controllers.member.leaveBoard); //leave board
router.get('/boards/:boardId/members', middlewares.board.checkBoardAccess, controllers.member.boardMembers); // get board members

router.post('/boards/:boardId/states', validate('state', 'create'), controllers.state.create); // create a state on a board
router.put('/boards/states/:stateId', validate('state', 'update'), controllers.state.update); // update state by id
router.delete('/boards/states/:stateId', validate('state', 'delete'), controllers.state.delete); // delete state by id

router.post('/boards/states/:stateId/tasks', validate('task', 'create'), controllers.task.create); // create a task in a state
router.get('/boards/states/tasks/:taskId', validate('task', 'get'), controllers.task.get); // get a task by id
router.put('/boards/states/tasks/:taskId', validate('task', 'update'), controllers.task.update); // update a task by id

router.get('/boards/states/order/:stateId', controllers.order.getOrder);
router.put('/boards/states/update/:fromStateId/:toStateId/:taskId/:beforeTaskId', controllers.task.updateState);
router.delete('/boards/states/tasks/:taskId', validate('task', 'delete'), controllers.task.delete); //delete a task by id

router.use('/boards/:boardId', middlewares.admin.checkIsAdmin); //middleware to check if the user is admin

router.put('/boards/:boardId', validate('board', 'update'), controllers.board.update); // update specific board by id
router.delete('/boards/:boardId', validate('board', 'delete'), controllers.board.delete); // delete specific board by id

router.put('/boards/:boardId/members/:userId', validate('member', 'update'), controllers.member.add); // add user on board
router.delete('/boards/:boardId/members/:userId', validate('member', 'update'), controllers.member.remove); // remove user from board
router.put('/boards/:boardId/law/:userId', validate('member', 'update'), controllers.member.promote); // promote user to admin
router.delete('/boards/:boardId/law/:userId', validate('member', 'update'), controllers.member.demote); // demote admin to user

module.exports = router;
