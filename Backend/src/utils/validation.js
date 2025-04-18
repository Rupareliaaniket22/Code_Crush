const AllowedUpdates = (data) => {
  const ALLOWED_UPDATES = [
    "firstName",
    "lastName",
    "photoUrl",
    "about",
    "skills",
    "gender",
    "Age",
  ];
  const isUpdateAllowed = Object.keys(data).every((k) =>
    ALLOWED_UPDATES.includes(k)
  );
  if (!isUpdateAllowed) {
    console.log("Updates to certain fields are not allowed");
    throw new Error("Updates to certain fields are not allowed");
  }
};

module.exports = { AllowedUpdates };
