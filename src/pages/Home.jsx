import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router";
import { logout } from "../store/userSlice";
import { Button } from "react-bootstrap";
import Modals from "../components/Modal";
import axios from "axios";
import { handleerror } from "../../util";
import {
  QueryClientProvider,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

const Home = () => {
  const queryClient = useQueryClient();

  const { isPending, error, data } = useQuery({
    queryKey: ["projects"],
    queryFn: async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/project`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        return res.data.projects;
      } catch (err) {
        console.log(err);
      }
    },
  });

  return (
    <>
      <div className="flex justify-center items-center mt-16">
        <Modals></Modals>
      </div>

      <div className="flex flex-wrap justify-center mx-24 gap-x-12 gap-y-12 mt-16 bg-gray-200 py-8">
        {data?.map((project) => (
          <Link
            to={`/project/${project._id}`}
            state={project}
            key={project._id}
            className="bg-gray-300 text-black !no-underline flex flex-col cursor-pointer hover:shadow-2xl items-center min-w-76 h-32 justify-center rounded-lg hover:scale-115"
          >
            <div className="flex flex-wrap px-4 gap-2 items-center">
              <p className="">Project:</p>
              <p className="font-bold text-xl ">
                {project.name.length > 15
                  ? `${project.name.slice(0, 19)}...`
                  : project.name}
              </p>
            </div>
            <p className="text-lg">{project.user.length}</p>
          </Link>
        ))}
      </div>
    </>
  );
};

export default Home;
