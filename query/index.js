const express = require("express");
const bodyPasrser = require("body-parser");
const { randomBytes } = require("crypto");
const cors = require("cors");
const axios = require("axios");

const app = express();
app.use(bodyPasrser.json());
app.use(cors());

const posts = {};

const handleEvent = (type, data) => {
  switch (type) {
    case "PostCreated":
      const { id, title } = data;
      posts[id] = { id, title, comments: [] };
      return;
    case "CommentCreated":
      const { postId, id: commentId, content, status } = data;
      try {
        let comments = posts[postId]?.comments || [];
        comments.push({ id: commentId, content, status });
        posts[postId].comments = comments;
      } catch (e) {
        console.log("Query service creation error:", e.message);
        res.send({ status: "Error" }).status(304);
      }
      return;
  }

  if (type === "CommentUpdated") {
    const { id, content, status, postId } = data;
    let comments = posts[postId].comments;

    const comment = comments.find((comment) => {
      return comment.id === id;
    });
    comment.status = status;
    comment.content = content;
  }
};

app.get("/posts", (req, res) => {
  res.send(posts);
});

app.post("/events", (req, res) => {
  const { type, data } = req.body;

  handleEvent(type, data);
  res.send({});
});

app.listen(4002, async () => {
  console.log("listening on port 4002");

  const res = await axios.get(
    `http://${process.env.EVENT_BUS_ADDRESS}:4005/events`
  );

  for (let event of res.data) {
    console.log("Processing event : ", event.type);
    handleEvent(event.type, event.data);
  }
});
