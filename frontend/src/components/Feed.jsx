import { useDispatch, useSelector } from "react-redux";
import { BASE_URL } from "../utils/constants";
import axios from "axios";
import { useEffect, useState } from "react";
import Card from "./Card";
import { addFeed, removeFeedUser } from "../utils/feedSlice";

const Feed = () => {
  const feed = useSelector((state) => state.feed);
  const [hasMore, setHasMore] = useState(true);
  const dispatch = useDispatch();
  async function getFeed() {
    try {
      const res = await axios.get(BASE_URL + "/feed", {
        withCredentials: true,
      });
      if (res.status === 200) {
        const users = res.data;
        if (users.length === 0) {
          setHasMore(false);
        } else {
          dispatch(addFeed(users));
        }
      }
    } catch (err) {
      console.log(err.message);
    }
  }

  async function handleRequest(action, _id) {
    try {
      const res = await axios.post(
        BASE_URL + "/request/send/" + action + "/" + _id,
        {},
        { withCredentials: true }
      );
      dispatch(removeFeedUser(_id));

      if (feed?.length === 1 && hasMore) {
        getFeed();
      }
    } catch (err) {
      console.log(err.message);
    }
  }

  useEffect(() => {
    // Only fetch when feed is empty
    if ((!feed || feed?.length === 0) && hasMore) {
      getFeed();
    }
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
  const { firstName, lastName, Age, gender, about, photoUrl, skills, _id } =
    feed[0];
  return (
    <div className="w-screen pt-20  sm:h-[95vh] h-screen flex items-center justify-center">
      {feed && (
        <Card
          firstName={firstName}
          lastName={lastName}
          Age={Age}
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
