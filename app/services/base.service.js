const responseHandler = require('../helpers/responseHandler');

class BaseService {
  constructor(name = null) {
    this.name = name;
    this.responseHandler = responseHandler;
  }
}

module.exports = BaseService;
