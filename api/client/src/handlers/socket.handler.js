export const updateStates = (res, state, setState, fetchBoard) => {
  switch (res.action) {
    case 'create':
      setState({ ...state, boardObj: { ...state.boardObj, states: [...state.boardObj.states, res.dataValues] } });
      break;
    case 'update':
      const updatedState = { ...state.boardObj.states[res.statePosition], ...res.newAttributes };
      state.boardObj.states[res.statePosition] = updatedState;
      setState({ ...state });
      break;
    case 'delete':
      state.boardObj.states.splice(res.statePosition, 1);
      setState({ ...state });
      break;
    case 'move':
      fetchBoard();
      break;
    default:
      console.log('Method not found');
  }
};

export const updateTasks = (res, state, setState, listChanged, setListChanged) => {
  switch (res.action) {
    case 'create':
      state.boardObj.states[res.statePosition].tasks.push(res.dataValues);
      setState({ ...state });
      setListChanged(!listChanged);
      break;
    case 'update':
      const newTask = { ...state.boardObj.states[res.statePosition].tasks[res.taskPosition], ...res.newAttributes };
      state.boardObj.states[res.statePosition].tasks[res.taskPosition] = newTask;
      setState(state);
      setListChanged(!listChanged);
    case 'delete':
      state.boardObj.states[res.statePosition].tasks.splice(res.taskPosition, 1);
      setState({ ...state });
      setListChanged(!listChanged);
      break;
    default:
      console.log('Method not found');
  }
};

export const updateMembers = (res, setMembers, members) => {
  if (res.action === 'create') return setMembers([...members, res.member]);
  const newMembers = members.filter((eachMember) => {
    return res.deletedId !== eachMember.id;
  });
  setMembers(newMembers);
};

export const updateTaskWindow = async (res, changed, setChanged, fetchTask, closeWindow) => {
  switch (res.action) {
    case 'update':
      await fetchTask();
      break;
    case 'commentUpdate':
      await fetchTask();
      setChanged(!changed);
      break;
    case 'delete':
      closeWindow();
      break;
  }
};
