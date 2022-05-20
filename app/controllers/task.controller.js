const db = require('../modules/db/models');
const BaseController = require('./base.controller');

class TaskController extends BaseController {
  constructor() {
    super('task');
  }

  get = async (req, res) => {
    const id = req.params.taskId;
    try {
      const task = await db.Task.findByPk(id, {
        include: [
          {
            model: db.TaskAssignment,
            as: 'task_assignments',
          },
          {
            model: db.Comment,
            as: 'comments',
            include: [
              {
                model: db.User,
                as: 'user',
              },
              {
                model: db.CommentEmoji,
                as: 'emojis',
                include: {
                  model: db.User,
                  as: 'user',
                  attributes: ['first_name', 'last_name'],
                },
              },
            ],
          },
        ],
      });
      if (task) {
        return this.responseHandler.successResponse(task, res);
      }
      throw this.responseHandler.getNotFoundError(`Task with id <${id}> not found.`);
    } catch (err) {
      this.responseHandler.errorResponse(err, res);
    }
  };

  update = async (req, res) => {
    const id = req.params.taskId;
    const { boardId, ...newAttributes } = req.body;
    try {
      const [tasksUpdated] = await db.Task.update(newAttributes, { where: { id } });
      const task = await db.Task.findByPk(id);
      const state = await db.State.findByPk(task.state_id);
      const stateOrder = await db.StateOrderMapping.findOne({
        where: {
          state_id: state.id,
        },
      });
      const taskOrder = stateOrder.dataValues.order.split('_').indexOf(id);

      if (tasksUpdated) {
        req.io.to(Number(boardId)).emit('task', {
          userId: req.user.id,
          updatedId: Number(id),
          taskPosition: taskOrder,
          statePosition: state.order - 1,
          newAttributes,
          action: 'update',
        });
        req.io.to(Number(id)).emit('taskWindow', {
          userId: req.user.id,
          action: 'update',
        });
        return this.responseHandler.successResponse({ tasksUpdated }, res);
      }
      throw this.responseHandler.getNotFoundError(`Task with id <${id}> not found.`);
    } catch (err) {
      this.responseHandler.errorResponse(err, res);
    }
  };

  create = async (req, res) => {
    const { boardId, ...task } = req.body;
    const stateId = req.params.stateId;
    task.state_id = stateId;
    try {
      const order = await db.Task.max('order', {
        where: {
          state_id: stateId,
        },
      });
      task.order = order + 1;
      const createdTask = await db.Task.create(task);
      let currentOrder = await db.StateOrderMapping.findOne({ where: { state_id: stateId } });
      currentOrder = currentOrder.order + '_' + createdTask.id;
      await db.StateOrderMapping.update({ order: currentOrder }, { where: { state_id: stateId } });
      const state = await db.State.findByPk(stateId);
      req.io.to(Number(boardId)).emit('task', {
        userId: req.user.id,
        dataValues: createdTask.dataValues,
        statePosition: state.order - 1, // order - 1 is position in array
        action: 'create',
      });
      req.io.to(Number(createdTask.id)).emit('taskWindow', {
        userId: req.user.id,
        action: 'update',
      });
      return this.responseHandler.successResponse(createdTask, res);
    } catch (err) {
      this.responseHandler.errorResponse(err, res);
    }
  };

  delete = async (req, res) => {
    const id = req.params.taskId;
    try {
      const task = await db.Task.findByPk(id);
      const stateId = task['state_id'];
      const stateOrder = await db.StateOrderMapping.findOne({
        where: {
          state_id: stateId,
        },
      });
      const taskOrder = stateOrder.dataValues.order.split('_').indexOf(id);
      const newOrder = stateOrder.dataValues.order
        .split('_')
        .filter((cur) => {
          return cur != id;
        })
        .join('_');
      stateOrder.set({
        order: newOrder,
      });

      await stateOrder.save();
      const state = await db.State.findByPk(task.state_id);
      const numberOfDeletedTasks = await db.Task.destroy({ where: { id } });
      if (numberOfDeletedTasks) {
        req.io.to(state.board_id).emit('task', {
          deletedId: Number(id),
          userId: req.user.id,
          stateId: task.state_id,
          statePosition: state.order - 1, // order - 1 is position in array
          taskPosition: taskOrder,
          action: 'delete',
        });
        req.io.to(Number(id)).emit('taskWindow', {
          userId: req.user.id,
          action: 'delete',
        });
        return this.responseHandler.successResponse({ deleted: numberOfDeletedTasks }, res);
      }
      throw this.responseHandler.getNotFoundError(`Task with id <${id}> not found.`);
    } catch (err) {
      this.responseHandler.errorResponse(err, res);
    }
  };

  updateState = async (req, res) => {
    const fromStateId = req.params.fromStateId;
    const toStateId = req.params.toStateId;
    const taskId = req.params.taskId;
    const beforeTaskId = req.params.beforeTaskId;
    try {
      const task = await db.Task.findByPk(taskId);
      if (fromStateId !== toStateId) {
        task.set({
          state_id: toStateId,
        });
        await task.save();
        const fromStateOrder = await db.StateOrderMapping.findOne({
          where: {
            state_id: fromStateId,
          },
        });
        const newOrder = fromStateOrder.dataValues.order.split('_');
        newOrder.splice(newOrder.indexOf(taskId), 1);
        fromStateOrder.set({
          order: newOrder.join('_'),
        });
        await fromStateOrder.save();

        let currentOrder = await db.StateOrderMapping.findOne({ where: { state_id: toStateId } });
        if (beforeTaskId == 0) {
          currentOrder = currentOrder.order + `_${taskId}`;
        } else {
          let placeIndex = currentOrder.order.indexOf(beforeTaskId);
          currentOrder = [currentOrder.order.slice(0, placeIndex - 1), `_${taskId}`, currentOrder.order.slice(placeIndex - 1)].join('');
        }
        await db.StateOrderMapping.update({ order: currentOrder }, { where: { state_id: toStateId } });
      } else {
        if (taskId === beforeTaskId) {
          return this.responseHandler.successResponse(task, res);
        }
        let currentOrder = await db.StateOrderMapping.findOne({
          where: {
            state_id: fromStateId,
          },
        });
        currentOrder = currentOrder.dataValues.order.split('_');
        currentOrder.splice(currentOrder.indexOf(taskId), 1);
        currentOrder = currentOrder.join('_');
        if (beforeTaskId == 0) {
          currentOrder += `_${taskId}`;
        } else {
          let placeIndex = currentOrder.indexOf(beforeTaskId);
          currentOrder = [currentOrder.slice(0, placeIndex - 1), `_${taskId}`, currentOrder.slice(placeIndex - 1)].join('');
        }
        await db.StateOrderMapping.update({ order: currentOrder }, { where: { state_id: toStateId } });
        if (!currentOrder) {
          throw this.responseHandler.getNotFoundError(`Order with state id <${fromStateId}> not found.`);
        }
      }
      if (task) {
        const state = await db.State.findByPk(task.state_id);
        req.io.to(state.board_id).emit('state', {
          action: 'move',
        });
        return this.responseHandler.successResponse(task, res);
      }
      throw this.responseHandler.getNotFoundError(`Task with id <${id}> not found.`);
    } catch (err) {
      this.responseHandler.errorResponse(err, res);
    }
  };
}

module.exports = new TaskController();
