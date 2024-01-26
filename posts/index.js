const express = require("express");
const bodyPasrser = require("body-parser");
const { randomBytes } = require("crypto");
const cors = require("cors");
const axios = require("axios");

const app = express();
app.use(bodyPasrser.json());
app.use(cors());

const posts = {};

// app.get("/posts", (req, res) => {
//   res.send(posts);
// });

app.post("/posts/create", async (req, res) => {
  const id = randomBytes(4).toString("hex");
  const { title } = req.body;

  posts[id] = { id, title };

  try {
    await axios.post(`http://${process.env.EVENT_BUS_ADDRESS}:4005/events`, {
      type: "PostCreated",
      data: {
        id,
        title,
      },
    });
  } catch (e) {
    console.log("Error sending event :", e);
    res.status(500).send({ status: "Error" });
    return;
  }

  res.status(201).send(posts[id]);
});

app.post("/events", (req, res) => {
  console.log("Received event", req.body.type);

  res.send({});
});

app.listen(4000, () => {
  console.log("listening on port 4000");
});
