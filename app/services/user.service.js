const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const redisClient = require('../modules/db/redis/index');
const db = require('../modules/db/models');
const authConfig = require('../config/constants')['authConfig'];
const BaseService = require('./base.service');
const fs = require('fs');

class UserService extends BaseService {
  constructor() {
    super('user');
  }

  getById = async (req, res) => {
    const id = req.params.id;
    try {
      const user = await db.User.findByPk(id);
      if (user) {
        return user;
      }
      throw this.responseHandler.getNotFoundError(`User with id <${id}> not found.`);
    } catch (err) {
      this.responseHandler.errorResponse(err, res);
    }
  };

  changePassword = async (req, res) => {
    const id = req.user.id;
    try {
      const user = await db.User.scope('includePassword').findByPk(id);
      if (await bcrypt.compare(req.body.password, user.password)) {
        const salt = await bcrypt.genSalt(10);
        const newHashedPassword = await bcrypt.hash(req.body.new_password, salt);
        const [usersUpdated] = await db.User.update(
          { password: newHashedPassword },
          {
            where: { id },
          }
        );
        return { usersUpdated };
      }
      throw this.responseHandler.getForbiddenError('Wrong password');
    } catch (err) {
      this.responseHandler.errorResponse(err, res);
    }
  };

  update = async (req, res) => {
    const id = req.user.id;
    const newAttributes = req.body;
    try {
      const [usersUpdated] = await db.User.update(newAttributes, {
        where: {
          id: id,
        },
      });

      const updatedUser = await db.User.findByPk(id);
      const oldEX = await redisClient.ttl(id);
      await redisClient.set(id, JSON.stringify(updatedUser), {
        EX: oldEX,
      });

      if (usersUpdated) {
        const updatedUser = await db.User.findByPk(id);

        const oldEX = await redisClient.ttl(id);

        await redisClient.set(id, JSON.stringify(updatedUser), {
          EX: oldEX,
        });

        return { usersUpdated };
      }
      throw this.responseHandler.getNotFoundError(`User with id <${id}> not found.`);
    } catch (err) {
      this.responseHandler.errorResponse(err, res);
    }
  };

  create = async (req, res) => {
    const user = req.body;

    try {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(user.password, salt);
      user.password = hashedPassword;
      const createdUser = await db.User.create(user);

      const accessToken = jwt.sign({ uid: createdUser.id }, authConfig.jwtSecret, {
        expiresIn: authConfig.jwtExpire,
      });
      res.cookie('access_token', accessToken, {
        // TODO: add 'secure: true,' while deploying
        httpOnly: true,
        path: '/',
      });
      await redisClient.set(createdUser.id, JSON.stringify(createdUser), {
        EX: parseInt(authConfig.jwtExpire),
      });

      delete createdUser.dataValues.password;
      return createdUser;
    } catch (err) {
      this.responseHandler.errorResponse(err, res);
    }
  };

  delete = async (req, res) => {
    const id = req.user.id;
    try {
      const numberOfDeletedUsers = await db.User.destroy({
        where: { id },
      });
      await redisClient.del(id);
      await res.clearCookie('access_token', { path: '/' });
      if (numberOfDeletedUsers) {
        return { deleted: numberOfDeletedUsers };
      }
      throw this.responseHandler.getNotFoundError(`User with id <${id}> not found.`);
    } catch (err) {
      this.responseHandler.errorResponse(err, res);
    }
  };

  login = async (req, res) => {
    const user = await db.User.scope('includePassword').findOne({
      where: { email: req.body.email },
    });
    try {
      if (user !== null && (await bcrypt.compare(req.body.password, user.password))) {
        const id = user.id;
        const accessToken = jwt.sign({ uid: id }, authConfig.jwtSecret, {
          expiresIn: authConfig.jwtExpire,
        });
        res.cookie('access_token', accessToken, {
          // TODO: add 'secure: true,' while deploying
          httpOnly: true,
          path: '/',
        });
        await redisClient.set(id, JSON.stringify(user), {
          EX: parseInt(authConfig.jwtExpire),
        });
        return { message: 'Logged in successfully' };
      }
      throw this.responseHandler.getBadRequestError('Invalid email or password');
    } catch (err) {
      this.responseHandler.errorResponse(err, res);
    }
  };

  uploadProfilePicture = async (req, res) => {
    const userId = req.user.id;
    try {
      const imageName = req.file.filename;
      const prevImage = await db.User.findByPk(userId, { attributes: ['image_name'] });
      await db.User.update(
        { image_name: imageName },
        {
          where: { id: userId },
        }
      );
      const prevImageName = prevImage.image_name;
      const prevImagePath = `uploads/${prevImageName}`;
      if (prevImageName && fs.existsSync(prevImagePath)) {
        fs.unlinkSync(prevImagePath);
      }
      const updatedUser = await db.User.findByPk(userId);
      const oldEX = await redisClient.ttl(userId);
      await redisClient.set(userId, JSON.stringify(updatedUser), {
        EX: oldEX,
      });
      return { profilePicture: imageName };
    } catch (err) {
      this.responseHandler.errorResponse(err, res);
    }
  };

  deleteProfilePicture = async (req, res) => {
    const id = req.user.id;
    const image = req.user.image_name;
    try {
      const [updated] = await db.User.update({ image_name: null }, { where: { id } });
      if (image) fs.unlinkSync(`uploads/${image}`);
      const oldEX = await redisClient.ttl(id);
      await redisClient.set(id, JSON.stringify({ ...req.user, image_name: null }), {
        EX: oldEX,
      });
      return { deleted: updated };
    } catch (err) {
      this.responseHandler.errorResponse(err, res);
    }
  };

  getProfile = async (req, res) => {
    return { user: req.user };
  };

  logout = async (req, res) => {
    await redisClient.del(req.user.id);
    await res.clearCookie('access_token', { path: '/' });
    return { message: 'Logged out successfully' };
  };
}

module.exports = new UserService();
