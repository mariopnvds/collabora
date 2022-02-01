import React, { useState, useEffect, useRef, useCallback } from "react";
import { useHistory } from "react-router-dom";
import "mapbox-gl/dist/mapbox-gl.css";
import { authFetch } from "../auth";
import Geocoder from "react-map-gl-geocoder";
import ReactMapGL from "react-map-gl";
import "react-map-gl-geocoder/dist/mapbox-gl-geocoder.css";
import BootstrapTable from "react-bootstrap-table-next";
import filterFactory, { textFilter } from "react-bootstrap-table2-filter";
import paginationFactory from "react-bootstrap-table2-paginator";

const MAPBOX_TOKEN = "pk.eyJ1IjoiYWppbWVuZXphbGlzdGUiLCJhIjoiY2tzcWEzbjE3MGI0bjJubzV1aG1la3JzbCJ9.118uEh7Bdg3eZdPKFej5ew";

export const Create_Tasks = () => {
  /* States declared for the view */
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [users, setUsers] = useState([]);
  const [address, setAddress] = useState({ country: "", city: "", zip: "" });
  const history = useHistory();
  const [usersTask, setUsersTask] = useState([]);

  const [microtaskSettings, setMicrotaskSettings] = useState({
    title: "",
    type: "",
    goal: 0,
    users: [],
    description: "",
  });

  const [viewport, setViewport] = useState({
    longitude: -87.6189,
    latitude: 41.8758,
    zoom: 12.9,
  });

  const [mapSettings, setMapSettings] = useState({
    scrollZoom: true,
    touchZoom: false,
    doubleClickZoom: false,
  });

  const [geojson, setGeoJson] = useState({
    type: "FeatureCollection",
    features: [{ type: "Feature", geometry: { type: "Point", coordinates: [viewport.longitude, viewport.latitude] } }],
  });

  const columns = [
    { dataField: "user_id", text: "ID", sort: false, filter: textFilter() },
    { dataField: "email", text: "Email", sort: true, filter: textFilter() },
    { dataField: "country", text: "Country", sort: true, filter: textFilter({ defaultValue: address.country }) },
    { dataField: "city", text: "City", sort: true, filter: textFilter({ defaultValue: address.city }) },
    { dataField: "zip", text: "Zip", sort: true, filter: textFilter() },
  ];

  const defaultSorted = [
    {
      dataField: "username",
      order: "desc",
    },
  ];

  const selectRow = {
    mode: "checkbox",
    clickToSelect: true,
    onSelect: (row, isSelect, rowIndex, e) => {
      var array = usersTask;
      console.log(row);
      if (array.includes(row.email)) {
        array.splice(array.indexOf(row.email), 1);
      } else {
        array.push(row.email);
      }
      setUsersTask(array);
    },
    onSelectAll: (isSelect, rows, e) => {
      var array = usersTask;
      if (array.length === 0) {
        rows.map((user) => array.push(user.email));
      } else {
        array = [];
      }
      setUsersTask(array);
    },
  };

  /* References declared for the view */
  const mapRef = useRef();
  const geocoderContainer = useRef();

  /* Callbacks declared for the view */
  const handleViewportChange = useCallback((newViewport) => {
    setViewport(newViewport);
    setGeoJson({
      type: "FeatureCollection",
      features: [{ type: "Feature", geometry: { type: "Point", coordinates: [newViewport.longitude, newViewport.latitude] } }],
    });
  }, []);

  const handleGeocoderViewportChange = useCallback(
    (newViewport) => {
      const geocoderDefaultOverrides = { transitionDuration: 2000 };
      setGeoJson({
        type: "FeatureCollection",
        features: [{ type: "Feature", geometry: { type: "Point", coordinates: [newViewport.longitude, newViewport.latitude] } }],
      });
      fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${newViewport.longitude},${newViewport.latitude}.json?access_token=${MAPBOX_TOKEN}`, {
        method: "GET",
      })
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
      return handleViewportChange({
        ...newViewport,
        ...geocoderDefaultOverrides,
      });
    },
    [address]
  );

  /* Functions declared */
  const _onClickMap = (e) => {
    setViewport({
      ...viewport,
      longitude: e.lngLat[0],
      latitude: e.lngLat[1],
    });
    setGeoJson({
      type: "FeatureCollection",
      features: [{ type: "Feature", geometry: { type: "Point", coordinates: [e.lngLat[0], e.lngLat[1]] } }],
    });
  };

  const onSubmitClick = (e) => {
    e.preventDefault();
    usersTask.map((user, index) =>
      authFetch("/api/create_task", {
        method: "post",
        body: JSON.stringify({
          title: microtaskSettings.title,
          type: microtaskSettings.type,
          goal: microtaskSettings.goal,
          email: user,
          description: microtaskSettings.description,
          latitude: viewport.latitude,
          longitude: viewport.longitude,
          country: address.country,
          city: address.city,
          zip: address.zip,
          user_id: user,
        }),
      })
        .then((r) => {
          if (r.ok) {
            history.push("/create_tasks");
          } else {
            setError("Error while creating the task. Try again. ");
          }
        })
        .then(
          setMicrotaskSettings({
            title: "",
            type: "default",
            goal: 0,
            users: [],
            description: "",
          })
        )
    );
  };

  useEffect(() => {
    authFetch("/api/users")
      .then((response) => {
        if (response.status === 401) {
          setMessage("Sorry you aren't authorized!");
          return null;
        }
        return response.json();
      })
      .then((response) => {
        if (response.status_code === 403) {
          setError(response.message);
          return null;
        } else {
          if (response && response.message) {
            setMessage(response.message);
            setUsers(JSON.parse(response.message.replace(/'/g, '"')));
          }
        }
      });
  }, []);

  return (
    <div className="container mt-4">
      <form>
        <div className="col-md-10 col-sm-10 m-auto">
          <div className="form-group">
            <label htmlFor="title">Title</label>
            <input
              type="text"
              className="form-control"
              id="title"
              value={microtaskSettings.title}
              onChange={(e) => setMicrotaskSettings({ ...microtaskSettings, title: e.target.value })}
              placeholder="Introduce the title of the task..."
            />
          </div>
          <div className="row">
            <div className="col-md-6">
              <div className="form-group">
                <label htmlFor="type">Type</label>
                <select
                  className="form-control"
                  id="type"
                  value={microtaskSettings.type}
                  onChange={(e) => setMicrotaskSettings({ ...microtaskSettings, type: e.target.value })}
                  placeholder="Introduce the title of the task..."
                >
                  <option disabled value="">
                    Select type...
                  </option>
                  <option value="air_pollution">Air Pollution</option>
                  <option value="ph">Floor pH</option>
                </select>
              </div>
            </div>
            <div className="col-md-6">
              <div className="form-group">
                <label htmlFor="goal">Goal</label>
                <input
                  type="number"
                  className="form-control"
                  id="goal"
                  value={microtaskSettings.goal}
                  onChange={(e) => setMicrotaskSettings({ ...microtaskSettings, goal: e.target.value })}
                  placeholder="Introduce the number of measurements required"
                />
              </div>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              className="form-control"
              id="description"
              rows="3"
              value={microtaskSettings.description}
              onChange={(e) => setMicrotaskSettings({ ...microtaskSettings, description: e.target.value })}
            ></textarea>
          </div>

          <div className="mb-5">
            <label htmlFor="location">Location</label>
            <div ref={geocoderContainer} id="location" className="mb-2" />
            <ReactMapGL
              id="map"
              ref={mapRef}
              {...viewport}
              {...mapSettings}
              width="100%"
              height="450px"
              onViewportChange={handleViewportChange}
              mapboxApiAccessToken={MAPBOX_TOKEN}
              mapStyle="mapbox://styles/mapbox/streets-v11"
              onClick={_onClickMap}
            >
              <Geocoder
                clearOnBlur={true}
                mapRef={mapRef}
                containerRef={geocoderContainer}
                onViewportChange={handleGeocoderViewportChange}
                mapboxApiAccessToken={MAPBOX_TOKEN}
                position="top-right"
                zoom={12.9}
                reverseGeocoder="true"
              />
            </ReactMapGL>

            <br />

            <BootstrapTable
              keyField="email"
              data={users}
              columns={columns}
              defaultSorted={defaultSorted}
              pagination={paginationFactory()}
              filter={filterFactory()}
              selectRow={selectRow}
              bordered={true}
              striped
              hover
              condensed
            />

            <br></br>
            <button onClick={onSubmitClick} className="btn btn-primary btn-block rounded" type="submit">
              Create Task
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
