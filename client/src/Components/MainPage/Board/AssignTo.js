import { useState, useRef } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import client from '../../../services/requests.service';
import profilePicture from '../../../Assets/Images/profilePicture.png';
import './AssignTo.css';
const AssignTo = ({ fetchTask, boardId, members, taskId }) => {
  const [users, setUsers] = useState([...members]);

  const handleInputChange = async (e) => {
    if (!e.target.value) {
      setUsers([...members]);
      return;
    }
    const matchUsers = await client.findBoardUsers(boardId, e.target.value);
    setUsers(matchUsers);
  };

  const handleAssignTo = async (id) => {
    const res = await client.createAssignment(taskId, id);
    fetchTask(taskId);
  };

  return (
    <>
      <div className="assign-wrapper">
        <span>
          <input className="search-user" placeholder="Search members by email..." autoFocus onChange={handleInputChange} />
        </span>
        <div className="search-result">
          <ul className="list-group list-group-flush">
            {users.map((user) => (
              <li key={user.id} className="each-result list-group-item">
                <img src={user.image_name ? `${client.HOST_NAME}/${user.image_name}` : `${profilePicture}`} className="search-img rounded-circle member-icon" />
                <h4 className="user-info">{`${user.first_name} ${user.last_name}`}</h4>
                <button className="add-btn btn btn-primary btn-sm" onClick={() => handleAssignTo(user.id)}>
                  Assign
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <ToastContainer autoClose={2000} position={toast.POSITION.BOTTOM_RIGHT} />
    </>
  );
};

export default AssignTo;
