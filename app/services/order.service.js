const db = require('../modules/db/models');
const BaseService = require('./base.service');

class OrderService extends BaseService {
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
        return order;
      }
      throw this.responseHandler.getNotFoundError(`Order of state with id <${stateId}> not found.`);
    } catch (err) {
      return this.responseHandler.errorResponse(err, res);
    }
  };
}

module.exports = new OrderService();
