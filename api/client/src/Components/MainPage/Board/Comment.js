import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../AuthContext';
import moment from 'moment';
import './Comment.css';
import profilePicture from '../../../Assets/Images/profilePicture.png';
import emojiIcon from '../../../Assets/Images/emoji.png';
import client from '../../../services/requests.service';
import CommentArea from './CommentArea';
import Picker from 'emoji-picker-react';
import { emojiCombine, emojiUnCombine } from '../../../handlers/reaction.handler';

const Comment = ({ changed, commentObj, commentPosition, task, setTask }) => {
  const { user } = useAuth();
  const [edit, setEdit] = useState(false);
  const [emojiWindow, setEmojiWindow] = useState(false);
  const dateMomentObj = moment(new Date(commentObj.created_at));
  const dateTime = dateMomentObj.format('LLLL');

  const handleDeleteComment = async (commentId) => {
    await client.deleteComment(commentId);
    task.comments.splice(commentPosition, 1);
    setTask({ ...task });
  };

  const handleReaction = async (e, emojiObject) => {
    const resEmojiObj = await client.reactComment(commentObj.id, emojiObject);
    if (resEmojiObj.deleted) {
      emojiUnCombine(task.comments[commentPosition].emojis, emojiObject, user);
      const filteredEmojis = task.comments[commentPosition].emojis.filter((emoji) => {
        return emoji.id !== resEmojiObj.id;
      });
      task.comments[commentPosition].emojis = filteredEmojis;
      setTask({ ...task });
      setEmojiWindow(false);
      return;
    }
    task.comments[commentPosition].emojis.push(resEmojiObj);
    task.comments[commentPosition].emojis = emojiCombine(task.comments[commentPosition].emojis);

    setTask({ ...task });
    setEmojiWindow(false);
  };

  useEffect(() => {
    task.comments[commentPosition].emojis = emojiCombine(task.comments[commentPosition].emojis);
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
            <span className="emoji">
              {commentObj.emojis.map((emojiObj) => (
                <span className="emoji-one" title={`${emojiObj.usersStr}`} onClick={() => handleReaction(null, emojiObj.emoji)} key={emojiObj.id}>
                  {emojiObj.emoji.emoji}
                  {emojiObj.count}
                </span>
              ))}
            </span>
            <span className="add-emoji-btn">
              <img onClick={() => (emojiWindow ? setEmojiWindow(false) : setEmojiWindow(true))} title="Add reaction" src={emojiIcon} />
            </span>
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

      {emojiWindow && <Picker disableSearchBar={true} pickerStyle={{ position: 'absolute' }} onEmojiClick={handleReaction} />}
    </div>
  );
};

export default Comment;
