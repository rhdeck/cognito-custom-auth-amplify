const { Auth } = require("@aws-amplify/auth");
const Google = async (token) => {
  const { email } = decode(token);
  let user = await Auth.signIn(email);
  user = await Auth.sendCustomChallengeAnswer(user, "GOOGLE", {
    authType: "GOOGLE",
  });
  user = await Auth.sendCustomChallengeAnswer(user, jwt);
  return user;
};
const Apple = async (token) => {
  const { email } = decode(token);
  let user = await Auth.signIn(email);
  user = await Auth.sendCustomChallengeAnswer(user, "APPLE", {
    authType: "APPLE",
  });
  user = await Auth.sendCustomChallengeAnswer(user, jwt);
  return user;
};
const Phone = async (phone) => {
  let user = await Auth.signIn(phone);
  user = await Auth.sendCustomChallengeAnswer(user, "PHONE", {
    authType: "PHONE",
  });
  return async (code) => {
    const user2 = await Auth.sendCustomChallengeAnswer(user, code);
    return user2;
  };
};
module.exports = { Google, Apple, Phone };
