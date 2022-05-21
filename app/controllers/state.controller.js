const db = require('../modules/db/models');
const BaseController = require('./base.controller');
const StateService = require('../services/state.service');

class StateController extends BaseController {
  constructor() {
    super('state');
  }

  update = async (req, res) => {
    try {
      const result = await StateService.update(req, res);
      this.responseHandler.successResponse(result, res);
    } catch (err) {
      return err;
    }
  };

  create = async (req, res) => {
    try {
      const result = await StateService.create(req, res);
      this.responseHandler.successResponse(result, res);
    } catch (err) {
      return err;
    }
  };

  delete = async (req, res) => {
    try {
      const result = await StateService.delete(req, res);
      this.responseHandler.successResponse(result, res);
    } catch (err) {
      return err;
    }
  };
}

module.exports = new StateController();
