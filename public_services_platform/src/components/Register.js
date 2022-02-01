import React, { useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";

const MAPBOX_TOKEN = "pk.eyJ1IjoiYWppbWVuZXphbGlzdGUiLCJhIjoiY2tzcWEzbjE3MGI0bjJubzV1aG1la3JzbCJ9.118uEh7Bdg3eZdPKFej5ew";

export const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const [validLength, setValidLength] = useState(null);
  const [hasNumber, setHasNumber] = useState(null);
  const [upperCase, setUpperCase] = useState(null);
  const [lowerCase, setLowerCase] = useState(null);
  const [specialChar, setSpecialChar] = useState(null);
  const [match, setMatch] = useState(null);

  const history = useHistory();

  const [lat, setLat] = useState(null);
  const [lng, setLng] = useState(null);
  const [status, setStatus] = useState(null);
  const [statusError, setStatusError] = useState(null);
  const [address, setAddress] = useState({ country: "", city: "", zip: "" });

  useEffect(() => {
    setValidLength(password.length >= 8 ? true : false);
    setUpperCase(password.toLowerCase() !== password);
    setLowerCase(password.toUpperCase() !== password);
    setHasNumber(/\d/.test(password));
    setSpecialChar(/[ `!@#$%^&*()_+\-=\]{};':"\\|,.<>?~]/.test(password));
    setMatch(password && password === confirmPassword);
  }, [password, confirmPassword]);

  const onSubmitClick = (e) => {
    e.preventDefault();
    let opts = {
      username: username,
      password: password,
      email: email,
      country: address.country,
      city: address.city,
      zip: address.zip,
    };
    fetch("/api/register", {
      method: "post",
      body: JSON.stringify(opts),
    })
      .then((r) => {
        if (r.ok) {
          history.push("/login");
        } else {
          setError("User already taken or email invalid. Try again. ");
        }
      })
      .then(setEmail(""), setPassword(""), setUsername(""), setConfirmPassword(""), setError(""));
  };

  const [focused, setPassInput] = useState(false);
  const onFocus = () => setPassInput(true);
  const onBlur = () => setPassInput(false);

  const getLocation = () => {
    if (!navigator.geolocation) {
      setStatus("Geolocation is not supported by your browser");
    } else {
      setStatus("Locating...");
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setStatus(null);
          setLat(position.coords.latitude);
          setLng(position.coords.longitude);
          fetch(
            `https://api.mapbox.com/geocoding/v5/mapbox.places/${position.coords.longitude},${position.coords.latitude}.json?access_token=${MAPBOX_TOKEN}`,
            {
              method: "GET",
            }
          )
            .then((response) => {
              return response.json();
            })
            .then((data) => {
              let zip,
                country,
                city = "";
              data.features.map((feature) => {
                switch (feature.place_type[0]) {
                  case "postcode":
                    zip = feature.text;
                    break;
                  case "country":
                    country = feature.text;
                    break;
                  case "place":
                    city = feature.text;
                    break;
                  default:
                    break;
                }
              });
              setAddress({
                country: country,
                city: city,
                zip: zip,
              });
            });
        },
        () => {
          setStatusError("Unable to retrieve your location. Safari is not compatible, try with another browser.");
        }
      );
    }
    setLat("");
    setLng("");
    setAddress("");
  };

  return (
    <div className="row">
      <div className="col-md-5 col-sm-6 m-auto">
        <div className="card card-body mt-2 rounded" style={{ backgroundColor: "#f6f8fa" }}>
          <h2 className="text-center">Register</h2>
          <form action="#" className="card-body no-border">
            <label for="login_field" className="label">
              Email
            </label>
            <div className="form-group">
              <input type="text" onChange={(e) => setEmail(e.target.value)} value={email} className="form-control rounded" autoFocus required />
            </div>
            <label for="login_field" className="label">
              Username
            </label>
            <div className="form-group">
              <input type="text" onChange={(e) => setUsername(e.target.value)} value={username} className="form-control rounded" required />
            </div>
            <label for="login_field" className="label">
              Password
            </label>
            <div className="form-group">
              <input
                type="password"
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                className="form-control rounded"
                onFocus={onFocus}
                onBlur={onBlur}
                required
              />
            </div>
            <label for="login_field" className="label">
              Confirm Password
            </label>
            <div className="form-group">
              <input
                type="password"
                onChange={(e) => setConfirmPassword(e.target.value)}
                value={confirmPassword}
                className="form-control rounded"
                onFocus={onFocus}
                onBlur={onBlur}
                required
              />
            </div>
            {focused ? (
              <div>
                <h6>Your password must include:</h6>
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
            {statusError ? (
              <div className="alert alert-danger mt-3 text-center" role="alert">
                {statusError}
              </div>
            ) : status ? (
              <div className="alert mt-3 text-center" role="alert">
                {status}
              </div>
            ) : (
              ""
            )}
            {lat && lng ? (
              <div className=" mt-3" role="alert">
                {/* <h5>
                  Latitude: {lat} - Longitude: {lng}
                </h5> */}
                <label for="login_field" className="text-start label">
                  Location
                </label>
                <h5 className="text-center mb-3">
                  {address.country}, {address.city}, {address.zip}
                </h5>
              </div>
            ) : (
              <a className="btn btn-primary btn-block rounded" onClick={getLocation} href="/#">
                Get Location
              </a>
            )}
            {error ? (
              <div className="alert alert-danger" role="alert">
                {error}
              </div>
            ) : (
              ""
            )}
            <button
              onClick={onSubmitClick}
              className="btn btn-primary btn-block rounded"
              type="submit"
              disabled={
                validLength === true && hasNumber === true && upperCase === true && lowerCase === true && specialChar === true && match === true
                  ? false
                  : true
              }
            >
              Register
            </button>
          </form>
        </div>
        <div className="card mt-2 rounded" style={{ backgroundColor: "#f6f8fa" }}>
          <h6 className="m-3 text-center">
            <label>Have an account?</label> <Link to="/login">Login</Link>
          </h6>
        </div>
      </div>
    </div>
  );
};
