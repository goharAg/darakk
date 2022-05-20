const redisClient = require('../modules/db/redis/index');
const jwt = require('jsonwebtoken');
const authConfig = require('../config/constants')['authConfig'];
const responseHandler = require('../helpers/responseHandler');

const checkBeforeLogin = async (req, res, next) => {
  const accessToken = req.cookies.access_token || null;

  if (accessToken) {
    try {
      jwt.verify(accessToken, authConfig.jwtSecret);
      const err = responseHandler.getBadRequestError('Already logged in');
      return responseHandler.errorResponse(err, res);
    } catch (err) {
      await res.clearCookie('access_token', { path: '/' });
    }
  }
  next();
};

const authenticateToken = async (req, res, next) => {
  const accessToken = req.cookies.access_token || null;
  if (accessToken) {
    try {
      const authInfo = jwt.verify(accessToken, authConfig.jwtSecret);
      const user = JSON.parse(await redisClient.get(authInfo.uid));
      req.user = { ...user };
      return next();
    } catch (err) {
      await res.clearCookie('access_token', { path: '/' });
      return responseHandler.errorResponse(err, res);
    }
  }
  const err = responseHandler.getNotFoundError('no login information');
  return responseHandler.errorResponse(err, res);
};

module.exports = { name: 'authenticate', checkBeforeLogin, authenticateToken };
