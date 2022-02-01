import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth, logout, authFetch } from "../auth";

const guestLinks = (
  <ul className="navbar-nav ml-auto">
    <li className="nav-item mr-2">
      <Link to="/" className="">
        <a href="/#" className="nav-link navbar-text font-weight-bold text-dark">
          Home
        </a>
      </Link>
    </li>
    <li className="nav-item mr-2">
      <Link to="/register" className="">
        <a href="/#" className="nav-link navbar-text font-weight-bold text-dark">
          Register
        </a>
      </Link>
    </li>
    <li className="nav-item">
      <Link to="/login" className="font-weight-bold text-dark">
        <a href="/#" className="nav-link navbar-text font-weight-bold text-dark">
          Login
        </a>
      </Link>
    </li>
  </ul>
);

export default function Navbar() {
  const [logged] = useAuth();
  const [message, setMessage] = useState("");

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
          setMessage(response.role);
        }
      });
  }, [logged]);

  return (
    <nav className="navbar navbar-expand-sm navbar-light bg-light">
      <Link className="" to="/">
        {/* <img src={image} width="18" height="18" class="d-inline-block align-center mr-2 mb-1" alt=""/> */}
        <a href="/#" className="navbar-brand font-weight-bold">
          COLLABORA
        </a>
      </Link>
      <button
        className="navbar-toggler"
        type="button"
        data-toggle="collapse"
        data-target="#navbarNav"
        aria-controls="navbarNav"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span className="navbar-toggler-icon"></span>
      </button>
      <div className="collapse navbar-collapse" id="navbarNav">
        {logged ? (
          <ul className="navbar-nav ml-auto">
            <li className="nav-item mr-2">
              <Link to="/" className="">
                <a href="/#" className="nav-link navbar-text font-weight-bold text-dark">
                  Home
                </a>
              </Link>
            </li>
            <li className="nav-item mr-2">
              <Link to="/profile" className="">
                <a href="/#" className="nav-link navbar-text font-weight-bold text-dark">
                  Profile
                </a>
              </Link>
            </li>
            {message === "admin" ? (
              <li className="nav-item mr-2">
                <Link to="/create_tasks" className="">
                  <a href="/#" className="nav-link navbar-text font-weight-bold text-dark">
                    Create Microtask
                  </a>
                </Link>
              </li>
            ) : (
              ""
            )}
            {message === "admin" ? (
              <li className="nav-item mr-2">
                <Link to="/users" className="">
                  <a href="/#" className="nav-link navbar-text font-weight-bold text-dark">
                    Users
                  </a>
                </Link>
              </li>
            ) : (
              ""
            )}
            <li className="nav-item mr-2">
              <Link to="/campaigns" className="">
                <a href="/#" className="nav-link navbar-text font-weight-bold text-dark">
                  Campaigns
                </a>
              </Link>
            </li>
            <li className="nav-item mr-2">
              <button className="cursor-pointer btn btn-danger font-weight-bold logout" onClick={() => logout()}>
                <i className="fas fa-power-off"></i>
              </button>
            </li>
          </ul>
        ) : (
          guestLinks
        )}
      </div>
    </nav>
  );
}
