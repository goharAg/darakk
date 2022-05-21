const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const redisClient = require('../modules/db/redis/index');
const db = require('../modules/db/models');
const authConfig = require('../config/constants')['authConfig'];
const BaseController = require('./base.controller');
const fs = require('fs');
const UserService = require('../services/user.service');

class UserController extends BaseController {
  constructor() {
    super('user');
  }

  getById = async (req, res) => {
    try {
      const result = await UserService.getById(req, res);
      this.responseHandler.successResponse(result, res);
    } catch (err) {
      return err;
    }
  };

  delete = async (req, res) => {
    try {
      const result = await UserService.delete(req, res);
      this.responseHandler.successResponse(result, res);
    } catch (err) {
      return err;
    }
  };

  changePassword = async (req, res) => {
    try {
      const result = await UserService.changePassword(req, res);
      this.responseHandler.successResponse(result, res);
    } catch (err) {
      return err;
    }
  };

  update = async (req, res) => {
    try {
      const result = await UserService.update(req, res);
      this.responseHandler.successResponse(result, res);
    } catch (err) {
      return err;
    }
  };

  create = async (req, res) => {
    try {
      const result = await UserService.create(req, res);
      this.responseHandler.successResponse(result, res);
    } catch (err) {
      return err;
    }
  };

  login = async (req, res) => {
    try {
      const result = await UserService.login(req, res);
      this.responseHandler.successResponse(result, res);
    } catch (err) {
      return err;
    }
  };

  uploadProfilePicture = async (req, res) => {
    try {
      const result = await UserService.uploadProfilePicture(req, res);
      this.responseHandler.successResponse(result, res);
    } catch (err) {
      return err;
    }
  };

  deleteProfilePicture = async (req, res) => {
    try {
      const result = await UserService.deleteProfilePicture(req, res);
      this.responseHandler.successResponse(result, res);
    } catch (err) {
      return err;
    }
  };

  getProfile = async (req, res) => {
    try {
      const result = await UserService.getProfile(req, res);
      this.responseHandler.successResponse(result, res);
    } catch (err) {
      return err;
    }
  };

  logout = async (req, res) => {
    try {
      const result = await UserService.logout(req, res);
      this.responseHandler.successResponse(result, res, 204);
    } catch (err) {
      return err;
    }
  };
}

module.exports = new UserController();
