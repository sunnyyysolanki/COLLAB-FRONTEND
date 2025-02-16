import { useContext, useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import propTypes from "prop-types";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "../axios";
import { handleerror, handlesuccess } from "../../util";

import { useLocation } from "react-router";

function Add_Collaborators({ users, project }) {
  const [show, setShow] = useState(false);
  const [select, setSelect] = useState([]);
  const queryClient = useQueryClient();

  const handleShow = () => {
    setShow(true);
  };
  const handleClose = () => {
    setShow(false);
    setSelect([]);
  };

  // Mutation for adding collaborators
  const addCollaboratorsMutation = useMutation({
    mutationFn: async () => {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/project/collaborator`,
        {
          users: select,
          project_id: project._id,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      return res.data;
    },
    onSuccess: () => {
      handleClose();
      queryClient.invalidateQueries({ queryKey: ["project"] });
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      handlesuccess("Collaborators Added Successfully");
    },
    onError: (err) => {
      handleerror(err?.response?.data?.message || "Something went wrong");
    },
  });

  function handleSelected(id) {
    setSelect((prev) =>
      prev.includes(id) ? prev.filter((uid) => uid !== id) : [...prev, id]
    );
  }

  return (
    <>
      <button onClick={handleShow} className="h-full">
        ➕ Add Collaborator
      </button>

      <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
        dialogClassName="modal-dialog-scrollable modal-lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>Add Collaborators</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="flex flex-col min-h-[63vh] gap-3 overflow-y-scroll items-center">
            {users
              ?.filter(
                (user) =>
                  !project?.user?.some((pUser) => pUser._id === user._id)
              )
              .map((user) => (
                <div
                  key={user._id}
                  className={`h-14 flex items-center pl-6 font-bold w-full border-2 cursor-pointer 
                    ${
                      select.includes(user._id)
                        ? "bg-blue-950 text-white"
                        : "hover:bg-gray-200"
                    }`}
                  onClick={() => handleSelected(user._id)}
                >
                  <p className="p-0 m-0">{user.email}</p>
                </div>
              ))}
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button
            variant="primary"
            onClick={() => addCollaboratorsMutation.mutate()}
            disabled={addCollaboratorsMutation.isLoading}
          >
            {addCollaboratorsMutation.isLoading ? "Adding..." : "ADD"}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

Add_Collaborators.propTypes = {
  project: propTypes.array.isRequired,
  project_id: propTypes.string.isRequired,
  users: propTypes.array.isRequired,
};

export default Add_Collaborators;
