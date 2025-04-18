import Body from "./Body";
import { BrowserRouter, Form, Navigate, Route, Routes } from "react-router-dom";
import FormLoginSignUp from "./FormLoginSignUp";
import { Provider } from "react-redux";
import appStore from "../utils/appStore";
import Feed from "./Feed";
import Profile from "./Profile";
import Profile1 from "./Profile";
import Connections from "./Connections";
import ReceivedRequests from "./ReceivedRequests";

function App() {
  return (
    <Provider store={appStore}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Body />}>
            <Route index element={<Navigate to="/login" />}></Route>
            <Route path="/login" element={<FormLoginSignUp />}></Route>
            <Route path="/feed" element={<Feed />}></Route>
            <Route path="/profile" element={<Profile />}></Route>
            <Route path="/connections" element={<Connections />}></Route>
            <Route
              path="/receivedRequests"
              element={<ReceivedRequests />}
            ></Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </Provider>
  );
}

export default App;
