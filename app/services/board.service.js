const db = require('../modules/db/models');
const BaseService = require('./base.service');

class BoardService extends BaseService {
  constructor() {
    super('board');
  }

  getUserBoards = async (req, res) => {
    const userId = req.user.id;
    try {
      const boards = await db.User.findByPk(userId, {
        include: [
          {
            model: db.Board,
            as: 'boards',
            through: {
              attributes: ['is_admin'],
            },
          },
        ],
      });
      return boards;
    } catch (err) {
      return this.responseHandler.errorResponse(err, res);
    }
  };

  getById = async (req, res) => {
    const boardId = req.params.boardId;
    const userId = req.user.id;
    try {
      const board = await db.Board.findByPk(boardId, {
        include: {
          model: db.State,
          as: 'states',
          include: {
            model: db.Task,
            as: 'tasks',
            include: {
              model: db.TaskAssignment,
              as: 'task_assignments',
            },
          },
        },
      });

      const boardUser = await db.UserBoardMapping.findOne({
        where: {
          user_id: userId,
          board_id: boardId,
        },
      });
      if (board) {
        board.dataValues.userIsAdmin = boardUser.is_admin;
        return board;
      }
      throw this.responseHandler.getNotFoundError(`Board with id <${boardId}> not found.`);
    } catch (err) {
      return this.responseHandler.errorResponse(err, res);
    }
  };

  create = async (req, res) => {
    const board = req.body;
    try {
      const userId = req.user.id;
      const createdBoard = await db.Board.create(board);
      const boardId = createdBoard.id;
      await db.UserBoardMapping.create({ user_id: userId, board_id: boardId, is_admin: true });
      return createdBoard;
    } catch (err) {
      return this.responseHandler.errorResponse(err, res);
    }
  };

  update = async (req, res) => {
    const boardId = req.params.boardId;
    const newAttributes = req.body;
    try {
      const [boardUpdated] = await db.Board.update(newAttributes, {
        where: {
          id: boardId,
        },
      });
      const newBoard = await db.Board.findByPk(boardId);
      if (boardUpdated) {
        return newBoard, res;
      }
      throw this.responseHandler.getNotFoundError(`Board with id <${boardId}> not found.`);
    } catch (err) {
      return this.responseHandler.errorResponse(err, res);
    }
  };

  delete = async (req, res) => {
    const boardId = req.params.boardId;
    try {
      const numberOfDeletedBoards = await db.Board.destroy({
        where: { id: boardId },
      });
      if (numberOfDeletedBoards) {
        return { deleted: numberOfDeletedBoards };
      }
      throw this.responseHandler.getNotFoundError(`Board with id <${boardId}> not found.`);
    } catch (err) {
      return this.responseHandler.errorResponse(err, res);
    }
  };
}

module.exports = new BoardService();
