const db = require('../modules/db/models');
const BaseService = require('./base.service');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

class MemberService extends BaseService {
  constructor() {
    super('member');
  }

  add = async (req, res) => {
    const boardId = req.params.boardId;
    const userId = req.params.userId;
    try {
      const memberExists = await db.UserBoardMapping.findOne({
        where: {
          board_id: boardId,
          user_id: userId,
        },
      });
      if (memberExists) {
        throw this.responseHandler.getMemberExistsError('User already exists on board');
      }
      const userBoardMappingInfo = await db.UserBoardMapping.create({
        board_id: boardId,
        user_id: userId,
        is_admin: false,
      });
      const member = await db.UserBoardMapping.findOne({
        where: {
          board_id: boardId,
          user_id: userId,
        },
        include: {
          model: db.User,
          as: 'user',
        },
      });
      req.io.to(Number(boardId)).emit('member', {
        member: { ...member.user.dataValues, is_admin: member.is_admin },
        userId: req.user.id,
        action: 'create',
      });
      return userBoardMappingInfo, res;
    } catch (err) {
      return this.responseHandler.errorResponse(err, res);
    }
  };

  remove = async (req, res) => {
    const boardId = req.params.boardId;
    const userId = req.params.userId;
    try {
      if (Number(userId) === req.user.id) {
        throw this.responseHandler.getForbiddenError('Can not remove yourself');
      }
      const isDestroyed = await db.UserBoardMapping.destroy({
        where: {
          user_id: userId,
          board_id: boardId,
        },
      });
      req.io.to(Number(boardId)).emit('member', {
        deletedId: Number(userId),
        userId: req.user.id,
        action: 'delete',
      });
      return isDestroyed;
    } catch (err) {
      return this.responseHandler.errorResponse(err, res);
    }
  };

  findMatchUsers = async (req, res) => {
    const userEmail = req.body.userEmail;
    try {
      const users = await db.User.findAll({
        where: {
          email: {
            [Op.like]: `%${userEmail}%`,
          },
        },
        limit: 5,
        raw: true,
      });
      return users;
    } catch (err) {
      return this.responseHandler.errorResponse(err, res);
    }
  };

  findBoardMembers = async (req, res) => {
    const userEmail = req.body.userEmail;
    const boardId = req.body.boardId;
    try {
      let users = await db.User.findAll({
        where: {
          email: {
            [Op.like]: `%${userEmail}%`,
          },
        },
        limit: 5,
        raw: true,
      });
      let boardUsers = await db.UserBoardMapping.findAll({
        where: {
          board_id: boardId,
        },
      });
      boardUsers = boardUsers.map((cur) => cur.user_id);
      users = users.filter((cur) => boardUsers.indexOf(cur.id) !== -1);
      return users;
    } catch (err) {
      return this.responseHandler.errorResponse(err, res);
    }
  };

  boardMembers = async (req, res) => {
    const boardId = req.params.boardId;
    try {
      const membersObj = await db.UserBoardMapping.findAll({
        where: {
          board_id: boardId,
        },
        include: {
          model: db.User,
          as: 'user',
        },
      });
      const members = [];
      membersObj.forEach((memberObj) => {
        members.push({ ...memberObj.user.dataValues, is_admin: memberObj.is_admin });
      });
      return members;
    } catch (err) {
      return this.responseHandler.errorResponse(err, res);
    }
  };

  leaveBoard = async (req, res) => {
    const boardId = req.params.boardId;
    const userId = req.user.id;
    try {
      const userBoardMappingInfo = await db.UserBoardMapping.findAll({
        where: {
          board_id: boardId,
          is_admin: true,
        },
      });
      if (userBoardMappingInfo.length === 1 && userBoardMappingInfo[0].user_id === userId) {
        throw this.responseHandler.getLastAdminLeaveError('The only one admin can not leave board');
      }
      const destroyCount = await db.UserBoardMapping.destroy({
        where: {
          user_id: userId,
          board_id: boardId,
        },
      });
      req.io.to(Number(boardId)).emit('member', {
        deletedId: Number(userId),
        userId: req.user.id,
        action: 'delete',
      });
      return destroyCount;
    } catch (err) {
      return this.responseHandler.errorResponse(err, res);
    }
  };

  promote = async (req, res) => {
    const boardId = req.params.boardId;
    const userId = req.params.userId;
    const isAdmin = true;
    try {
      const [isBoardMember] = await db.UserBoardMapping.update(
        {
          is_admin: isAdmin,
        },
        {
          where: {
            user_id: userId,
            board_id: boardId,
          },
        }
      );
      if (!isBoardMember) {
        throw this.responseHandler.getForbiddenError('Can not promote without adding to the board');
      }
      return { user_id: userId, board_id: boardId, is_admin: isAdmin };
    } catch (err) {
      return this.responseHandler.errorResponse(err, res);
    }
  };

  demote = async (req, res) => {
    const boardId = req.params.boardId;
    const userId = req.params.userId;
    const isAdmin = false;
    const id = req.user.id;
    try {
      if (Number(userId) === id) {
        throw this.responseHandler.getForbiddenError(`Admin can not demote himself`);
      }
      const [isBoardMember] = await db.UserBoardMapping.update(
        {
          is_admin: isAdmin,
        },
        {
          where: {
            user_id: userId,
            board_id: boardId,
          },
        }
      );
      if (!isBoardMember) {
        throw this.responseHandler.getForbiddenError('Can not demote without adding to the board');
      }
      return { user_id: userId, board_id: boardId, is_admin: isAdmin };
    } catch (err) {
      return this.responseHandler.errorResponse(err, res);
    }
  };
}

module.exports = new MemberService();
