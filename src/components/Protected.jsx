import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Outlet, useLocation, useNavigate } from "react-router";
import { fetchuser, logout } from "../store/userSlice";
import { handleerror, isTokenExpired } from "../../util";
import Navbar from "./Navbar";

const Protected = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const { isAuth, isLoading, user, error } = useSelector((state) => state.user);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    if (isTokenExpired(token)) {
      handleerror("Token has expired");
      dispatch(logout());
      navigate("/login");
      return;
    }

    if (!isAuth && !user) {
      dispatch(fetchuser(token));
    }
  }, [isAuth, dispatch, navigate, user, location]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return isAuth ? (
    <>
      <Navbar />
      <Outlet />
    </>
  ) : null;
};

export default Protected;
