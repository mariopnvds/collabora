import React, { useState } from "react";
import { useHistory } from "react-router-dom";

export const ResetEmail = () => {
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");
  const history = useHistory();

  const reset = (e) => {
    e.preventDefault();
    let opts = {
      email: email,
    };
    fetch("/api/reset_email", {
      method: "post",
      body: JSON.stringify(opts),
    }).then((response) => {
      if (response.status === 200) {
        history.push("/login");
      } else {
        setError("Invalid email.");
      }
    });
    setEmail("");
  };

  return (
    <div className="row">
      <div className="col-md-5 col-sm-6 m-auto">
        <form action="#" className="card-body no-border">
          <div className="card card-body rounded" style={{ backgroundColor: "#f6f8fa" }}>
            <h3 className="">
              <b>Reset password</b>
            </h3>
            <form action="#" className="card-body no-border">
              <label htmlFor="login_field" className="label">
                Email
              </label>
              <div className="form-group">
                <input type="email" onChange={(e) => setEmail(e.target.value)} value={email} className="form-control rounded" required />
              </div>
              <button onClick={reset} className="btn btn-primary btn-block rounded pr-3" type="submit">
                Send email
              </button>
              <br />
              {error ? (
                <div className="alert alert-success mt-2 mb-0" role="alert">
                  {error}
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
