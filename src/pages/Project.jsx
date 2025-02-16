import { use, useEffect, useState } from "react";
import Chat from "../components/Chat";
import Ai_File_Container from "../components/Ai_File_Container";
import WorkSpace from "../components/WorkSpace";
import { Navigate, useLocation, useNavigate, useParams } from "react-router";

import { QueryClient, useQuery, useQueryClient } from "@tanstack/react-query";
import { initializeSocket } from "../../socket";
import PageNotFound from "../components/PageNotFound";
import axios from "axios";

const Project = () => {
  const project_id = useParams().id;

  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);

  useEffect(() => {
    queryClient.invalidateQueries({ queryKey: ["projects"] });

    async function fetchusers() {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/user`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        if (!res.data.success) throw new Error("Failed to fetch users");
        setUsers(res.data.users);
      } catch (err) {
        console.log(err);
      }
    }
    fetchusers();
  }, [queryClient, project_id]);

  const {
    data: project,
    error,
    isLoading: projectLoading,
  } = useQuery({
    queryKey: ["project"],
    queryFn: async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/project/${project_id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        return res.data.project;
      } catch (err) {
        console.log(err);
      }
    },

    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });

  if (projectLoading) {
    return <div>Loading</div>;
  }
  if (error) {
    navigate("/404");
    return;
  }

  return (
    <>
      <Chat project={project} users={users}></Chat>
    </>
  );
};

export default Project;
