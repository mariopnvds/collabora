import React, { useState, useEffect } from "react";
import { authFetch } from "../auth";
import { useHistory } from "react-router-dom";

export const Campaigns = () => {
  const history = useHistory();
  const [message, setMessage] = useState("");
  const [microtasks, setMicrotasks] = useState([]);
  const [microtasksToShow, setMicrotasksToShow] = useState([]);
  const [id, setID] = useState("");

  useEffect(() => {
    let list = [];
    let opts = {
      username: localStorage.getItem("username"),
    };
    authFetch("/api/campaigns", {
      method: "post",
      body: JSON.stringify(opts),
    })
      .then((response) => {
        if (response.status === 401) {
          setMessage("Sorry you aren't authorized!");
          return null;
        }
        return response.json();
      })
      .then((response) => {
        console.log(response);
        list = JSON.parse(response.message.replace(/'/g, '"'));
        if (response && response.message) {
          setMessage(response.message);
          setMicrotasks(list);
          setMicrotasksToShow(list);
        }
      });
  }, []);

  const showAll = () => {
    setMicrotasksToShow(microtasks);
  };

  const showCompleted = () => {
    setMicrotasksToShow(
      microtasks.filter((microtask) => {
        return microtask.completed === "2";
      })
    );
  };

  const showInProgress = () => {
    setMicrotasksToShow(
      microtasks.filter((microtask) => {
        return microtask.completed === "1";
      })
    );
  };

  const showPending = () => {
    setMicrotasksToShow(
      microtasks.filter((microtask) => {
        return microtask.completed === "0";
      })
    );
  };

  const acceptMicrotask = (campaign) => {
    let opts = {
      id: campaign.id,
      username: localStorage.getItem("username"),
    };
    authFetch("/api/accept_campaign", {
      method: "post",
      body: JSON.stringify(opts),
    })
      .then((response) => response.json())
      .then((response) => {
        window.location.reload(false);
        if (response.status === 401) {
          setMessage("Sorry you aren't authorized!");
          return null;
        }
      });
  };

  return (
    <div className="container mt-3 inline-headers">
      <h3 className="mr-4">
        <strong>Campaigns</strong>
      </h3>
      <h4 className="">
        <a href="#" className="badge badge-secondary mr-2" onClick={() => showAll()}>
          All
        </a>
        <a href="#" className="badge badge-success mr-2" onClick={() => showCompleted()}>
          Completed
        </a>
        <a href="#" className="badge badge-warning mr-2" onClick={() => showInProgress()}>
          In progress
        </a>
        <a href="#" className="badge badge-info" onClick={() => showPending()}>
          Pending
        </a>
      </h4>

      <div className="row">
        {microtasksToShow.map((campaign, index) => (
          <div className="col-md-6" key={index}>
            <div className={`card rounded card-body mb-3 border-dark`}>
              <div className="text-center">
                <h5 className="card-title font-weight-bold ">
                  {campaign.title}
                  {campaign.completed === "2" ? (
                    <span className="badge badge-pill badge-success mb-1 ml-2">
                      <i className="fas fa-check"></i>
                    </span>
                  ) : campaign.completed === "1" ? (
                    <span className="badge badge-warning badge-pill mb-1 ml-2">
                      <i className="fas fa-times"></i>
                    </span>
                  ) : (
                    <span className="badge badge-info badge-pill mb-1 ml-2">
                      <i className="fas fa-times"></i>
                    </span>
                  )}
                </h5>
              </div>
              <div className="">
                <p className="card-text">ID: #{campaign.id}</p>
                <p className="card-text">Type: {campaign.type}</p>
                <p className="card-text">Description: {campaign.description}</p>
                <p className="card-text">Goal: {campaign.goal}</p>
                <p className="card-text">
                  Location: {campaign.country}, {campaign.city}, {campaign.zip}
                </p>
                {campaign.completed === "0" ? (
                  <button className="btn btn-outline-primary btn-block btn-sm rounded pr-3" onClick={() => acceptMicrotask(campaign)}>
                    Accept
                  </button>
                ) : null}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
