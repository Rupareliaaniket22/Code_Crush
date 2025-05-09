import { useDispatch, useSelector } from "react-redux";
import { Link, Links, useNavigate } from "react-router";
import { BASE_URL, DEFAULT_PHOTO_URL } from "../utils/constants";
import axios from "axios";
import { removeUser } from "../utils/userSlice";
import { removeFeed } from "../utils/feedSlice";
import { HiChat } from "react-icons/hi";
const NavBar = () => {
  const user = useSelector((state) => state?.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  async function handleLogout() {
    try {
      await axios.post(BASE_URL + "/logout", {}, { withCredentials: true });
      dispatch(removeUser());
      dispatch(removeFeed());
      return navigate("/login");
    } catch (err) {
      console.error(err.message);
    }
  }
  return (
    <div className="navbar  bg-base-100 z-[999]  fixed text-base-content px-6 border-b border-base-100 shadow-md ">
      <div className="flex-1">
        <Link
          to={`${user && Object.keys(user).length > 0 ? "/feed" : "/login"}`}
          className="flex items-center gap-2"
        >
          <img
            src="/simpleLogo.png"
            alt="CodeCrush Logo"
            className="w-8 h-8 sm:w-10 sm:h-10"
          />
          <p className="text-lg sm:text-2xl font-bold text-primary">
            CodeCrush
          </p>
        </Link>
      </div>
      {user && Object.keys(user).length > 0 && (
        <div className="flex gap-5 items-center">
          <Link to={"/Chats/" + user._id}>
            <HiChat className="text-primary text-3xl" />
          </Link>
          <div className="flex gap-2">
            <p className=" hidden font-semibold sm:flex items-center gap-2">
              <span className="flex flex-col">
                <span className="text-base animate-pulse">Hello,</span>
                <span className="text-primary font-bold decoration-primary">
                  {user?.firstName} 👋
                </span>
              </span>
            </p>
            <div className="dropdown relative z-[999] dropdown-end">
              <label
                tabIndex={0}
                className="btn btn-ghost btn-circle avatar hover:ring hover:ring-primary transition"
              >
                <div className="w-10 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                  <img
                    alt="User Avatar"
                    src={user.photoUrl || DEFAULT_PHOTO_URL}
                  />
                </div>
              </label>
              <ul
                tabIndex={0}
                className="menu menu-sm dropdown-content mt-3  relative z-[999] p-2 shadow-xl bg-base-100 text-base-content rounded-box w-52 border border-base-200"
              >
                <li>
                  <Link to="/feed" className="hover:text-primary">
                    Feed
                  </Link>
                </li>
                <li>
                  <Link to="/profile" className="hover:text-primary">
                    Profile
                  </Link>
                </li>
                <li>
                  <Link to="/receivedRequests" className="hover:text-primary">
                    Requests
                  </Link>
                </li>
                <li>
                  <Link to="/connections" className="hover:text-primary">
                    Connections
                  </Link>
                </li>
                <li>
                  <p className="hover:text-error" onClick={handleLogout}>
                    Logout
                  </p>
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NavBar;
