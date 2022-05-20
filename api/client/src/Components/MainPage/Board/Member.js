import { useEffect, useState } from 'react';
import { useAuth } from '../../../AuthContext';
import client from '../../../services/requests.service';
import ProfileDropdown from './ProfileDropdown';
import AddMember from './AddMember';
import profilePicture from '../../../Assets/Images/profilePicture.png';
import './Member.css';

const Member = ({ boardId, boardState, setBoardState, members, setMembers }) => {
  const { user } = useAuth();
  const [isProfileDropdown, setIsProfileDropdown] = useState(false);
  const [member, setMember] = useState({});
  const [index, setIndex] = useState(-1);

  useEffect(async () => {
    setMembers(await client.getBoardMembers(boardId));
  }, []);
  const handleMemberClick = (idx, id) => {
    isProfileDropdown && member.id === members[idx].id ? setIsProfileDropdown(false) : setIsProfileDropdown(true);
    setMember(members[idx]);
    if (isProfileDropdown && idx === index) {
      setIsProfileDropdown(false);
    } else {
      setIsProfileDropdown(true);
    }
    setIndex(idx);
  };
  return (
    <div className="member-section">
      {members.map((member, idx) => (
        <span className="member" key={member.id} onClick={() => handleMemberClick(idx, member.id)}>
          <img className="rounded-circle member-icon" src={member.image_name ? `${client.HOST_NAME}/${member.image_name}` : profilePicture} />
        </span>
      ))}
      {isProfileDropdown && (
        <ProfileDropdown
          boardId={boardId}
          user={user}
          boardState={boardState}
          setBoardState={setBoardState}
          members={members}
          setMembers={setMembers}
          index={index}
          setIndex={setIndex}
          setIsProfileDropdown={setIsProfileDropdown}
        />
      )}
      <AddMember members={members} setMembers={setMembers} boardId={boardId} />
    </div>
  );
};

export default Member;
