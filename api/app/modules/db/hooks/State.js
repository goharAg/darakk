const afterCreate = async (model, db) => {
  const stateId = model.id;
  await db.StateOrderMapping.create({ state_id: stateId, order: '' });
};

module.exports = { afterCreate };
