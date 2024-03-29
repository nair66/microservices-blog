import axios from "axios";
import React, { useState } from "react";
export default function CommentCreate({ postId }) {
  const [content, setContent] = useState("");
  const onSubmit = async (e) => {
    e.preventDefault();

    await axios.post(`/posts/${postId}/comments`, {
      content,
    });
    setContent("");
  };

  return (
    <div>
      <form onSubmit={onSubmit}>
        <div className="form-group" style={{ marginBottom: "20px" }}>
          <label>New Comment</label>
          <input
            className="form-control"
            value={content}
            onChange={(e) => {
              setContent(e.target.value);
            }}
          />
        </div>
        <button className="btn btn-primary">Submit</button>
      </form>
    </div>
  );
}
