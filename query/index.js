const express = require("express");
const bodyPasrser = require("body-parser");
const { randomBytes } = require("crypto");
const cors = require("cors");

const app = express();
app.use(bodyPasrser.json());
app.use(cors());

const posts = {};

app.get("/posts", (req, res) => {
  res.send(posts);
});

app.post("/events", (req, res) => {
  const { type, data } = req.body;

  switch (type) {
    case "PostCreated":
      const { id, title } = data;
      posts[id] = { id, title, comments: [] };
      return;
    case "CommentCreated":
      const { postId, id: commentId, content } = data;
      try {
        let comments = posts[postId]?.comments || [];
        comments.push({ id: commentId, content: content });
        posts[postId].comments = comments;
      } catch (e) {
        console.log("Query service creation error:", e.message);
        res.send({ status: "Error" }).status(304);
        return;
      }
  }
  console.log("posts", posts);
  res.send({});
});

app.listen(4002, () => {
  console.log("listening on port 4002");
});
