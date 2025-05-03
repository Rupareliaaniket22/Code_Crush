import { useDispatch, useSelector } from "react-redux";
import { BASE_URL } from "../utils/constants";
import axios from "axios";
import { useEffect } from "react";
import Card from "./Card";
import { addFeed, removeFeedUser } from "../utils/feedSlice";

const Feed = () => {
  const feed = useSelector((state) => state.feed);
  const dispatch = useDispatch();
  async function getFeed() {
    try {
      if (feed) return;
      const res = await axios.get(BASE_URL + "/feed", {
        withCredentials: true,
      });

      if (res.status === 200) dispatch(addFeed(res.data));
    } catch (err) {
      console.log(err.message);
    }
  }

  async function handleRequest(action, _id) {
    try {
      const res = axios.post(
        BASE_URL + "/request/send/" + action + "/" + _id,
        {},
        { withCredentials: true }
      );
      dispatch(removeFeedUser(_id));
    } catch (err) {
      console.log(err.message);
    }
  }

  useEffect(() => {
    getFeed();
  }, []);

  if (feed === null || !feed || feed?.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-tr from-base-200 to-base-300 px-4">
        <div className="text-6xl mb-4">🧑‍🤝‍🧑</div>
        <h2 className="text-2xl font-semibold text-base-content">
          No Users Left
        </h2>
        <p className="text-base-content/60 mt-2 text-center max-w-md">
          You've seen all the available profiles for now. Come back later or
          refresh to discover more!
        </p>
        <button
          onClick={() => window.location.reload()}
          className="btn btn-primary mt-6"
        >
          Refresh Feed
        </button>
      </div>
    );
  }
  const { firstName, lastName, age, gender, about, photoUrl, skills, _id } =
    feed[0];
  return (
    <div className="w-screen  h-screen flex items-center justify-center">
      {feed && (
        <Card
          firstName={firstName}
          lastName={lastName}
          age={age}
          gender={gender}
          about={about}
          photoUrl={photoUrl}
          skills={skills}
          _id={_id}
          handleRequest={handleRequest}
        />
      )}
    </div>
  );
};

export default Feed;
