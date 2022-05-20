import client from '../../../services/requests.service';
import CloseButton from '../../shared/CloseButton';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import './ProfileDropdown.css';
import { useEffect, useState } from 'react';
import ConfirmPopUp from '../../shared/ConfirmPopUp';

const ProfileDropdown = ({ boardId, user, boardState, setBoardState, index, members, setMembers, setIsProfileDropdown }) => {
  const navigate = useNavigate();

  const handleLeaveBoard = async () => {
    try {
      await client.leaveBoard(boardId);
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.response?.data.messages[0]);
    }
  };

  const handleRemoveMemberFromBoard = async () => {
    try {
      await client.removeMemberFromBoard(boardId, members[index].id);
      const newMembersList = members.filter((eachMember) => {
        return eachMember.id !== members[index].id;
      });
      setIsProfileDropdown(false);
      setMembers(newMembersList);
    } catch (error) {
      toast.error(error.response?.data.messages[0]);
    }
  };

  const handleCloseBtnClick = () => {
    setIsProfileDropdown(false);
  };

  const handleUserLaw = async () => {
    try {
      let ubm; // user board mapping info
      if (members[index].is_admin) {
        ubm = await client.demoteUserFromAdmin(boardId, members[index].id);
      } else {
        ubm = await client.promoteUserToAdmin(boardId, members[index].id);
      }
      const newMember = { ...members[index], is_admin: ubm.is_admin };
      members[index] = newMember;
      setMembers([...members]);
    } catch (error) {
      toast.error(error.response?.data.messages[0]);
    }
  };

  useEffect(async () => {
    const users = await client.getBoardMembers(boardId);
    if (user.id === members[index].id) {
      boardState.boardObj.userIsAdmin = users[index].is_admin;
      setBoardState({ ...boardState });
    }
    setMembers(users);
  }, [index]);

  const [showConfirmPopUp, setShowConfirmPopUp] = useState(false);
  const openPopUp = () => {
    setShowConfirmPopUp(true);
  };

  const removePopUp = () => {
    setShowConfirmPopUp(false);
  };

  return (
    <>
      {showConfirmPopUp && <ConfirmPopUp removePopUp={removePopUp} handleAction={handleRemoveMemberFromBoard} />}
      <div className="profile-dropdown-menu">
        <span className="dropdown-title">Board {members[index].is_admin ? 'admin' : 'member'}</span>
        <CloseButton onClick={handleCloseBtnClick} />
        <hr className="h-line" />
        <div className="d-flex profile-info">
          <div className="">
            <div className="profile-name">
              {members[index].first_name} {members[index].last_name}
            </div>
            <div className="profile-email">{members[index].email}</div>
            <hr className="h-line" />
            {(user.id === members[index].id && (
              <button onClick={handleLeaveBoard} className="btn btn-danger">
                Leave board
              </button>
            )) ||
              !boardState.boardObj.userIsAdmin || (
                <>
                  <button className="btn btn-outline-primary" onClick={handleUserLaw}>
                    {members[index].is_admin ? 'Demote to member' : 'Promote to admin'}
                  </button>
                  <hr className="h-line" />
                  <button className="btn btn-outline-danger" onClick={openPopUp}>
                    Remove from board
                  </button>
                </>
              )}
          </div>
        </div>
        <ToastContainer autoClose={2000} position={toast.POSITION.BOTTOM_RIGHT} />
      </div>
    </>
  );
};

export default ProfileDropdown;
