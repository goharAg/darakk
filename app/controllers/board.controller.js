const db = require('../modules/db/models');
const BaseController = require('./base.controller');
const BoardService = require('../services/board.service');

class BoardController extends BaseController {
  constructor() {
    super('board');
  }

  getUserBoards = async (req, res) => {
    try {
      const result = await BoardService.getUserBoards(req, res);
      this.responseHandler.successResponse(result, res);
    } catch (err) {
      return err;
    }
  };

  getById = async (req, res) => {
    try {
      const result = await BoardService.getById(req, res);
      this.responseHandler.successResponse(result, res);
    } catch (err) {
      return err;
    }
  };

  create = async (req, res) => {
    try {
      const result = await BoardService.create(req, res);
      this.responseHandler.successResponse(result, res);
    } catch (err) {
      return err;
    }
  };

  update = async (req, res) => {
    try {
      const result = await BoardService.update(req, res);
      this.responseHandler.successResponse(result, res);
    } catch (err) {
      return err;
    }
  };

  delete = async (req, res) => {
    try {
      const result = await BoardService.delete(req, res);
      this.responseHandler.successResponse(result, res);
    } catch (err) {
      return err;
    }
  };
}

module.exports = new BoardController();
