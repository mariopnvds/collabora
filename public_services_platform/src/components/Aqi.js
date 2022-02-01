import React, { useState } from "react";
import ReactMapGL, { Marker, Popup } from "react-map-gl";

const MAPBOX_TOKEN = "pk.eyJ1IjoiYWppbWVuZXphbGlzdGUiLCJhIjoiY2tzcWEzbjE3MGI0bjJubzV1aG1la3JzbCJ9.118uEh7Bdg3eZdPKFej5ew";

export const Aqi = () => {
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [collapsed, setCollapsed] = useState(false);

  const [viewport, setViewport] = useState({
    longitude: -87.66901463453516,
    latitude: 41.89054891016917,
    zoom: 15,
    bearing: 0,
    pitch: 0,
    minZoom: 0.89,
  });

  const [markers, setMarkers] = useState([
    {
      name: "113",
      value: 113,
      longitude: -87.66901463453516,
      latitude: 41.89054891016917,
      date: "2021-11-11",
    },
    {
      name: "290",
      value: 290,
      longitude: -87.66901663453516,
      latitude: 41.89198891016917,
      date: "1630009722160",
    },
    {
      name: "390",
      value: 390,
      longitude: -87.669899963953516,
      latitude: 41.89198891016917,
      date: "1630009722168",
    },
    {
      name: "49",
      value: 49,
      longitude: -87.66991463453,
      latitude: 41.89054891016917,
      date: "1630009722166",
    },
  ]);

  const mrks = markers.map(
    (marker, index) => (
      <Marker longitude={marker.longitude} latitude={marker.latitude} key={index} name={marker.name} value={marker.value} date={marker.date}>
        <div
          className="marker"
          onClick={() => setSelectedIndex(index)}
          onMouseEnter={() => setSelectedIndex(index)}
          onMouseLeave={() => setSelectedIndex(null)}
        >
          <svg width="40px" height="40px" viewBox="-0.5 -0.5 129 100">
            <g>
              <rect
                x="4"
                y="4"
                width="120"
                height="60"
                rx="9"
                ry="9"
                fill={`${
                  marker.value <= 50
                    ? "rgba(0,153,102,.75)"
                    : marker.value >= 51 && marker.value <= 100
                    ? "rgba(255,222,51,.75)"
                    : marker.value >= 101 && marker.value <= 150
                    ? "rgba(255,153,51,.75)"
                    : marker.value >= 151 && marker.value <= 200
                    ? "rgba(204,0,51,.75)"
                    : marker.value >= 201 && marker.value <= 300
                    ? "rgba(126,0,153,0.75)"
                    : "rgba(126,0,35,1)"
                }`}
                stroke={`${
                  marker.value <= 50
                    ? "rgba(0,153,102,.75)"
                    : marker.value >= 51 && marker.value <= 100
                    ? "rgba(255,222,51,.75)"
                    : marker.value >= 101 && marker.value <= 150
                    ? "rgba(255,153,51,.75)"
                    : marker.value >= 151 && marker.value <= 200
                    ? "rgba(204,0,51,.75)"
                    : marker.value >= 201 && marker.value <= 300
                    ? "rgba(126,0,153,.75)"
                    : "rgba(126,0,35,.75)"
                }`}
                strokeWidth="12"
                pointerEvents="none"
              />
              <path
                d="M 63.5 94 L 63.5 64"
                fill="none"
                stroke={`${
                  marker.value <= 50
                    ? "rgba(0,153,102,.75)"
                    : marker.value >= 51 && marker.value <= 100
                    ? "rgba(255,222,51,.75)"
                    : marker.value >= 101 && marker.value <= 150
                    ? "rgba(255,153,51,.75)"
                    : marker.value >= 151 && marker.value <= 200
                    ? "rgba(204,0,51,.75)"
                    : marker.value >= 201 && marker.value <= 300
                    ? "rgba(126,0,153,.75)"
                    : "rgba(126,0,35,.75)"
                }`}
                strokeWidth="12"
                strokeMiterlimit="10"
                pointerEvents="none"
              />
              <text
                x="50%"
                y="50%"
                textAnchor="middle"
                fontSize="45"
                stroke={`${marker.value >= 201 && marker.value <= 300 ? "white" : marker.value > 300 ? "white" : "black"}`}
                strokeWidth="1"
                fill={`${marker.value >= 201 && marker.value <= 300 ? "white" : marker.value > 300 ? "white" : "black"}`}
                className="font-weight-bold"
              >
                {marker.value}
              </text>
            </g>
          </svg>
        </div>
      </Marker>
    ),
    [markers]
  );

  return (
    <div className="mr-4 ml-4 mt-4">
      <ReactMapGL
        {...viewport}
        width="100%"
        height="85vh"
        mapStyle="mapbox://styles/mapbox/streets-v11"
        onViewportChange={(viewport) => setViewport(viewport)}
        mapboxApiAccessToken={MAPBOX_TOKEN}
      >
        {mrks}
        {selectedIndex !== null ? (
          <Popup
            latitude={mrks[selectedIndex].props.latitude}
            longitude={mrks[selectedIndex].props.longitude}
            onClose={() => setSelectedIndex(null)}
            closeButton={false}
            closeOnClick={false}
            key={selectedIndex}
            offsetTop={-10}
            offsetLeft={18}
          >
            <div
              className="pr-4 pl-4 pt-1 pb-1"
              style={{
                color:
                  mrks[selectedIndex].props.value >= 201 && mrks[selectedIndex].props.value <= 300
                    ? "white"
                    : mrks[selectedIndex].props.value > 300
                    ? "white"
                    : "black",
                backgroundColor:
                  mrks[selectedIndex].props.value <= 50
                    ? "rgba(0,153,102,.75)"
                    : mrks[selectedIndex].props.value >= 51 && mrks[selectedIndex].props.value <= 100
                    ? "rgba(255,222,51,.75)"
                    : mrks[selectedIndex].props.value >= 101 && mrks[selectedIndex].props.value <= 150
                    ? "rgba(255,153,51,.75)"
                    : mrks[selectedIndex].props.value >= 151 && mrks[selectedIndex].props.value <= 200
                    ? "rgba(204,0,51,.75)"
                    : mrks[selectedIndex].props.value >= 201 && mrks[selectedIndex].props.value <= 300
                    ? "rgba(126,0,153,.75)"
                    : "rgba(126,0,35,.75)",
              }}
            >
              <h4>
                <b>
                  {mrks[selectedIndex].props.value} -{" "}
                  {mrks[selectedIndex].props.value <= 50
                    ? "Good"
                    : mrks[selectedIndex].props.value >= 51 && mrks[selectedIndex].props.value <= 100
                    ? "Moderate"
                    : mrks[selectedIndex].props.value >= 101 && mrks[selectedIndex].props.value <= 150
                    ? "Unhealthy for Sensitive Groups"
                    : mrks[selectedIndex].props.value >= 151 && mrks[selectedIndex].props.value <= 200
                    ? "Unhealthy"
                    : mrks[selectedIndex].props.value >= 201 && mrks[selectedIndex].props.value <= 300
                    ? "Very Unhealthy"
                    : "Hazardous"}
                </b>
              </h4>
            </div>
            <hr />
            <div className="text-center">
              {/* <small>Updated {Math.round((Math.abs(Date.now() - mrks[selectedIndex].props.date) % 3600000) / 60000)} minutes ago.</small> */}
              <small>Updated {mrks[selectedIndex].props.date}.</small>
            </div>
          </Popup>
        ) : (
          ""
        )}
      </ReactMapGL>
      <div className="mb-1">
        <div className="mx-auto">
          <span
            className="badge badge-pill p-2 rounded"
            style={{
              background: "rgba(0,153,102,.75)",
              color: "#000",
            }}
          >
            Good
          </span>
          <span
            className="badge badge-pill p-2 rounded"
            style={{
              background: "rgba(255,222,51,.75)",
              color: "#000",
            }}
          >
            Moderate
          </span>
          <span
            className="badge badge-pill p-2 rounded"
            style={{
              background: "rgba(255,153,51,.75)",
              color: "#000",
            }}
          >
            Unhealthy for Sensitive Groups
          </span>
          <span
            className="badge badge-pill p-2 rounded"
            style={{
              background: "rgba(204,0,51,.75)",
              color: "#000",
            }}
          >
            Unhealthy
          </span>
          <span
            className="badge badge-pill p-2 rounded"
            style={{
              background: "rgba(102,0,153,.75)",
              color: "#fff",
            }}
          >
            Very Unhealthy
          </span>
          <span
            className="badge badge-pill p-2 rounded"
            style={{
              background: "rgba(126,0,35,.75)",
              color: "#fff",
            }}
          >
            Hazardous
          </span>
          <a
            className="font-weight-bold badge badge-pill p-2 rounded border border-dark text-dark"
            data-toggle="collapse"
            href="#collapseExample"
            role="button"
            aria-expanded="false"
            aria-controls="collapseExample"
            onClick={() => setCollapsed(!collapsed)}
          >
            {collapsed ? <i className="fas fa-minus"></i> : <i className="fas fa-plus"></i>} Info
          </a>
        </div>
      </div>

      <div className="collapse" id="collapseExample">
        <div
          className="mt-3"
          style={{
            height: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div className="card-columns">
            <div
              className="card mb-3 rounded"
              style={{
                maxWidth: "540px",
                background: "rgba(0,153,102,.75)",
                color: "#fff",
              }}
            >
              <div className="row no-gutters">
                <div className="col-lg">
                  <div className="card-body text-center">
                    <h5 className="card-title font-weight-bold">0 - 50 | Good</h5>
                    <p className="card-text">Air quality is considered satisfactory, and air pollution poses little or no risk.</p>
                    <p className="card-text">There is no limitation for outdoor activities.</p>
                  </div>
                </div>
              </div>
            </div>
            <div
              className="card mb-3 rounded"
              style={{
                maxWidth: "540px",
                background: "rgba(255,222,51,.75)",
              }}
            >
              <div className="row no-gutters">
                <div className="col-lg">
                  <div className="card-body text-center">
                    <h5 className="card-title font-weight-bold">51 - 100 | Moderate</h5>
                    <p className="card-text">
                      Air quality is acceptable; however, for some pollutants there may be a moderate health concern for a very small number of people
                      who are unusually sensitive to air pollution.
                    </p>
                    <p className="card-text">
                      Active children and adults, and people with respiratory disease, such as asthma, should limit prolonged outdoor exertion.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div
              className="card mb-3 rounded"
              style={{
                maxWidth: "540px",
                background: "rgba(255,153,51,.75)",
                color: "#fff",
              }}
            >
              <div className="row no-gutters">
                <div className="col-lg">
                  <div className="card-body text-center">
                    <h5 className="card-title font-weight-bold">101 - 150 | Unhealthy for Sensitive Groups</h5>
                    <p className="card-text">
                      Members of sensitive groups may experience health effects. The general public is not likely to be affected.
                    </p>
                    <p className="card-text">
                      Active children and adults, and people with respiratory disease, such as asthma, should limit prolonged outdoor exertion.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div
              className="card mb-3 rounded"
              style={{
                maxWidth: "540px",
                background: "rgba(204,0,51,.75)",
                color: "#fff",
              }}
            >
              <div className="row no-gutters">
                <div className="col-lg">
                  <div className="card-body text-center">
                    <h5 className="card-title font-weight-bold">151 - 200 | Unhealthy</h5>
                    <p className="card-text">
                      Everyone may begin to experience health effects; members of sensitive groups may experience more serious health effects.
                    </p>
                    <p className="card-text">
                      Active children and adults, and people with respiratory disease, such as asthma, should avoid prolonged outdoor exertion;
                      everyone else, especially children, should limit prolonged outdoor exertion.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div
              className="card mb-3 rounded"
              style={{
                maxWidth: "540px",
                background: "rgba(102,0,153,.75)",
                color: "#fff",
              }}
            >
              <div className="row no-gutters">
                <div className="col-lg">
                  <div className="card-body text-center">
                    <h5 className="card-title font-weight-bold">201 - 300 | Very Unhealthy</h5>
                    <p className="card-text">Health warnings of emergency conditions. The entire population is more likely to be affected.</p>
                    <p className="card-text">
                      Active children and adults, and people with respiratory disease, such as asthma, should avoid all outdoor exertion; everyone
                      else, especially children, should limit outdoor exertion.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div
              className="card mb-3 rounded"
              style={{
                maxWidth: "540px",
                background: "rgba(126,0,35,.75)",
                color: "#fff",
              }}
            >
              <div className="row no-gutters">
                <div className="col-lg">
                  <div className="card-body text-center">
                    <h5 className="card-title font-weight-bold">300+ | Hazardous</h5>
                    <p className="card-text">Health alert: everyone may experience more serious health effects.</p>
                    <p className="card-text">Everyone should avoid all outdoor exertion.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
