import crypto from "crypto";

const generateLinkToken = () => {
  return crypto.randomBytes(32).toString("hex");
};
export default generateLinkToken;
