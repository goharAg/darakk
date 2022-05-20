const db = require('../modules/db/models');
const BaseController = require('./base.controller');

class OrderController extends BaseController {
  constructor() {
    super('order');
  }
  getOrder = async (req, res) => {
    const stateId = req.params.stateId;
    try {
      const order = await db.StateOrderMapping.findOne({
        where: {
          state_id: stateId,
        },
      });
      if (order) {
        return this.responseHandler.successResponse(order, res);
      }
      throw this.responseHandler.getNotFoundError(`Order of state with id <${stateId}> not found.`);
    } catch (err) {
      this.responseHandler.errorResponse(err, res);
    }
  };
}

module.exports = new OrderController();
