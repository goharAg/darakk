const db = require('../modules/db/models');
const BaseController = require('./base.controller');

class EmojiController extends BaseController {
  constructor() {
    super('emoji');
  }
  reactComment = async (req, res) => {
    const reqEmoji = req.body;
    const commentId = Number(req.params.commentId);
    const comment = await db.Comment.findByPk(commentId);
    const userId = req.user.id;
    try {
      const emojis = await db.CommentEmoji.findAll({
        where: {
          user_id: userId,
          comment_id: commentId,
        },
      });
      const emojiExists = emojis.find((emojiObj) => {
        return emojiObj.emoji.unified === reqEmoji.emoji.unified;
      });

      if (emojiExists) {
        await db.CommentEmoji.destroy({ where: { id: emojiExists.id } });
        req.io.to(Number(comment.task_id)).emit('taskWindow', {
          userId: req.user.id,
          action: 'commentUpdate',
        });
        return this.responseHandler.successResponse({ id: emojiExists.id, deleted: true }, res);
      }

      const createdEmoji = await db.CommentEmoji.create({
        user_id: userId,
        comment_id: commentId,
        ...reqEmoji,
      });

      const newEmoji = await db.CommentEmoji.findByPk(createdEmoji.id, {
        include: {
          model: db.User,
          as: 'user',
          attributes: ['first_name', 'last_name'],
        },
      });
      req.io.to(Number(comment.task_id)).emit('taskWindow', {
        userId: req.user.id,
        action: 'commentUpdate',
      });
      return this.responseHandler.successResponse(newEmoji, res);
    } catch (err) {
      this.responseHandler.errorResponse(err, res);
    }
  };
}

module.exports = new EmojiController();
