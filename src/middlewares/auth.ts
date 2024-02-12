import Express from "express";
import HttpError from "../interfaces/http-error";
import HttpStatus from "../interfaces/http-status";
import { keycloakAuth } from "./auth/keycloak";

export async function expressAuthentication(
  request: Express.Request,
  securityName: string,
  scopes?: string[],
) {
  if (securityName === "keycloak") {
    return keycloakAuth(request, securityName, scopes);
  }
  throw new HttpError(HttpStatus.NOT_IMPLEMENTED, "ไม่ทราบวิธียืนยันตัวตน");
}
