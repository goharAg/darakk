const db = require('../modules/db/models');
const BaseController = require('./base.controller');

class CommentController extends BaseController {
  constructor() {
    super('comment');
  }
  create = async (req, res) => {
    const comment = req.body;
    const taskId = Number(req.params.taskId);
    const userId = req.user.id;
    try {
      comment.task_id = taskId;
      comment.user_id = userId;
      const createdComment = await db.Comment.create(comment);
      const commentObj = await db.Comment.findByPk(createdComment.id, {
        include: [
          {
            model: db.User,
            as: 'user',
          },
          {
            model: db.CommentEmoji,
            as: 'emojis',
            include: {
              model: db.User,
              as: 'user',
              attributes: ['first_name', 'last_name'],
            },
          },
        ],
      });
      req.io.to(Number(taskId)).emit('taskWindow', {
        userId,
        action: 'update',
      });
      this.responseHandler.successResponse(commentObj, res);
    } catch (err) {
      this.responseHandler.errorResponse(err, res);
    }
  };

  update = async (req, res) => {
    const comment = req.body;
    const commentId = req.params.commentId;
    try {
      const [commentUpdated] = await db.Comment.update(comment, {
        where: {
          id: commentId,
        },
      });
      if (commentUpdated) {
        const comment = await db.Comment.findByPk(commentId);
        req.io.to(Number(comment.task_id)).emit('taskWindow', {
          userId: req.user.id,
          action: 'update',
        });
        return this.responseHandler.successResponse(commentUpdated, res);
      }
      throw this.responseHandler.getNotFoundError(`Comment with id <${commentId}> not found.`);
    } catch (err) {
      this.responseHandler.errorResponse(err, res);
    }
  };

  delete = async (req, res) => {
    const commentId = req.params.commentId;
    const comment = await db.Comment.findByPk(commentId);
    const taskId = comment.task_id;
    try {
      const numberOfDeletedComments = await db.Comment.destroy({
        where: { id: commentId },
      });
      if (numberOfDeletedComments) {
        req.io.to(Number(taskId)).emit('taskWindow', {
          userId: req.user.id,
          action: 'update',
        });
        return this.responseHandler.successResponse({ deleted: numberOfDeletedComments }, res);
      }
      throw this.responseHandler.getNotFoundError(`Comment with id <${commentId}> not found.`);
    } catch (err) {
      this.responseHandler.errorResponse(err, res);
    }
  };
}

module.exports = new CommentController();
