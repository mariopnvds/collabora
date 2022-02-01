import React, { useState, useEffect } from "react";
import { authFetch } from "../auth";
import { Modal } from "react-bootstrap";
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory from "react-bootstrap-table2-paginator";
import filterFactory, { textFilter } from "react-bootstrap-table2-filter";

export const Users = () => {
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [users, setUsers] = useState([]);

  const [show, setShow] = useState(false);
  const [user, setUser] = useState("");
  const [changed, setChaged] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const columns = [
    { dataField: "username", text: "Username", sort: true, filter: textFilter() },
    { dataField: "email", text: "Email", sort: true, filter: textFilter() },
    { dataField: "role", text: "Role", sort: true, filter: textFilter() },
    { dataField: "is_active", text: "Active", sort: true, filter: textFilter() },
    { dataField: "country", text: "Country", sort: true, filter: textFilter() },
    { dataField: "city", text: "City", sort: true, filter: textFilter() },
    { dataField: "zip", text: "Zip", sort: true, filter: textFilter() },
    {
      dataField: "operations",
      text: "Operations",
      formatter: (rowContent, row) => {
        return (
          <button
            className="btn btn-danger btn-sm btn-block"
            onClick={() => {
              handleShow();
              setUser(row.username);
            }}
          >
            Delete
          </button>
        );
      },
    },
  ];

  const defaultSorted = [
    {
      dataField: "username",
      order: "desc",
    },
  ];

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
    setChaged(false);
  }, [changed]);

  const deleteRequest = (e, username) => {
    e.preventDefault();
    let opts = {
      username: username,
    };
    fetch("/api/remove_admin", {
      method: "post",
      body: JSON.stringify(opts),
    })
      .then((response) => {
        // const res = response.json();
        if (response.status !== 200) {
          setError("Invalid username or password does not match.");
        }
      })
      .then(setError(""));
  };

  return (
    <div className="">
      <div className="col-md-10 m-auto">
        {/*  <table className="table table-striped">
          <thead>
            <tr>
              <th>Username</th>
              <th>Email</th>
              <th>Role</th>
              <th>Active</th>
              <th>Country</th>
              <th>City</th>
              <th>Zip Code</th>
              <th>Operations</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
              <tr key={index}>
                <td>{user.username}</td>
                <td>{user.email}</td>
                <td>{user.role}</td>
                <td>{user.is_active.toString()}</td>
                <td>{user.country}</td>
                <td>{user.city}</td>
                <td>{user.zip}</td>
                <td>
                  <button className="btn btn-danger btn-sm btn-block" onClick={handleShow}>
                    Delete
                  </button>
                  
                </td>
              </tr>
            ))}
          </tbody>
        </table> */}
        <div className="mt-3">
          <BootstrapTable
            keyField="username"
            data={users}
            columns={columns}
            defaultSorted={defaultSorted}
            pagination={paginationFactory()}
            filter={filterFactory()}
            bordered={true}
            striped
            hover
            condensed
          />
        </div>

        <Modal show={show} onHide={handleClose}>
          <Modal.Header>
            <Modal.Title>Confirm user deletion</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>Please, be sure of what you are about to do. This is a permanent action. There is no going back.</p>
            <p>Are you sure to delete the user?</p>
          </Modal.Body>
          <Modal.Footer>
            <button className="btn btn-primary btn-sm " variant="secondary" onClick={handleClose}>
              Close
            </button>
            <button
              className="btn btn-danger btn-sm"
              onClick={(e) => {
                deleteRequest(e, user);
                handleClose();
                setChaged(true);
              }}
              type="submit"
            >
              Confirm delete
            </button>
          </Modal.Footer>
        </Modal>
      </div>
    </div>
  );
};
