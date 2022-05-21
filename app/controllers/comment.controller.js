const db = require('../modules/db/models');
const BaseController = require('./base.controller');
const CommentService = require('../services/comment.service');

class CommentController extends BaseController {
  constructor() {
    super('comment');
  }
  create = async (req, res) => {
    try {
      const result = await CommentService.create(req, res);
      this.responseHandler.successResponse(result, res);
    } catch (err) {
      return err;
    }
  };

  update = async (req, res) => {
    try {
      const result = await CommentService.update(req, res);
      this.responseHandler.successResponse(result, res);
    } catch (err) {
      return err;
    }
  };

  delete = async (req, res) => {
    try {
      const result = await CommentService.delete(req, res);
      this.responseHandler.successResponse(result, res);
    } catch (err) {
      return err;
    }
  };
}

module.exports = new CommentController();
