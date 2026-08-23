import { useDispatch, useSelector } from "react-redux";
import Container from "./Container";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { CgLogOut, CgProfile } from "react-icons/cg";
import { GrConnect } from "react-icons/gr";
import { FaBell } from "react-icons/fa";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { removeUser } from "../utils/userSlice";
import { HiViewGrid } from "react-icons/hi";
import { MdOutlineWorkspacePremium } from "react-icons/md";

const navItems = [
  { item: "Home", href: "/home" },
  { item: "About", href: "/about" },
  { item: "Pricing", href: "/pricing" },
];
const Header = () => {
  const { user, isUserLoggedIn } = useSelector((store) => store.user);
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await axios.post(BASE_URL + "auth/logout", {}, { withCredentials: true });
      dispatch(removeUser());
      return navigate("/");
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <header
      className="
        sticky top-4 z-40 mx-4 rounded-2xl
        bg-slate-900/70 backdrop-blur-md
        border border-white/10
        shadow-lg shadow-black/30
        transition-all duration-300
      "
    >
      <Container>
        <div className="flex items-center justify-between py-3">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <img src="/devtinder.png" alt="logo" className="h-9 w-9" />
            <Link
              to="/"
              className="text-xl font-semibold bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent tracking-tight"
            >
              DevTinder
            </Link>
          </div>
          {!isUserLoggedIn && (
            <nav className="hidden md:flex gap-7">
              {navItems.map((it) => (
                <Link
                  key={it.item}
                  to={it.href}
                  className="text-slate-200 hover:text-indigo-400 transition font-medium"
                >
                  {it.item}
                </Link>
              ))}
            </nav>
          )}

          {/* Right Section */}
          <div className="flex items-center gap-4">
            {!isUserLoggedIn ? (
              <Link
                to="/auth"
                className="px-4 py-2 text-sm rounded-lg bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-medium shadow-md transition"
              >
                Sign Up
              </Link>
            ) : (
              <div className="flex items-center gap-5 relative">
                <div
                  className="relative"
                  tabIndex={0}
                  onBlur={() => setOpen(false)}
                >
                  <div
                    onClick={() => setOpen((prev) => !prev)}
                    className="
          flex items-center gap-3
          px-4 py-2
          rounded-xl
          bg-slate-800/70
          border border-white/10
          hover:border-white/20
          transition cursor-pointer
        "
                  >
                    <div className="hidden sm:flex flex-col leading-tight">
                      <span className="text-xs text-slate-400">Welcome</span>
                      <span className="text-sm font-semibold text-white">
                        {user?.firstName}
                      </span>
                    </div>

                    <img
                      src={user?.photoUrl || "/profile.png"}
                      alt="profile"
                      className="
            h-9 w-9
            rounded-full object-cover
            ring-2 ring-indigo-500/40
          "
                    />
                  </div>

                  {open && (
                    <div
                      className="
            absolute right-0 mt-3 w-44
            rounded-xl overflow-hidden
            bg-slate-900/95
            backdrop-blur-md
            border border-white/10
            shadow-xl shadow-black/40
          "
                    >
                      <ul className="py-2 text-sm text-slate-200">
                        <li
                          className="flex items-center gap-3 px-4 py-2 hover:bg-slate-800 cursor-pointer"
                          onClick={() => {
                            setOpen(false);
                            navigate("/profile");
                          }}
                        >
                          <CgProfile size={18} />
                          <span>Profile</span>
                        </li>

                        <li
                          className="flex items-center gap-3 px-4 py-2 hover:bg-slate-800 cursor-pointer"
                          onClick={() => {
                            setOpen(false);
                            navigate("/connection");
                          }}
                        >
                          <GrConnect size={18} />
                          <span>Connections</span>
                        </li>

                        <li
                          className="flex items-center gap-3 px-4 py-2 hover:bg-slate-800 cursor-pointer"
                          onClick={() => {
                            setOpen(false);
                            navigate("/request");
                          }}
                        >
                          <FaBell size={18} />
                          <span>Requests</span>
                        </li>
                        <li
                          className="flex items-center gap-3 px-4 py-2 hover:bg-slate-800 cursor-pointer"
                          onClick={() => {
                            setOpen(false);
                            navigate("/feed");
                          }}
                        >
                          <HiViewGrid size={18} />
                          <span>Feed</span>
                        </li>
                        <li
                          className="flex items-center gap-3 px-4 py-2 hover:bg-slate-800 cursor-pointer"
                          onClick={() => {
                            setOpen(false);
                            navigate("/pricing");
                          }}
                        >
                          <MdOutlineWorkspacePremium size={18} />
                          <span>Premium</span>
                        </li>
                        <li
                          className="flex items-center gap-3 px-4 py-2 hover:bg-red-500/10 text-red-400 cursor-pointer"
                          onClick={handleLogout}
                        >
                          <CgLogOut size={18} />
                          <span>Logout</span>
                        </li>
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </Container>
    </header>
  );
};

export default Header;
