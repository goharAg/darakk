const afterCreate = async (model, db) => {
  const boardId = model.id;
  const statesList = ['to do', 'in progress', 'done'];
  const boardStates = [];

  statesList.forEach((state, idx) => {
    boardStates.push({ board_id: boardId, state_name: state, order: idx + 1 });
  });
  const createdStates = await db.State.bulkCreate(boardStates);

  const stateOrders = [];
  createdStates.forEach((state) => {
    stateOrders.push({ state_id: state.id, order: '' });
  });
  await db.StateOrderMapping.bulkCreate(stateOrders);
};

module.exports = { afterCreate };
