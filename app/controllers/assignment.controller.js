const db = require('../modules/db/models');
const BaseController = require('./base.controller');
const AssignmentService = require('../services/assignment.service');

class AssignmentController extends BaseController {
  constructor() {
    super('assignment');
  }
  create = async (req, res) => {
    try {
      const result = await AssignmentService.create(req, res);
      this.responseHandler.successResponse(result, res);
    } catch (err) {
      return err;
    }
  };

  delete = async (req, res) => {
    try {
      const result = await AssignmentService.delete(req, res);
      this.responseHandler.successResponse(result, res);
    } catch (err) {
      return err;
    }
  };
}

module.exports = new AssignmentController();
