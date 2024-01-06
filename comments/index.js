const express = require("express");
const bodyPasrser = require("body-parser");
const { randomBytes } = require("crypto");
const cors = require("cors");
const axios = require("axios");

const app = express();
app.use(bodyPasrser.json());
app.use(cors());

const commentsByPostId = {};

app.get("/posts/:id/comments", (req, res) => {
  res.send(commentsByPostId[req.params.id] || []);
});

app.post("/posts/:id/comments", async (req, res) => {
  const id = randomBytes(4).toString("hex");
  const { content } = req.body;

  const comments = commentsByPostId[req.params.id] || [];
  comments.push({ id, content });
  commentsByPostId[req.params.id] = comments;

  await axios.post("http://localhost:4005/events", {
    type: "CommentCreated",
    data: {
      postId: req.params.id,
      id,
      content,
    },
  });

  res.status(201).send(comments);
});

app.post("/events", (req, res) => {
  console.log("Received event", req.body.type);

  res.send({});
});

app.listen(4001, () => {
  console.log("listening on port 4001");
});