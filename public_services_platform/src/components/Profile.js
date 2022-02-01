import React, { useState, useEffect } from "react";
import { authFetch, logout } from "../auth";
import { useHistory } from "react-router-dom";

export const Profile = () => {
  const [error, setError] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordToDelete, setPasswordToDelete] = useState("");
  const [username, setUsername] = useState("");
  const [message, setMessage] = useState("");
  const [prompt, setPrompt] = useState("");
  const history = useHistory();

  const [validLength, setValidLength] = useState(null);
  const [hasNumber, setHasNumber] = useState(null);
  const [upperCase, setUpperCase] = useState(null);
  const [lowerCase, setLowerCase] = useState(null);
  const [specialChar, setSpecialChar] = useState(null);
  const [match, setMatch] = useState(null);

  useEffect(() => {
    authFetch("/api/profile")
      .then((response) => {
        if (response.status === 401) {
          setMessage("Sorry you aren't authorized!");
          return null;
        }
        return response.json();
      })
      .then((response) => {
        if (response) {
          setMessage(response);
        }
      });
  }, []);

  useEffect(() => {
    setValidLength(newPassword.length >= 8 ? true : false);
    setUpperCase(newPassword.toLowerCase() !== newPassword);
    setLowerCase(newPassword.toUpperCase() !== newPassword);
    setHasNumber(/\d/.test(newPassword));
    setSpecialChar(/[ `!@#$%^&*()_+\-=\]{};':"\\|,.<>?~]/.test(newPassword));
    setMatch(newPassword && newPassword === confirmPassword);
  }, [newPassword, confirmPassword]);

  const fetchRequest = (e) => {
    e.preventDefault();
    let opts = {
      username: username,
      password: passwordToDelete,
    };
    fetch("/api/remove", {
      method: "post",
      body: JSON.stringify(opts),
    })
      .then((response) => {
        if (response.status === 200) {
          logout();
          history.push("/");
        } else {
          setError("Invalid username or password does not match.");
        }
      })
      .then(setPasswordToDelete(""), setUsername(""), setError(""));
  };

  const resetEmail = (e) => {
    let opts = {
      email: e,
    };
    fetch("/api/reset_email", {
      method: "post",
      body: JSON.stringify(opts),
    })
      .then((response) => {
        if (response.status === 200) {
          setPrompt("An email has been sent to " + opts.email + ". Please check your inbox.");
        } else {
          setError("Invalid email.");
        }
      })
      .then(setPrompt(""));
  };

  const [focused, setPassInput] = useState(false);
  const onFocus = () => setPassInput(true);
  const onBlur = () => setPassInput(false);

  const confirmReset = (e) => {
    e.preventDefault();

    let opts = {
      new_pass: newPassword,
      old_pass: oldPassword,
      email: message.email,
      username: message.username,
      token: "",
    };
    fetch("/api/confirm_reset", {
      method: "post",
      body: JSON.stringify(opts),
    }).then((response) => {
      if (response.status === 200) {
        setPrompt("The password has been reseted.");
        setPassword("");
        setOldPassword("");
        setConfirmPassword("");
      } else {
        setError("Invalid email.");
      }
    });
  };

  return (
    <div className="">
      <div className="col-md-8 col-sm-8 m-auto">
        <div className="card card-body mt-3 rounded mb-3">
          <h4>
            Username: <b>{message.username}</b>
          </h4>
          <h4>
            Email: <b>{message.email}</b>
          </h4>
        </div>
        <div className="card card-body rounded" style={{ backgroundColor: "#f6f8fa" }}>
          <h3 className="">
            <b>Change password</b>
          </h3>
          <form action="#" className="card-body no-border">
            <label htmlFor="login_field" className="label">
              Old password
            </label>
            <div className="form-group">
              <input
                type="password"
                onChange={(e) => setOldPassword(e.target.value)}
                value={oldPassword}
                className="form-control rounded"
                required
                autoFocus
              />
            </div>
            <label htmlFor="login_field" className="label">
              Password
            </label>
            <div className="form-group">
              <input
                type="password"
                onChange={(e) => setPassword(e.target.value)}
                value={newPassword}
                className="form-control rounded"
                required
                onFocus={onFocus}
                onBlur={onBlur}
              />
            </div>
            <label htmlFor="login_field" className="label">
              Confirm password
            </label>
            <div className="form-group">
              <input
                type="password"
                onChange={(e) => setConfirmPassword(e.target.value)}
                value={confirmPassword}
                className="form-control rounded"
                required
                onFocus={onFocus}
                onBlur={onBlur}
              />
            </div>
            {focused ? (
              <div>
                <h6 href="/#">Your password must include:</h6>
                <ul className="h6">
                  <li>8 characters: {validLength ? <span className="text-success">True</span> : <span className="text-danger">False</span>}</li>
                  <li>Number: {hasNumber ? <span className="text-success">True</span> : <span className="text-danger">False</span>}</li>
                  <li>UpperCase: {upperCase ? <span className="text-success">True</span> : <span className="text-danger">False</span>}</li>
                  <li>LowerCase: {lowerCase ? <span className="text-success">True</span> : <span className="text-danger">False</span>}</li>
                  <li>Special Character: {specialChar ? <span className="text-success">True</span> : <span className="text-danger">False</span>}</li>
                  <li>Both match: {match ? <span className="text-success">True</span> : <span className="text-danger">False</span>}</li>
                </ul>
              </div>
            ) : (
              ""
            )}
            <button
              className="btn btn-primary btn-block btn-sm rounded pr-3"
              type="submit"
              onClick={confirmReset}
              disabled={
                validLength === true && hasNumber === true && upperCase === true && lowerCase === true && specialChar === true && match === true
                  ? false
                  : true
              }
            >
              Update password
            </button>
            <br />
            Forgot password?{" "}
            <a href="/#" className="" onClick={() => resetEmail(message.email)}>
              Reset your password
            </a>
            {prompt ? (
              <div className="alert alert-success mt-2 mb-0" role="alert">
                {prompt}
              </div>
            ) : (
              ""
            )}
          </form>
        </div>
        <div className="card card-body mt-3 mb-3 rounded" style={{ backgroundColor: "#f6f8fa" }}>
          <h3 className="">
            <b>Delete Account</b>
          </h3>
          <div className="card-body">
            <label>Once you delete your account, there is no going back. Please be certain.</label>
            <br />
            <label htmlFor="login_field" className="label">
              Username
            </label>
            <div className="form-group">
              <input
                type="text"
                onChange={(e) => setUsername(e.target.value)}
                value={username}
                className={`form-control rounded ${error ? "err" : ""}`}
                required
              />
            </div>
            <label htmlFor="login_field" className="label">
              Password
            </label>
            <div className="form-group">
              <input
                type="password"
                onChange={(e) => setPasswordToDelete(e.target.value)}
                value={passwordToDelete}
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
            <button className="btn btn-outline-danger btn-block btn-sm rounded pr-3" type="submit" onClick={fetchRequest}>
              Delete Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
