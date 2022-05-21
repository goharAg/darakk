const db = require('../modules/db/models');
const BaseController = require('./base.controller');
const TaskService = require('../services/task.service');

class TaskController extends BaseController {
  constructor() {
    super('task');
  }

  get = async (req, res) => {
    try {
      const result = await TaskService.get(req, res);
      this.responseHandler.successResponse(result, res);
    } catch (err) {
      return err;
    }
  };

  update = async (req, res) => {
    try {
      const result = await TaskService.update(req, res);
      this.responseHandler.successResponse(result, res);
    } catch (err) {
      return err;
    }
  };

  create = async (req, res) => {
    try {
      const result = await TaskService.create(req, res);
      this.responseHandler.successResponse(result, res);
    } catch (err) {
      return err;
    }
  };

  delete = async (req, res) => {
    try {
      const result = await TaskService.delete(req, res);
      this.responseHandler.successResponse(result, res);
    } catch (err) {
      return err;
    }
  };

  updateState = async (req, res) => {
    try {
      const result = await TaskService.updateState(req, res);
      this.responseHandler.successResponse(result, res);
    } catch (err) {
      return err;
    }
  };
}

module.exports = new TaskController();
