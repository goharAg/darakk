const db = require('../modules/db/models');
const BaseController = require('./base.controller');
const OrderService = require('../services/order.service');

class OrderController extends BaseController {
  constructor() {
    super('order');
  }
  getOrder = async (req, res) => {
    try {
      const result = await OrderService.getOrder(req, res);
      this.responseHandler.successResponse(result, res);
    } catch (err) {
      return err;
    }
  };
}

module.exports = new OrderController();
