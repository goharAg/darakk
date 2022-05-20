const responseHandler = require('../helpers/responseHandler');

class BaseController {
  constructor(name = null) {
    this.name = name;
    this.responseHandler = responseHandler;
  }
}

module.exports = BaseController;
