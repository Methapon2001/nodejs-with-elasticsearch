import Express from "express";
import { createDecoder, createVerifier } from "fast-jwt";

import HttpError from "../../interfaces/http-error";
import HttpStatus from "../../interfaces/http-status";

if (!process.env.AUTH_PUBLIC_KEY && !process.env.AUTH_REALM_URL) {
  throw new Error("Require keycloak AUTH_PUBLIC_KEY or AUTH_REALM_URL.");
}
if (
  process.env.AUTH_PUBLIC_KEY &&
  process.env.AUTH_REALM_URL &&
  !process.env.AUTH_PREFERRED_MODE
) {
  throw new Error(
    "AUTH_PREFERRED must be specified if AUTH_PUBLIC_KEY and AUTH_REALM_URL is provided.",
  );
}

const jwtVerify = createVerifier({
  key: async () => {
    return `-----BEGIN PUBLIC KEY-----\n${process.env.AUTH_PUBLIC_KEY}\n-----END PUBLIC KEY-----`;
  },
});

const jwtDecode = createDecoder();

export async function keycloakAuth(
  request: Express.Request,
  securityName: string,
  _scopes?: string[],
) {
  if (process.env.NODE_ENV !== "production" && process.env.AUTH_BYPASS) {
    return { preferred_username: "bypassed" };
  }

  if (securityName !== "bearerAuth")
    throw new Error("ไม่ทราบวิธีการยืนยันตัวตน");

  const token = request.headers["authorization"]?.includes("Bearer ")
    ? request.headers["authorization"].split(" ")[1]
    : request.headers["authorization"];

  if (!token)
    throw new HttpError(
      HttpStatus.UNAUTHORIZED,
      "ไม่พบข้อมูลสำหรับยืนยันตัวตน",
    );

  let payload: Record<string, any> = {};

  switch (process.env.AUTH_PREFERRED_MODE) {
    case "online":
      payload = await verifyOnline(token);
      break;
    case "offline":
      payload = await verifyOffline(token);
      break;
    default:
      if (process.env.AUTH_REALM_URL) payload = await verifyOnline(token);
      if (process.env.AUTH_PUBLIC_KEY) payload = await verifyOffline(token);
      break;
  }

  return payload;
}

async function verifyOffline(token: string) {
  const payload = await jwtVerify(token).catch((_) => null);
  if (!payload)
    throw new HttpError(HttpStatus.UNAUTHORIZED, "ไม่สามารถยืนยันตัวตนได้");
  return payload;
}

async function verifyOnline(token: string) {
  const res = await fetch(
    `${process.env.AUTH_REALM_URL}/protocol/openid-connect/userinfo`,
    {
      headers: { authorization: `Bearer ${token}` },
    },
  ).catch((e) => console.error(e));

  if (!res) throw new Error("ไม่สามารถเข้าถึงระบบยืนยันตัวตน");
  if (!res.ok)
    throw new HttpError(HttpStatus.UNAUTHORIZED, "ไม่สามารถยืนยันตัวตนได้");

  return await jwtDecode(token);
}
