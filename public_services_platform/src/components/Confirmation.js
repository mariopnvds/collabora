import React from "react";
import { useHistory, useLocation } from "react-router-dom";

export const Confirmation = () => {
  const history = useHistory();
  function useQuery() {
    return new URLSearchParams(useLocation().search);
  }
  let query = useQuery();

  const onSubmitClick = (e) => {
    e.preventDefault();
    let token = query.get("token");
    fetch("/api/finalize", {
      method: "get",
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
    }).then((r) => {
      history.push("/login");
    });
  };

  return (
    <div className="row">
      <div className="col-md-5 col-sm-6 m-auto">
        <div className="card card-body mt-5 rounded" style={{ backgroundColor: "#f6f8fa" }}>
          <h2 className="text-center">Confirm Account</h2>
          <form action="#" className="card-body no-border">
            <button onClick={onSubmitClick} className="btn btn-primary btn-block rounded pr-3" type="submit">
              Confirm Account
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
