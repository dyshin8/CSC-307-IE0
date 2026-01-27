import React, { useState, useEffect } from "react";
import Table from "./Table";
import Form from "./Form";

function MyApp() {
  const [characters, setCharacters] = useState([]);

  function removeOneCharacter(index) {
    const userToDelete = characters[index];
    const id = userToDelete["id"];

    deleteUser(id)
      .then((res) => {
        if (res.status !== 204) {
          throw new Error(`Expected 204, got ${res.status}`);
        }
        setCharacters((prev) => prev.filter((_, i) => i !== index));
      })
      .catch((error) => {
        console.log(error);
      });
  }

  function updateList(person) {
    postUser(person)
      .then((res) => {
        if (res.status !== 201) {
          throw new Error(`Expected 201, got ${res.status}`);
        }
        return res.json();
      })
      .then((createdUser) => {
        setCharacters((prev) => [...prev, createdUser]);
      })
      .catch((error) => {
        console.log(error);
      });
  }


  function fetchUsers() {
    const promise = fetch("http://localhost:8000/users");
    return promise;
  }

  function postUser(person) {
    const promise = fetch("http://localhost:8000/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(person),
    });

    return promise
  }

  function deleteUser(id) {
    const promise = fetch(`http://localhost:8000/users/${id}`, {
      method: "DELETE",
    });
    return promise
  }

  useEffect(() => {
    fetchUsers()
      .then((res) => res.json())
      .then((json) => setCharacters(json["users_list"]))
      .catch((error) => {
        console.log(error);
      });
  }, []);

  return (
    <div className="container">
      <Table
        characterData={characters}
        removeCharacter={removeOneCharacter}
      />
      <Form handleSubmit={updateList} />
    </div>
  );
}

export default MyApp;