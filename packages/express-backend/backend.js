import express from "express";

const users = {
  users_list: [
    {
      id: "xyz789",
      name: "Charlie",
      job: "Janitor"
    },
    {
      id: "abc123",
      name: "Mac",
      job: "Bouncer"
    },
    {
      id: "ppp222",
      name: "Mac",
      job: "Professor"
    },
    {
      id: "yat999",
      name: "Dee",
      job: "Aspring actress"
    },
    {
      id: "zap555",
      name: "Dennis",
      job: "Bartender"
    }
  ]
};

// Unused helper function, just included for the assignment
const findUserByName = (name) => {
  return users["users_list"].filter(
    (user) => user["name"] === name
  );
};

// "Bigger" function that includes finding both by name and/or job
const findUserByNameJob = ({ name, job }) => {
  return users["users_list"].filter((user) => {
    if (name !== undefined && user["name"] !== name) {
      return false;
    }
    if (job !== undefined && user["job"] !== job) {
      return false;
    }
    return true;
  });
};

const findUserById = (id) =>
  users["users_list"].find((user) => user["id"] === id);

const addUser = (user) => {
  users["users_list"].push(user);
  return user;
};

const deleteUserById = (id) => {
  const index = users["users_list"].findIndex((user) => user["id"] === id);
  if (index === -1) {
    return false;
  }
  users["users_list"].splice(index, 1);
  return true;
};

const app = express();
const port = 8000;

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/users", (req, res) => {
  const name = req.query.name;
  const job = req.query.job;

  if (name === undefined && job === undefined) {
    res.send(users);
    return;
  }

  const result = findUserByNameJob({ name, job });
  res.send({ users_list: result });
});

app.get("/users/:id", (req, res) => {
  const id = req.params["id"]; //or req.params.id
  let result = findUserById(id);
  if (result === undefined) {
    res.status(404).send("Resource not found.");
  } else {
    res.send(result);
  }
});

app.post("/users", (req, res) => {
  const userToAdd = req.body;
  addUser(userToAdd);
  res.send();
});

app.delete("/users/:id", (req, res) => {
  const id = req.params["id"];
  const deleted = deleteUserById(id);
  if (!deleted) {
    res.status(404).send("Resource not found.");
  } else {
    res.status(204).send();
  }
});

app.listen(port, () => {
  console.log(
    `Example app listening at http://localhost:${port}`
  );
});
