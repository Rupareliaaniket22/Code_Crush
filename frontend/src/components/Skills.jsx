import { useState } from "react";

const Skills = ({ skills = [], type }) => {
  const [isShowAll, setIsShowAll] = useState(false);

  const smallScreenLimit = 2;
  const largeScreenLimit = 3;
  const isSmallScreen = type === "SmallScreen";
  const limit = isSmallScreen ? smallScreenLimit : largeScreenLimit;

  return (
    <div className="flex flex-wrap gap-1 mt-2">
      {skills.length ? (
        <>
          {(isShowAll ? skills : skills.slice(0, limit)).map((skill, idx) => (
            <span
              key={idx}
              className="badge badge-sm badge-outline border-primary text-primary text-xs px-2"
            >
              {skill}
            </span>
          ))}

          {!isShowAll && skills.length > limit && (
            <span
              className="text-xs text-primary cursor-pointer"
              onClick={() => setIsShowAll(true)}
            >
              +{skills.length - limit} more
            </span>
          )}

          {isShowAll && skills.length > limit && (
            <span
              className="text-xs text-primary cursor-pointer"
              onClick={() => setIsShowAll(false)}
            >
              Show less
            </span>
          )}
        </>
      ) : (
        <span className="text-xs text-base-content/50 italic">None listed</span>
      )}
    </div>
  );
};

export default Skills;
