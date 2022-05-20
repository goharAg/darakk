import { useState, useRef } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import client from '../../../services/requests.service';
import profilePicture from '../../../Assets/Images/profilePicture.png';
import './AddMember.css';

const AddMember = ({ members, setMembers, boardId }) => {
  const [searchUser, setSearchUser] = useState(false);
  const [users, setUsers] = useState([]);
  const btnRef = useRef(null);
  const handleAddClick = (e) => {
    setSearchUser(!searchUser);
    btnRef.current.classList.toggle('is-active');
    setUsers([]);
  };

  const handleAddMember = async (user) => {
    try {
      await client.addMemberToBoard(boardId, user.id);
      setMembers([...members, user]);
      handleAddClick();
    } catch (error) {
      toast.error(error.response?.data.messages[0]);
    }
  };

  const handleInputChange = async (e) => {
    if (!e.target.value) {
      setUsers([]);
      return;
    }
    const matchUsers = await client.findMatchUsers(e.target.value);
    setUsers(matchUsers);
  };
  return (
    <>
      <div ref={btnRef} className="ico-btn add-member-btn" onClick={(e) => handleAddClick(e)}>
        <span className="ico-btn__plus open-close-input"></span>
      </div>
      {searchUser && (
        <div className="add-member">
          <span>
            <input className="search-user" placeholder="Search user by email..." autoFocus onChange={handleInputChange} />
          </span>
          <div className="search-result">
            <ul className="list-group list-group-flush">
              {users.map((user) => (
                <li key={user.id} className="each-result list-group-item">
                  <img src={user.image_name ? `${client.HOST_NAME}/${user.image_name}` : `${profilePicture}`} className="search-img rounded-circle member-icon" />
                  <h4 className="user-info">{`${user.first_name} ${user.last_name}`}</h4>
                  <button className="add-btn btn btn-primary btn-sm" onClick={() => handleAddMember(user)}>
                    Add
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
      <ToastContainer autoClose={2000} position={toast.POSITION.BOTTOM_RIGHT} />
    </>
  );
};

export default AddMember;
