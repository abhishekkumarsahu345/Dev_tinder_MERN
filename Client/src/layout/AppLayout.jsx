/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addUser } from "../utils/userSlice";
import { BASE_URL } from "../utils/constants";
import axios from "axios";
import Header from "../Components/Header";
import { Outlet, useNavigate } from "react-router-dom";

function AppLayout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.user);
  const fetchUser = async () => {
    if (user) return;
    try {
      const res = await axios.get(BASE_URL + "profile/view", {
        withCredentials: true,
      });

      dispatch(addUser(res.data));
    } catch (error) {
      // Only redirect to /auth if on a protected page
      const publicPaths = ["/", "/home", "/about", "/pricing", "/auth"];
      const isPublic = publicPaths.some((p) => window.location.pathname === p || window.location.pathname.startsWith(p));
      if (error.status === 401 && !isPublic) {
        navigate("/auth");
      }
      console.error(error.message);
    }
  };
  useEffect(() => {
    fetchUser();
  }, []);
  return (
    <div className="min-h-screen bg-slate-900 text-slate-100">
      <Header />
      <main className="flex-1 mt-8 min-h-screen">
        <Outlet />
      </main>
      <div className="p-10 mt-10 bg-gray-800 text-center">
        🧑🏻‍💻 Made by Abhishek
      </div>
    </div>
  );
}
export default AppLayout;
