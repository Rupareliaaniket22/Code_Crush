import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Provider } from "react-redux";
import appStore from "../utils/appStore";
import Body from "./Body";
import { Suspense, lazy } from "react";

const FormLoginSignUp = lazy(() => import("./FormLoginSignUp"));
const Feed = lazy(() => import("./Feed"));
const Profile = lazy(() => import("./Profile"));
const Connections = lazy(() => import("./Connections"));
const ReceivedRequests = lazy(() => import("./ReceivedRequests"));
const ChatPage = lazy(() => import("./ChatPage"));

function App() {
  return (
    <Provider store={appStore}>
      <BrowserRouter>
        <Suspense
          fallback={
            <div className="min-h-screen flex items-center justify-center bg-base-100 text-primary text-xl animate-pulse">
              Loading...
            </div>
          }
        >
          <Routes>
            <Route path="/" element={<Body />}>
              <Route index element={<Navigate to="/login" />} />
              <Route path="/login" element={<FormLoginSignUp />} />
              <Route path="/feed" element={<Feed />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/connections" element={<Connections />} />
              <Route path="/receivedRequests" element={<ReceivedRequests />} />
              <Route path="/Chats/:toUserId" element={<ChatPage />} />
            </Route>
          </Routes>
        </Suspense>
      </BrowserRouter>
    </Provider>
  );
}

export default App;
