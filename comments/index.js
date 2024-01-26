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
  comments.push({ id, content, status: "pending" });
  commentsByPostId[req.params.id] = comments;

  await axios.post(`http://${process.env.EVENT_BUS_ADDRESS}:4005/events`, {
    type: "CommentCreated",
    data: {
      postId: req.params.id,
      id,
      content,
      status: "pending",
    },
  });

  res.status(201).send(comments);
});

app.post("/events", async (req, res) => {
  const { type, data } = req.body;

  if (type === "CommentModerated") {
    const { postId, id, status } = data;
    const comments = commentsByPostId[postId];

    const comment = comments.find((comment) => {
      return comment.id === id;
    });

    comment.status = status;

    await axios.post(`http://${process.env.EVENT_BUS_ADDRESS}:4005/events`, {
      type: "CommentUpdated",
      data,
    });
  }

  res.send({});
});

app.listen(4001, () => {
  console.log("listening on port 4001");
});
