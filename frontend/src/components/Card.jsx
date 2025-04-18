import React from "react";
import { DEFAULT_PHOTO_URL } from "../utils/constants";

const Card = ({
  firstName,
  lastName,
  age,
  gender,
  about,
  photoUrl,
  skills,
  _id,
  handleRequest,
  type,
}) => {
  return (
    <div className="card  w-full max-w-sm bg-base-100 shadow-lg border border-base-300 rounded-2xl overflow-hidden transition-transform hover:scale-105 hover:shadow-xl duration-300">
      {/* Image Section */}
      <figure className="md:h-78 h-56  w-full relative">
        <img
          src={photoUrl ? photoUrl : DEFAULT_PHOTO_URL}
          alt={`${firstName} ${lastName}`}
          className="w-full h-full object-cover"
        />
        {/* Overlay for gradient effect */}
        <div className="absolute inset-0 bg-gradient-to-t from-base-300/50 to-transparent"></div>
      </figure>

      {/* Card Body */}
      <div className="card-body p-6 space-y-3">
        {/* Name and Age */}
        <div className="flex justify-between items-center">
          <h2 className="card-title text-2xl font-bold ">
            {firstName} {lastName}
          </h2>
          <span className="text-sm text-base-content/70">Age: {age}</span>
        </div>

        {/* Skills Section */}
        {skills?.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {skills.map((skill, index) => (
              <span
                key={index}
                className="badge badge-outline text-xs py-1 px-3 border-primary text-primary hover:bg-primary hover:text-white transition-colors duration-200"
              >
                {skill}
              </span>
            ))}
          </div>
        )}

        {/* Action Buttons */}
        <div className="card-actions flex justify-center mt-4">
          <button
            className="btn btn-circle btn-outline border-primary text-primary hover:bg-primary hover:text-white transition-all duration-300"
            aria-label="Interested"
            onClick={() =>
              type !== "preview" && handleRequest("interested", _id)
            }
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
          </button>
          <button
            className="btn btn-circle btn-primary text-white hover:brightness-110 transition-all duration-300"
            aria-label="Ignore"
            onClick={() => type !== "preview" && handleRequest("ignored", _id)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Card;
