import { useEffect, useState } from "react";
import axios from "axios";
import { BASE_URL, DEFAULT_PHOTO_URL } from "../utils/constants";

const ReceivedRequests = () => {
  const [receivedRequests, setReceivedRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  async function fetchReceivedRequests() {
    try {
      const res = await axios.get(BASE_URL + "/user/requests/received", {
        withCredentials: true,
      });
      setReceivedRequests(res.data || []);
    } catch (err) {
      console.error("Failed to fetch received requests:", err);
    } finally {
      setLoading(false);
    }
  }

  const handleRequest = async (requestId, action) => {
    try {
      setLoading(true);
      await axios.post(
        BASE_URL + `/request/review/${action}/${requestId}`,
        {},
        { withCredentials: true }
      );
      setReceivedRequests((prev) =>
        prev.filter((req) => req._id !== requestId)
      );
    } catch (err) {
      console.error(`Failed to ${action} request:`, err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!receivedRequests.length) fetchReceivedRequests();
  }, []);

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-base-100 text-primary text-xl animate-pulse">
        Loading Requests...
      </div>
    );

  return (
    <div className="h-screen sm:w-screen bg-gradient-to-tr from-base-200 to-base-300 pt-20 ">
      <h1 className="text-2xl sm:text-4xl font-bold text-primary text-center mb-6">
        Connection Requests
      </h1>
      <p className="text-center sm:text-lg text-sm text-base-content/70 mb-10 max-w-md mx-auto">
        People who want to connect with you
      </p>

      {receivedRequests.length === 0 ? (
        <div className="text-center w-4/5 sm:w-full py-16 px-5 bg-base-100 max-w-lg mx-auto rounded-xl shadow-md animate-fade-in-down">
          <div className="text-6xl mb-2">📭</div>
          <p className="text-base-content text-lg font-medium">
            No new requests
          </p>
          <p className="text-base-content/60 sm:text-md text-sm mt-2 max-w-xs mx-auto">
            When someone sends you a connection request, it will appear here.
          </p>
        </div>
      ) : (
        <div className="max-w-4xl mx-auto space-y-4">
          {receivedRequests.map((request) => (
            <div
              key={request._id}
              className="bg-base-100 rounded-lg shadow-md border border-base-300 overflow-hidden flex flex-col md:flex-row transition-transform duration-300 hover:shadow-lg hover:-translate-y-1"
            >
              {/* Left - Profile Info */}
              <div className="md:w-1/4 p-4 flex flex-col items-center justify-center bg-base-200">
                <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-primary mb-2">
                  <img
                    src={request?.fromUserId?.photoUrl || DEFAULT_PHOTO_URL}
                    alt="user"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="text-center">
                  <h3 className="text-sm font-semibold text-base-content">
                    {request.fromUserId?.firstName}{" "}
                    {request.fromUserId?.lastName}
                  </h3>
                  <p className="text-xs text-base-content/60">
                    Sent {timeAgo(request.createdAt)}
                  </p>
                </div>

                {/* Skills */}
                {request.fromUserId?.skills?.length > 0 && (
                  <div className="mt-3">
                    <div className="text-[10px] text-base-content/50 uppercase tracking-widest mb-1 text-center">
                      Interests
                    </div>
                    <div className="flex flex-wrap justify-center gap-1">
                      {request.fromUserId.skills
                        .slice(0, 3)
                        .map((skill, idx) => (
                          <span
                            key={idx}
                            className="badge badge-xs badge-outline border-primary text-primary text-[10px] px-2 py-0.5"
                          >
                            {skill}
                          </span>
                        ))}
                      {request.fromUserId.skills.length > 3 && (
                        <span className="text-[10px] text-primary mt-1">
                          +{request.fromUserId.skills.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Right - About & Actions */}
              <div className="md:w-3/4 p-4 flex flex-col justify-between">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="text-base font-medium text-base-content">
                    About {request.fromUserId?.firstName}
                  </h4>
                  <span className="bg-primary/10 text-primary text-xs px-2 py-1 rounded-full font-medium">
                    Pending
                  </span>
                </div>

                <p className="text-sm text-base-content/80 mb-3">
                  {request.fromUserId?.about || "No bio available."}
                </p>

                {request.message && (
                  <div className="bg-base-200 p-3 rounded-lg text-sm mb-3">
                    <div className="text-xs text-base-content/50 uppercase tracking-wider mb-1">
                      Their message
                    </div>
                    <p className="italic text-base-content/90">
                      "{request.message}"
                    </p>
                  </div>
                )}

                <div className="flex gap-2 justify-end">
                  <button
                    onClick={() => handleRequest(request._id, "rejected")}
                    className="btn btn-outline btn-xs hover:border-error hover:text-error"
                  >
                    Decline
                  </button>
                  <button
                    onClick={() => handleRequest(request._id, "accepted")}
                    className="btn btn-primary btn-xs hover:scale-105 transition-transform"
                  >
                    Accept
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

function timeAgo(dateString) {
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now - date) / 1000);

  let interval = Math.floor(seconds / 31536000);
  if (interval >= 1)
    return interval === 1 ? "1 year ago" : `${interval} years ago`;

  interval = Math.floor(seconds / 2592000);
  if (interval >= 1)
    return interval === 1 ? "1 month ago" : `${interval} months ago`;

  interval = Math.floor(seconds / 86400);
  if (interval >= 1)
    return interval === 1 ? "1 day ago" : `${interval} days ago`;

  interval = Math.floor(seconds / 3600);
  if (interval >= 1)
    return interval === 1 ? "1 hour ago" : `${interval} hours ago`;

  interval = Math.floor(seconds / 60);
  if (interval >= 1)
    return interval === 1 ? "1 minute ago" : `${interval} minutes ago`;

  return "just now";
}

export default ReceivedRequests;
