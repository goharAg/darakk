const responseHandler = require('../helpers/responseHandler');
const db = require('../modules/db/models');

const checkBoardAccess = async (req, res, next) => {
  const boardId = req.params.boardId;
  const userId = req.user.id;
  try {
    const isBoardAvailable = await db.Board.findByPk(boardId);
    if (isBoardAvailable) {
      const userBoardMappingInfo = await db.UserBoardMapping.findOne({
        where: {
          user_id: userId,
          board_id: boardId,
        },
      });
      if (userBoardMappingInfo) {
        return next();
      }
      throw responseHandler.getForbiddenError(`User has no access to board`);
    }
    throw responseHandler.getNotFoundError(`Board with id ${boardId} not found`);
  } catch (err) {
    responseHandler.errorResponse(err, res);
  }
};

module.exports = { name: 'board', checkBoardAccess };
