import React from "react";

const InputField = ({ fieldName, value, onChange, placeholder, options }) => {
  const isTextarea = fieldName === "About";
  const isSkills = fieldName === "Skills";
  const isGender = fieldName === "Gender" && options && options.length > 0;

  return (
    <div className="form-control mb-4">
      <label className="label">
        <span className="label-text text-lg font-light">{fieldName}</span>
      </label>

      {isGender ? (
        <div className="flex gap-6">
          {options.map((opt) => (
            <label
              key={opt}
              className="label cursor-pointer flex items-center gap-2"
            >
              <input
                type="radio"
                name="gender"
                value={opt}
                checked={value === opt?.toLowerCase()}
                onChange={() => onChange(opt.toLowerCase())}
                className="radio radio-primary"
              />
              <span className="label-text capitalize">{opt}</span>
            </label>
          ))}
        </div>
      ) : isTextarea ? (
        <textarea
          className="textarea textarea-bordered w-full"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={4}
        />
      ) : isSkills ? (
        <input
          type="text"
          className="input input-bordered w-full"
          value={Array.isArray(value) ? value.join(", ") : value}
          onChange={(e) =>
            onChange(e.target.value.split(",").map((v) => v.trim()))
          }
          placeholder={placeholder}
        />
      ) : (
        <input
          type={fieldName === "Age" ? "number" : "text"}
          className="input input-bordered w-full"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
        />
      )}
    </div>
  );
};

export default InputField;
