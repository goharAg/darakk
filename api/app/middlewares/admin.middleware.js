const responseHandler = require('../helpers/responseHandler');
const db = require('../modules/db/models');

const checkIsAdmin = async (req, res, next) => {
  const boardId = req.params.boardId;
  const userId = req.user.id;
  try {
    const userBoardMappingInfo = await db.UserBoardMapping.findOne({
      where: {
        user_id: userId,
        board_id: boardId,
      },
    });
    if (userBoardMappingInfo && userBoardMappingInfo.is_admin) {
      return next();
    }
    throw responseHandler.getForbiddenError(`User has no admin permission to board`);
  } catch (err) {
    responseHandler.errorResponse(err, res);
  }
};

module.exports = { name: 'admin', checkIsAdmin };
