import React, { useEffect, useState } from "react";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const onSubmitClick = (e) => {
    e.preventDefault();
    let opts = {
      username: username,
      password: password,
    };
    fetch("/api/login", {
      method: "post",
      body: JSON.stringify(opts),
    })
      .then((r) => r.json())
      .then((token) => {
        if (!token.access_token) {
          setError("Please type in correct username/password");
        }
      });
  };

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  return (
    <div>
      <h2>Login</h2>
      <form action="#">
        <div>
          <input type="text" placeholder="Username" onChange={handleUsernameChange} value={username} />
        </div>
        <div>
          <input type="password" placeholder="Password" onChange={handlePasswordChange} value={password} />
        </div>
        <button onClick={onSubmitClick} type="submit">
          Login Now
        </button>
      </form>
    </div>
  );
}
