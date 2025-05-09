import React from "react";
import { DEFAULT_PHOTO_URL } from "../utils/constants";
import { FiCalendar, FiInfo, FiUsers } from "react-icons/fi";
import {
  FaMale,
  FaFemale,
  FaGenderless,
  FaHeart,
  FaTimes,
} from "react-icons/fa";

const Card = ({
  firstName,
  lastName,
  Age,
  gender,
  about,
  photoUrl,
  skills,
  _id,
  handleRequest,
  type,
}) => {
  // Determine gender icon
  const genderIcon = () => {
    switch (gender?.toLowerCase()) {
      case "male":
        return <FaMale className="h-5 w-5 text-primary" />;
      case "female":
        return <FaFemale className="h-5 w-5 text-primary" />;
      default:
        return <FaGenderless className="h-5 w-5 text-primary" />;
    }
  };

  return (
    <div className="card h-fit  sm:pt-0 w-full max-w-sm bg-base-100 shadow-lg border border-base-300 rounded-2xl overflow-hidden transition-transform hover:scale-105 hover:shadow-xl duration-300">
      {/* Image Section */}
      <figure className="sm:h-78 h-74 w-full relative">
        <img
          src={photoUrl || DEFAULT_PHOTO_URL}
          alt={`${firstName} ${lastName}`}
          className="w-full h-full object-cover"
        />
        {/* Overlay for gradient effect */}
        <div className="absolute inset-0 bg-gradient-to-t from-base-300/50 to-transparent" />
      </figure>

      {/* Card Body */}
      <div className="card-body p-6 space-y-3">
        {/* Name and Age */}
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            {genderIcon()}
            <h2 className="card-title text-2xl font-bold">
              {firstName} {lastName}
            </h2>
          </div>
          <div className="flex items-center gap-1 text-base-content/70">
            <FiCalendar className="h-5 w-5" />
            <span>{Age}</span>
          </div>
        </div>

        {/* About Section */}
        {about && (
          <div className="flex items-start gap-2 text-sm text-base-content">
            <FiInfo className="h-5 w-5 mt-1" />
            <p>{about}</p>
          </div>
        )}

        {/* Skills Section */}
        {skills?.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {skills.map((skill, index) => (
              <span
                key={index}
                className="badge badge-outline text-xs py-1 px-3 border-primary text-primary hover:bg-primary hover:text-white transition-colors duration-200 flex items-center gap-1"
              >
                <FiUsers className="h-4 w-4" /> {skill}
              </span>
            ))}
          </div>
        )}

        {/* Action Buttons */}
        <div className="card-actions flex justify-center mt-4">
          <button
            className="btn btn-circle btn-outline border-primary text-primary hover:bg-primary hover:text-white transition-all duration-300"
            aria-label="Ignore"
            onClick={() => type !== "preview" && handleRequest("ignored", _id)}
          >
            <FaTimes className="h-5 w-5" />
          </button>
          <button
            className="btn btn-circle btn-primary text-white hover:brightness-110 transition-all duration-300"
            aria-label="Interested"
            onClick={() =>
              type !== "preview" && handleRequest("interested", _id)
            }
          >
            <FaHeart className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Card;
