import React from "react";

const InputField = ({ fieldName, value, onChange, placeholder }) => {
  return (
    <div className="flex flex-col">
      <label className="py-2 text-lg font-light">{fieldName}</label>
      {fieldName === "About" ? (
        <textarea
          className="w-full p-2 textarea"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={4}
        />
      ) : fieldName === "Skills" ? (
        <input
          className="w-full input input-bordered"
          type="text"
          value={Array.isArray(value) ? value.join(",") : value}
          onChange={(e) =>
            onChange(e.target.value.split(",").map((value) => value.trim()))
          }
          placeholder={placeholder}
        />
      ) : (
        <input
          className="w-full input input-bordered"
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
        />
      )}
    </div>
  );
};

export default InputField;
