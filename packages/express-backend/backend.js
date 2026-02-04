import dotenv from "dotenv";
import mongoose from "mongoose";
import express from "express";
import cors from "cors";
import userService from "./services/user-service.js"

dotenv.config();

const { MONGO_CONNECTION_STRING } = process.env;

mongoose.set("debug", true);
mongoose
  .connect(MONGO_CONNECTION_STRING + "users")
  .catch((error) => console.log(error));

const app = express();
const port = 8000;

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

const toApiUser = (doc) => {
  if (!doc) return doc;
  return {
    id: doc._id.toString(),
    name: doc.name,
    job: doc.job,
  };
};

app.get("/users", (req, res) => {
  const name = req.query.name;
  const job = req.query.job;

  userService
    .getUsers(name, job)
    .then((docs) => {
      const usersList = docs.map(toApiUser);
      res.send({ users_list: usersList });
    })
    .catch((err) => {
      res.status(500).send(err.message);
    });
});

app.get("/users/:id", (req, res) => {
  const id = req.params.id;

  userService
    .findUserById(id)
    .then((doc) => {
      if (!doc) {
        res.status(404).send("Resource not found.");
        return;
      }
      res.send(toApiUser(doc));
    })
    .catch((err) => {
      res.status(500).send(err.message);
    });
});

app.post("/users", (req, res) => {
  const userToAdd = req.body;

  userService
    .addUser(userToAdd)
    .then((createdDoc) => {
      res.status(201).send(toApiUser(createdDoc));
    })
    .catch((err) => {
      res.status(500).send(err.message);
    });
});

app.delete("/users/:id", (req, res) => {
  const id = req.params.id;

  userService
    .deleteUserById(id)
    .then((deleted) => {
      if (!deleted) {
        res.status(404).send("Resource not found.");
        return;
      }
      res.status(204).send();
    })
    .catch((err) => {
      res.status(500).send(err.message);
    });
});

app.listen(port, () => {
  console.log(
    `Example app listening at http://localhost:${port}`
  );
});