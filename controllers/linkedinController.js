const passport = require("../configs/passport.config");

exports.logInLink = () => {
  passport.authenticate("linkedin", {
    scope: ["r_emailaddress", "r_liteprofile"],
  });
};

exports.logInLinkCB = () => {
  passport.authenticate("linkedin", {
    successRedirect: "http://localhost:3000/user-profile",
    failureRedirect: "http://localhost:3000/login",
  });
};
