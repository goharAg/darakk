const db = require('../modules/db/models');
const BaseService = require('./base.service');

class StateService extends BaseService {
  constructor() {
    super('state');
  }

  update = async (req, res) => {
    const id = req.params.stateId;
    const newAttributes = req.body;
    try {
      const state = await db.State.findByPk(id);
      const statesUpdated = await db.State.update(newAttributes, { where: { id } });
      const updatedState = await db.State.findByPk(id);
      if (statesUpdated) {
        req.io.to(state.board_id).emit('state', {
          userId: req.user.id,
          updatedId: Number(id),
          statePosition: state.order - 1,
          newAttributes,
          action: 'update',
        });
        return updatedState;
      }
      throw this.responseHandler.getNotFoundError(`State with id <${id}> not found.`);
    } catch (err) {
      this.responseHandler.errorResponse(err, res);
    }
  };

  create = async (req, res) => {
    const state = req.body;
    const boardId = req.params.boardId;
    state.board_id = boardId;
    try {
      const order = await db.State.max('order', {
        where: {
          board_id: boardId,
        },
      });
      state.order = order + 1;
      const createdState = await db.State.create(state);
      req.io.to(Number(boardId)).emit('state', {
        userId: req.user.id,
        dataValues: createdState.dataValues,
        action: 'create',
      });
      return createdState;
    } catch (err) {
      this.responseHandler.errorResponse(err, res);
    }
  };

  delete = async (req, res) => {
    const id = req.params.stateId;
    try {
      const state = await db.State.findByPk(id);
      let numberOfDeletedStates = await db.State.destroy({
        where: { id },
      });
      if (numberOfDeletedStates) {
        req.io.to(state.board_id).emit('state', {
          userId: req.user.id,
          deletedId: Number(id),
          statePosition: state.order - 1,
          action: 'delete',
        });
        return { deleted: numberOfDeletedStates };
      }
      throw this.responseHandler.getNotFoundError(`State with id <${id}> not found.`);
    } catch (err) {
      this.responseHandler.errorResponse(err, res);
    }
  };
}

module.exports = new StateService();
