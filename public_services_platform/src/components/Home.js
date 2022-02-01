import React from "react";
import { Link } from "react-router-dom";
export const Home = () => {
  return (
    <div
      className="container"
      style={{
        marginTop: "10%",
      }}
    >
      <div className="row">
        <div className="col-md-6">
          <div className="card text-center rounded border-dark homecard">
            <Link to="/aqi" className="text-dark">
              <div className="card-body nohover">
                <h4 className="card-title font-weight-bold ">Air Quality Index</h4>
                <p className="card-text">This service shows up the air quality all around the world where measurements have been made.</p>
                <p className="card-text ">
                  <small className="text-muted">Last update 3 mins ago</small>
                </p>
              </div>
            </Link>
          </div>
        </div>
        <div className="col-md-6">
          <div className="card text-center rounded border-dark homecard">
            <Link to="/ph" className="text-dark">
              <div className="card-body nohover">
                <h4 className="card-title font-weight-bold">PH Meter Service</h4>
                <p className="card-text">This card has supporting text below as a natural lead-in to additional content.</p>
                <p className="card-text">
                  <small className="text-muted">Last update 3 mins ago</small>
                </p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
