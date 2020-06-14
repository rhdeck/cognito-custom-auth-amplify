const { Auth } = require("@aws-amplify/auth");
const decode = require("jwt-decode");
const initialChallenge = async (userString, authType) => {
  let user = await Auth.signIn(userString);
  if (user.getAuthenticationFlowType() !== "CUSTOM_AUTH") {
    const e = new Error("Did not get proper authentication flow");
    e.user = user;
    throw e;
  }
  if (user.challengeParam.authType !== "FIRST")
    throw new Error("Did not get proper authenticatication type response");
  user = await Auth.sendCustomChallengeAnswer(user, authType, {
    authType,
  });
  if (user.challengeParam.authType !== authType)
    throw new Error("Did not get proper authentication challenge type");
  return user;
};
const Google = async (token, username) => {
  const { email } = decode(token);
  if (!username) username = email;
  let user = await initialChallenge(email, "GOOGLE");
  user = await Auth.sendCustomChallengeAnswer(user, token);
  return user;
};
const Apple = async (jwt, username) => {
  const { email } = decode(jwt);
  if (!username) username = email;
  let user = await initialChallenge(username, "APPLE");
  user = await Auth.sendCustomChallengeAnswer(user, jwt);
  return user;
};
const Phone = async (phone) => {
  let user = await initialChallenge(phone, "PHONE");
  return async (code) => {
    try {
      user = await Auth.sendCustomChallengeAnswer(user, code);
      if (user.challengeName === "CUSTOM_CHALLENGE") {
        const e = new Error("Code failed but can try again");
        e.tryAgain = true;
        throw e;
      }
      return user;
    } catch (e) {
      throw e;
    }
  };
};
const Email = async (email) => {
  let user = await initialChallenge(email, "EMAIL");
  return async (code) => {
    try {
      user = await Auth.sendCustomChallengeAnswer(user, code);
      if (user.challengeName === "CUSTOM_CHALLENGE") {
        const e = new Error("Code failed but can try again");
        e.tryAgain = true;
        throw e;
      }
      return user;
    } catch (e) {
      throw e;
    }
  };
};
module.exports = { Google, Apple, Phone, Email };
