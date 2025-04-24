import crypto from "node:crypto";

export const calculateSecretHash = (username: string, clientId: string, clientSecret: string): string => {
  const message = username + clientId;
  const hmac = crypto.createHmac("sha256", clientSecret);
  hmac.update(message);
  return hmac.digest("base64");
};