import axios from "axios";
import { useContext, useEffect, useState } from "react";
import PropTypes from "prop-types";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { useLocation } from "react-router";

function Collaborators({ users }) {
  const [show, setShow] = useState(false);

  const location = useLocation();

  const project = location.state;

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <>
      <button onClick={handleShow} className="h-full">
        👥
      </button>

      <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Modal title</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {users?.map((user) => (
            <div
              key={user._id}
              className="flex items-center space-x-2 h-16 cursor-pointer rounded-lg px-2 py-2 mb-2 bg-gray-100 hover:bg-gray-200 border border-gray-300 gap-x-3"
            >
              <img
                src="https://photosking.net/wp-content/uploads/2024/05/no-dp-pic_23.webp"
                alt={user.name}
                className="w-8 h-8 rounded-full"
              />
              <span className="font-semibold">{user.email}</span>
            </div>
          ))}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary">Add</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default Collaborators;

Collaborators.propTypes = {
  users: PropTypes.array.isRequired,
};
