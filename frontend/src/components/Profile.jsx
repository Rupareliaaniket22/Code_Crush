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
  const [toastAction, setToastAction] = useState();
  const dispatch = useDispatch();

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      setToastData("");
      // Send age as lowercase 'age'
      const res = await axios.patch(
        `${BASE_URL}/editProfile`,
        { firstName, lastName, photoUrl, Age: age, skills, gender, about },
        { withCredentials: true }
      );

      // Update Redux store
      dispatch(addUser(res.data));
      setToastData("Profile Edited Successfully!!");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
      setToastAction("success");
    } catch (err) {
      setToastData(err.response?.data || "Failed to update");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
      setToastAction("failed");
    }
  }

  useEffect(() => {
    if (user) {
      setFirstName(user.firstName || "");
      setLastName(user.lastName || "");
      setPhotoUrl(user.photoUrl || DEFAULT_PHOTO_URL);
      setAge(user.Age ?? "");
      setSkills(user.skills || []);
      setGender(user.gender || "");
      setAbout(user.about || "");
    }
  }, [user]);

  if (!user) return <div>Loading....</div>;

  return (
    <div className="w-full pt-20 min-h-screen px-4 py-6 flex flex-col sm:flex-row gap-6 items-start justify-center">
      <div className="w-full lg:w-1/2 bg-base-200 p-5 rounded-md shadow-2xl">
        <h1 className="text-3xl lg:text-4xl font-bold text-primary mb-4">
          Edit Profile
        </h1>
        <form className="flex flex-col space-y-4" onSubmit={handleSubmit}>
          <InputField
            fieldName="First Name"
            value={firstName}
            onChange={setFirstName}
          />
          <InputField
            fieldName="Last Name"
            value={lastName}
            onChange={setLastName}
          />
          <InputField fieldName="Age" value={age} onChange={setAge} />
          <InputField
            fieldName="Gender"
            value={gender}
            onChange={setGender}
            options={["Male", "Female", "Other"]}
          />
          <InputField
            fieldName="Photo URL"
            value={photoUrl}
            onChange={setPhotoUrl}
          />
          <InputField fieldName="About" value={about} onChange={setAbout} />
          <InputField fieldName="Skills" value={skills} onChange={setSkills} />

          <button
            type="submit"
            className="btn btn-primary text-white mt-4 py-3 font-bold"
          >
            Save
          </button>
        </form>
      </div>

      <div className="w-full flex flex-col items-center justify-center lg:w-fit h-fit">
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-200 text-center py-3">
          Preview
        </h1>
        <Card
          firstName={firstName}
          lastName={lastName}
          Age={age}
          gender={gender}
          about={about}
          photoUrl={photoUrl}
          skills={skills}
          type="preview"
        />
      </div>

      {showToast && <Toast text={toastData} action={toastAction} />}
    </div>
  );
};

export default Profile;
