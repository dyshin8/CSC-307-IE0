import React, { useEffect, useState } from "react";
import Table from "./Table";
import Form from "./Form";

function MyApp() {
  const [characters, setCharacters] = useState([]);

  function fetchUsers() {
    fetch("http://localhost:8000/users")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch users");
        return res.json();
      })
      .then((data) => {
        setCharacters(data.users_list || []);
      })
      .catch((err) => {
        console.error("fetchUsers error:", err);
      });
  }

  useEffect(() => {
    fetchUsers();
  }, []);

  function postUser(person) {
    return fetch("http://localhost:8000/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(person),
    });
  }

  function updateList(person) {
    postUser(person)
      .then((res) => {
        if (res.status !== 201) {
          throw new Error("Create failed");
        }
        return res.json();
      })
      .then((createdUser) => {
        setCharacters((prev) => [...prev, createdUser]);
      })
      .catch((err) => {
        console.error("updateList error:", err);
      });
  }

  function deleteUserById(id) {
    return fetch(`http://localhost:8000/users/${id}`, {
      method: "DELETE",
    });
  }

  function removeOneCharacterById(id) {
    deleteUserById(id)
      .then((res) => {
        if (res.status === 204) {
          setCharacters((prev) => prev.filter((u) => (u._id || u.id) !== id));
        } else if (res.status === 404) {
          console.warn("User not found (already deleted?)");
        } else {
          return res.text().then((t) => {
            throw new Error(`Delete failed: ${res.status} ${t}`);
          });
        }
      })
      .catch((err) => {
        console.error("removeOneCharacterById error:", err);
      });
  }

  return (
    <div className="container">
      <Table
        characterData={characters}
        removeCharacter={removeOneCharacterById}
      />
      <Form handleSubmit={updateList} />
    </div>
  );
}

export default MyApp;