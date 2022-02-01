import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { login } from "../auth";

export const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const history = useHistory();

  const onSubmitClick = (e) => {
    e.preventDefault();
    let opts = {
      username: username,
      password: password,
    };
    if (username !== "" || password !== "") {
      fetch("/api/login", {
        method: "post",
        body: JSON.stringify(opts),
      })
        .then((r) => r.json())
        .then((token) => {
          if (token.access_token) {
            login(token);
            localStorage.setItem("username", username);
            history.push("/");
          } else {
            setError("Invalid credentials. Try again. ");
          }
        })
        .then(setPassword(""), setUsername(""), setError(""));
    } else {
      setError("Empty credentials. Try again");
    }
  };

  //   if (sessionStorage.getItem("username")) {
  //     return <Redirect to="/dashboard" />;
  //   }
  return (
    <div className="row">
      <div className="col-md-5 col-sm-6 m-auto">
        <div className="card card-body mt-5 rounded" style={{ backgroundColor: "#f6f8fa" }}>
          <h2 className="text-center">Login</h2>
          <form action="#" className="card-body no-border">
            <label htmlFor="login_field" className="label">
              Email
            </label>
            <div className="form-group">
              <input
                type="text"
                onChange={(e) => setUsername(e.target.value)}
                value={username}
                className={`form-control rounded ${error ? "err" : ""}`}
                autoFocus
                required
              />
            </div>
            <label htmlFor="login_field" className="label">
              Password
            </label>
            <div className="form-group">
              <input
                type="password"
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                className={`form-control rounded ${error ? "err" : ""}`}
                required
              />
            </div>
            {error ? (
              <div className="alert alert-danger" role="alert">
                {error}
              </div>
            ) : (
              ""
            )}
            <p></p>
            <button onClick={onSubmitClick} className="btn btn-primary btn-block rounded pr-3" type="submit">
              Login
            </button>
          </form>
        </div>
        <div className="card mt-2 rounded" style={{ backgroundColor: "#f6f8fa" }}>
          <h6 className="m-3 text-center">
            <label>Don't have an account?</label> <Link to="/register">Register</Link>
          </h6>
        </div>
        <div className="card mt-2 rounded" style={{ backgroundColor: "#f6f8fa" }}>
          <h6 className="m-3 text-center">
            <label>Forgot your password?</label> <Link to="/reset">Reset password</Link>
          </h6>
        </div>
      </div>
    </div>
  );
};
