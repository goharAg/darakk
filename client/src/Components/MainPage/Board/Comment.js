import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../AuthContext';
import moment from 'moment';
import './Comment.css';
import profilePicture from '../../../Assets/Images/profilePicture.png';
import client from '../../../services/requests.service';
import CommentArea from './CommentArea';

const Comment = ({ changed, commentObj, commentPosition, task, setTask }) => {
  const { user } = useAuth();
  const [edit, setEdit] = useState(false);
  const dateMomentObj = moment(new Date(commentObj.created_at));
  const dateTime = dateMomentObj.format('LLLL');

  const handleDeleteComment = async (commentId) => {
    await client.deleteComment(commentId);
    task.comments.splice(commentPosition, 1);
    setTask({ ...task });
  };

  useEffect(() => {
    setTask({ ...task });
  }, [changed]);

  return (
    <div className="full-comment">
      <div className="comment">
        <img
          title={`${commentObj.user.first_name} ${commentObj.user.last_name}`}
          className="rounded-circle"
          src={commentObj.user.image_name ? `${client.HOST_NAME}/${commentObj.user.image_name}` : profilePicture}
        />

        {edit ? (
          <CommentArea task={task} setTask={setTask} setEdit={setEdit} commentObj={commentObj} />
        ) : (
          <div className="comment-actions">
            <div title={dateTime} className="comment-body">
              {commentObj.content}
            </div>
            {commentObj.user.id === user.id && (
              <div className="action-btns">
                <a onClick={() => setEdit(true)} className="edit-comment-btn">
                  Edit
                </a>
                -
                <a onClick={() => handleDeleteComment(commentObj.id)} className="edit-comment-btn">
                  Delete
                </a>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Comment;
