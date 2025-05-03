import React, { useEffect } from "react";
import NavBar from "./NavBar";
import { Outlet, useLocation, useNavigate } from "react-router";
import { BASE_URL } from "../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { addUser } from "../utils/userSlice";
import axios from "axios";

const Body = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.user);
  const location = useLocation();

  async function fetchUser() {
    try {
      const res = await axios.get(BASE_URL + "/profile/view", {
        withCredentials: true,
      });
      if (res.data && res.status === 200) {
        dispatch(addUser(res.data));
        if (
          location.pathname === "/login" ||
          location.pathname === "/signup" ||
          location.pathname === "/"
        ) {
          navigate("/feed");
        }
      } else {
        navigate("/login");
      }
    } catch {
      navigate("/login");
    }
  }

  useEffect(() => {
    if (!user._id) {
      fetchUser();
    } else {
      navigate("/feed");
    }
  }, []);
  return (
    <>
      <NavBar />
      <Outlet />
    </>
  );
};

export default Body;
