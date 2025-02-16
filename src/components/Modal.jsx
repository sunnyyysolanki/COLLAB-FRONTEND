import { useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import { handleerror, handlesuccess } from "../../util";
import axios from "axios";
import { useQueryClient } from "@tanstack/react-query";

function Modals() {
  const queryClient = useQueryClient();
  const [show, setShow] = useState(false);

  const handleClose = () => {
    setProjectName("");
    setShow(false);
  };
  const handleShow = () => setShow(true);
  const [ProjectName, setProjectName] = useState("");

  async function handleCreate(e) {
    e.preventDefault();
    if (ProjectName.length === 0) {
      handleerror("Project Name Cannont be Empty");
      return;
    }
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/project`,
        {
          project_name: ProjectName,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (res.data.success) {
        handlesuccess("Project Created Successfully");
        queryClient.invalidateQueries({ queryKey: ["projects"] });
        handleClose();
      }
    } catch (err) {
      handleerror(err.response?.data?.message);
    }
  }

  return (
    <>
      <Button
        onClick={handleShow}
        className="bg-blue-600 text-white px-4 py-2 rounded-lg  shadow-gray-400 hover:shadow-xl  hover:scale-115"
      >
        Create a New Project
      </Button>

      <Modal
        show={show}
        onHide={handleClose}
        centered
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Project Name</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleCreate}>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label></Form.Label>
              <Form.Control
                value={ProjectName}
                onChange={(e) => setProjectName(e.target.value)}
                type="text"
                placeholder="Project Name"
                autoFocus
              />
            </Form.Group>

            <Modal.Footer>
              <Button variant="secondary" onClick={handleClose}>
                Cancel
              </Button>
              <Button variant="primary" type="submit">
                Create
              </Button>
            </Modal.Footer>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default Modals;
