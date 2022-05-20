import client from '../../../services/requests.service';
import React, { useState } from 'react';
import './CommentArea.css';

const CommentArea = ({ setEdit, task, setTask, commentObj }) => {
  const [state, setState] = useState(commentObj ? commentObj.content : '');

  const handleSaveComment = async (e) => {
    setEdit(false);
    if (!state) return;
    if (commentObj) {
      const comment = task.comments.find((comment) => comment.id === commentObj.id);
      comment.content = state;
      setTask({ ...task });
      return await client.updateComment(commentObj.id, state);
    } else {
      const commentObj = await client.createComment(task.id, state);
      task.comments.push(commentObj.data);
      setTask({ ...task });
      return;
    }
  };

  const handleInputChange = (e) => {
    setState(e.target.value);
  };

  return (
    <div className="edit-window">
      <textarea
        onChange={handleInputChange}
        value={state}
        className="edit-comment"
        autoFocus
        onFocus={(e) => {
          e.target.value = '';
          e.target.value = state;
        }}
      >
        {commentObj.content}
      </textarea>
      <div className="save-close-btns">
        <button onClick={handleSaveComment} className="save-comment-btn">
          Save
        </button>
        <button onClick={() => setEdit(false)} className="close-comment-btn">
          X
        </button>
      </div>
    </div>
  );
};

export default CommentArea;
