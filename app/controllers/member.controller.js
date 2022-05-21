const db = require('../modules/db/models');
const BaseController = require('./base.controller');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const MemberService = require('../services/member.service');

class MemberController extends BaseController {
  constructor() {
    super('member');
  }

  add = async (req, res) => {
    try {
      const result = await MemberService.add(req, res);
      this.responseHandler.successResponse(result, res);
    } catch (err) {
      return err;
    }
  };

  remove = async (req, res) => {
    try {
      const result = await MemberService.remove(req, res);
      this.responseHandler.successResponse(result, res);
    } catch (err) {
      return err;
    }
  };

  findMatchUsers = async (req, res) => {
    try {
      const result = await MemberService.findMatchUsers(req, res);
      this.responseHandler.successResponse(result, res);
    } catch (err) {
      return err;
    }
  };

  findBoardMembers = async (req, res) => {
    try {
      const result = await MemberService.findBoardMembers(req, res);
      this.responseHandler.successResponse(result, res);
    } catch (err) {
      return err;
    }
  };

  boardMembers = async (req, res) => {
    try {
      const result = await MemberService.boardMembers(req, res);
      this.responseHandler.successResponse(result, res);
    } catch (err) {
      return err;
    }
  };

  leaveBoard = async (req, res) => {
    try {
      const result = await MemberService.leaveBoard(req, res);
      this.responseHandler.successResponse(result, res);
    } catch (err) {
      return err;
    }
  };

  promote = async (req, res) => {
    try {
      const result = await MemberService.promote(req, res);
      this.responseHandler.successResponse(result, res);
    } catch (err) {
      return err;
    }
  };

  demote = async (req, res) => {
    try {
      const result = await MemberService.demote(req, res);
      this.responseHandler.successResponse(result, res);
    } catch (err) {
      return err;
    }
  };
}

module.exports = new MemberController();
