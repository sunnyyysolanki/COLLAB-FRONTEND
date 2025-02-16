import React from "react";
import { logout } from "../store/userSlice";
import { useLocation, useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { useQueryClient } from "@tanstack/react-query";

const Navbar = () => {
  const { data, isLoading } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const location = useLocation();

  const project = location.state;

  const handleLogout = () => {
    dispatch(logout());
    queryClient.clear();
    navigate("/login");
  };
  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="bg-gray-900 p-4  flex justify-between items-center">
      <p className="text-3xl text-white m-0 p-0 font-bold">
        COLLABORATIVE CODING 🚀
      </p>
      {project?.name && (
        <p className="text-5xl font-bold p-0 m-0 text-purple-500">
          {project?.name}
        </p>
      )}
      <button
        onClick={handleLogout}
        className="bg-red-500 items-end text-white py-2 px-4 rounded-lg hover:bg-red-700"
      >
        Logout
      </button>
    </div>
  );
};

export default Navbar;
