const db = require('../modules/db/models');
const BaseController = require('./base.controller');

class AssignmentController extends BaseController {
  constructor() {
    super('assignment');
  }
  create = async (req, res) => {
    const taskId = req.params.taskId;
    const userId = req.params.userId;
    try {
      const assignmentExists = await db.TaskAssignment.findOne({
        where: {
          user_id: userId,
          task_id: taskId,
        },
      });
      if (assignmentExists) {
        throw this.responseHandler.getMemberExistsError('Member already assigned on task');
      }
      const createdAssignment = await db.TaskAssignment.create({
        user_id: userId,
        task_id: taskId,
      });
      req.io.to(Number(taskId)).emit('taskWindow', {
        userId: req.user.id,
        action: 'update',
      });
      this.responseHandler.successResponse(createdAssignment, res);
    } catch (err) {
      this.responseHandler.errorResponse(err, res);
    }
  };

  delete = async (req, res) => {
    const assignmentId = req.params.assignmentId;
    const assignment = await db.TaskAssignment.findByPk(assignmentId);
    try {
      const numberOfDeletedAssignment = await db.TaskAssignment.destroy({
        where: { id: assignmentId },
      });
      if (numberOfDeletedAssignment) {
        req.io.to(Number(assignment.task_id)).emit('taskWindow', {
          userId: req.user.id,
          action: 'update',
        });
        return this.responseHandler.successResponse({ deleted: numberOfDeletedAssignment }, res);
      }

      throw this.responseHandler.getNotFoundError(`Assignment with id <${assignmentId}> not found.`);
    } catch (err) {
      this.responseHandler.errorResponse(err, res);
    }
  };
}

module.exports = new AssignmentController();
