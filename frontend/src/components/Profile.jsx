import { useDispatch, useSelector } from "react-redux";
import InputField from "./InputField";
import { useEffect, useState } from "react";
import Card from "./Card";
import axios from "axios";
import { BASE_URL, DEFAULT_PHOTO_URL } from "../utils/constants";
import { addUser } from "../utils/userSlice";
import Toast from "./Toast";

const Profile = () => {
  const user = useSelector((state) => state.user);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");
  const [age, setAge] = useState("");
  const [skills, setSkills] = useState([]);
  const [gender, setGender] = useState("");
  const [about, setAbout] = useState("");
  const [toastData, setToastData] = useState("");
  const [showToast, setShowToast] = useState(false);
  const dispatch = useDispatch();

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      setToastData(" ");
      const res = await axios.patch(
        BASE_URL + "/editProfile",
        { firstName, lastName, photoUrl, Age: age, skills, gender, about },
        { withCredentials: true }
      );
      dispatch(addUser(res.data));
      setShowToast(true);
      if (res.data) {
        setToastData("Profile Edited Successfully!!", "success");
      }

      setTimeout(() => {
        setShowToast(false);
      }, 3000);
    } catch (err) {
      setToastData(err.response.data, "failed");
      setShowToast(true);
      setTimeout(() => {
        setShowToast(false);
      }, 3000);
    }
  }

  useEffect(() => {
    if (user) {
      setFirstName(user.firstName || "");
      setLastName(user.lastName || "");
      setPhotoUrl(user.photoUrl || DEFAULT_PHOTO_URL);
      setAge(user.Age || "");
      setSkills(user.skills || []);
      setGender(user.gender || "");
      setAbout(user.about || "");
    }
  }, [user]);

  if (!user) return <div>Loading....</div>;

  return (
    <div className="w-full min-h-screen px-4 py-6 flex flex-col lg:flex-row gap-6 items-start justify-center">
      <div className="w-full lg:w-1/2 bg-base-200 p-5 rounded-md shadow-2xl">
        <h1 className="text-3xl lg:text-4xl font-bold text-primary mb-4">
          Edit Profile
        </h1>
        <form className="flex flex-col space-y-4" onSubmit={handleSubmit}>
          <InputField
            fieldName={"First Name"}
            onChange={setFirstName}
            value={firstName}
          />
          <InputField
            fieldName={"Last Name"}
            onChange={setLastName}
            value={lastName}
          />
          <InputField fieldName={"Age"} onChange={setAge} value={age} />
          <InputField
            fieldName={"Gender"}
            onChange={setGender}
            value={gender}
          />
          <InputField
            fieldName={"Photo URL"}
            onChange={setPhotoUrl}
            value={photoUrl}
          />
          <InputField fieldName={"About"} onChange={setAbout} value={about} />
          <InputField
            fieldName={"Skills"}
            onChange={setSkills}
            value={skills}
          />
          <button className="btn btn-primary text-white mt-4 py-3 font-bold">
            Save
          </button>
        </form>
      </div>

      <div className="w-full lg:w-fit h-fit">
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-200 text-center py-3">
          Preview
        </h1>
        <Card
          firstName={firstName}
          lastName={lastName}
          age={age}
          gender={gender}
          about={about}
          photoUrl={photoUrl}
          skills={skills}
          type="preview"
        />
      </div>

      {showToast && <Toast text={toastData} />}
    </div>
  );
};

export default Profile;
