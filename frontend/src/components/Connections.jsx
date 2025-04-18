import { useEffect, useState } from "react";
import axios from "axios";
import { BASE_URL, DEFAULT_PHOTO_URL } from "../utils/constants";
import { useDispatch, useSelector } from "react-redux";

const Connections = () => {
  const [connections, setConnections] = useState([]);
  const [loading, setLoading] = useState(true);

  async function fetchConnections() {
    try {
      const res = await axios.get(BASE_URL + "/user/connections", {
        withCredentials: true,
      });
      setConnections(res.data || []);
    } catch (err) {
      console.error("Failed to fetch connections:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchConnections();
  }, []);

  if (loading)
    return <div className="text-center text-xl pt-10">Loading...</div>;

  return (
    <div className="min-h-screen bg-gradient-to-tr from-base-200 to-base-300 py-10 px-2 sm:px-4">
      <h1 className="text-2xl sm:text-4xl font-bold text-primary text-center mb-10">
        Your Connections 💖
      </h1>

      {connections.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-6xl mb-4">😔</div>
          <p className="text-center text-base-content text-lg">
            You have no connections yet
          </p>
          <p className="text-base-content/60 mt-2">
            Keep swiping to find your perfect match!
          </p>
        </div>
      ) : (
        <div className="max-w-6xl mx-auto">
          {/* Connection count */}
          <div className="text-right mb-4">
            <span className="inline-block bg-primary/10 text-primary px-4 py-1 rounded-full text-sm font-medium">
              {connections.length}{" "}
              {connections.length === 1 ? "Connection" : "Connections"}
            </span>
          </div>

          {/* Horizontal connection list */}
          <div className="hidden sm:block overflow-x-auto pb-4">
            <table className="w-full border-collapse">
              <thead>
                <tr className="text-base-content/70 text-left">
                  <th className="px-4 py-3 font-medium">Photo</th>
                  <th className="px-4 py-3 font-medium">Name</th>
                  <th className="px-4 py-3 font-medium">About</th>
                  <th className="px-4 py-3 font-medium">Interests</th>
                </tr>
              </thead>
              <tbody>
                {connections.map((conn) => (
                  <tr
                    key={conn._id}
                    className="bg-base-100 hover:bg-base-200 border-b border-base-300 transition-colors duration-150"
                  >
                    <td className="px-4 py-3">
                      <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-primary">
                        <img
                          src={conn.photoUrl || DEFAULT_PHOTO_URL}
                          alt={`${conn.firstName} ${conn.lastName}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-semibold text-base-content">
                        {conn.firstName} {conn.lastName}
                      </div>
                    </td>
                    <td className="px-4 py-3 max-w-xs">
                      <div className="text-base-content/70 text-sm line-clamp-2">
                        {conn.about || "No bio added yet."}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1 max-w-xs">
                        {conn.skills?.length ? (
                          conn.skills.slice(0, 3).map((skill, idx) => (
                            <span
                              key={idx}
                              className="badge badge-sm badge-outline border-primary text-primary text-xs px-2"
                            >
                              {skill}
                            </span>
                          ))
                        ) : (
                          <span className="text-xs text-base-content/50 italic">
                            None listed
                          </span>
                        )}
                        {conn.skills?.length > 3 && (
                          <span className="text-xs text-primary">
                            +{conn.skills.length - 3} more
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Alternative card view for mobile */}
          <div className="sm:hidden mt-6 space-y-4">
            {connections.map((conn) => (
              <div
                key={conn._id}
                className="bg-base-100 rounded-lg p-4 shadow-sm border border-base-300 flex gap-4 items-center"
              >
                <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-primary flex-shrink-0">
                  <img
                    src={conn.photoUrl || DEFAULT_PHOTO_URL}
                    alt={`${conn.firstName} ${conn.lastName}`}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-base-content">
                    {conn.firstName} {conn.lastName}
                  </div>
                  <div className="text-base-content/70 text-sm line-clamp-1 mt-1">
                    {conn.about || "No bio added yet."}
                  </div>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {conn.skills?.slice(0, 2).map((skill, idx) => (
                      <span
                        key={idx}
                        className="badge badge-sm badge-outline border-primary text-primary text-xs px-2"
                      >
                        {skill}
                      </span>
                    ))}
                    {conn.skills?.length > 2 && (
                      <span className="text-xs text-primary">
                        +{conn.skills.length - 2} more
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Connections;
