import axios from "axios";
import React, { useState } from "react";

export default function PostCreate() {
  const [title, setTitle] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();

    await axios.post("/posts/create", {
      title,
    });
    setTitle("");
  };

  return (
    <div>
      <form onSubmit={onSubmit}>
        <div className="form-group">
          <label>Title</label>
          <input
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
            }}
            className="form-control"
          />
        </div>
        <button style={{ marginTop: "20px" }} className="btn btn-primary">
          Submit
        </button>
      </form>
    </div>
  );
}
