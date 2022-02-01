import React, { useState, useEffect } from "react";
import { useHistory, useLocation } from "react-router-dom";

export const Reset = () => {
  const [error, setError] = useState("");
  const [newPassword, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [prompt, setPrompt] = useState("");
  const [validLength, setValidLength] = useState(null);
  const [hasNumber, setHasNumber] = useState(null);
  const [upperCase, setUpperCase] = useState(null);
  const [lowerCase, setLowerCase] = useState(null);
  const [specialChar, setSpecialChar] = useState(null);
  const [match, setMatch] = useState(null);
  const history = useHistory();

  const [focused, setPassInput] = useState(false);
  const onFocus = () => setPassInput(true);
  const onBlur = () => setPassInput(false);

  useEffect(() => {
    setValidLength(newPassword.length >= 8 ? true : false);
    setUpperCase(newPassword.toLowerCase() !== newPassword);
    setLowerCase(newPassword.toUpperCase() !== newPassword);
    setHasNumber(/\d/.test(newPassword));
    setSpecialChar(/[ `!@#$%^&*()_+\-=\]{};':"\\|,.<>?~]/.test(newPassword));
    setMatch(newPassword && newPassword === confirmPassword);
  }, [newPassword, confirmPassword]);

  function useQuery() {
    return new URLSearchParams(useLocation().search);
  }
  let query = useQuery();

  const reset = (e) => {
    e.preventDefault();
    let token = query.get("token");
    let opts = {
      new_pass: newPassword,
      token: token,
    };
    fetch("/api/confirm_reset", {
      method: "post",
      body: JSON.stringify(opts),
    }).then((response) => {
      if (response.status === 200) {
        setPrompt("The password has been reseted. Please login in.");
        history.push("/login");
      } else {
        setError("Invalid email.");
      }
    });
  };

  return (
    <div className="row">
      <div className="col-md-5 col-sm-6 m-auto">
        <form action="#" className="card-body no-border">
          <div className="card card-body rounded" style={{ backgroundColor: "#f6f8fa" }}>
            <h3 className="">
              <b>Change password</b>
            </h3>
            <form action="#" className="card-body no-border">
              <label htmlFor="login_field" className="label">
                New password
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
                  <a href="/#">Your password must include:</a>
                  <ul className="h6">
                    <li>8 characters: {validLength ? <span className="text-success">True</span> : <span className="text-danger">False</span>}</li>
                    <li>Number: {hasNumber ? <span className="text-success">True</span> : <span className="text-danger">False</span>}</li>
                    <li>UpperCase: {upperCase ? <span className="text-success">True</span> : <span className="text-danger">False</span>}</li>
                    <li>LowerCase: {lowerCase ? <span className="text-success">True</span> : <span className="text-danger">False</span>}</li>
                    <li>
                      Special Character: {specialChar ? <span className="text-success">True</span> : <span className="text-danger">False</span>}
                    </li>
                    <li>Both match: {match ? <span className="text-success">True</span> : <span className="text-danger">False</span>}</li>
                  </ul>
                </div>
              ) : (
                ""
              )}
              <button
                onClick={reset}
                className="btn btn-primary btn-block rounded pr-3"
                type="submit"
                disabled={
                  validLength === true && hasNumber === true && upperCase === true && lowerCase === true && specialChar === true && match === true
                    ? false
                    : true
                }
              >
                Update Password
              </button>
              <br />
              {prompt ? (
                <div className="alert alert-success mt-2 mb-0" role="alert">
                  {prompt}
                </div>
              ) : (
                ""
              )}
            </form>
          </div>
        </form>
      </div>
    </div>
  );
};
