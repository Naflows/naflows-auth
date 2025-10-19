import { v4 } from "uuid";
import { db } from "..";
import { services } from "../secure/services/dir";
import { software } from "../software/dir";
import { ReplyType } from "../types/.types/reply.type";
import middleware from "./dir";

export async function NASS_Verification_Process(req, res, next) {
  if (req.body) {
    try {
      console.log("\x1b[34m%s\x1b[0m", `------ INCOMING REQUEST at ${req.body.request.url} (${req.body.data && req.body.data["customRequestURL"] ? req.body.data["customRequestURL"] : "No custom request URL provided"})  ------`);
      if (process.env.NASS_SCV_ENABLED !== "true") {
        console.log("NASS SCV is disabled, skipping verification process.");
        return next();
      } else {
        // Executing the Secure Connection Verification Process
        const scv: ReplyType = await middleware.process.scv(req, res);

        if (!scv.success) {
          console.error("\x1b[31m%s\x1b[0m", `NASS SCV Process failed: ${scv.message}`);
          return software.methods.manageErrorCode(scv, res);
        }

        // Executing the Secure Session Verification Process
        const ssv: ReplyType = await middleware.process.ssv(req, res);
        if (!ssv.success) {
          console.error("\x1b[31m%s\x1b[0m", `NASS SSV Process failed: ${ssv.message}`);
          return software.methods.manageErrorCode(ssv, res);
        }

        let newSessionID: string | undefined;
        if (ssv.data) {
          if ((ssv.data as { session?: any }).session) {
            (req as any).newSessionID = (ssv.data as { session?: any }).session;
            (req as any).body.user.session_id = (ssv.data as { session?: any }).session;
            newSessionID = (ssv.data as { session?: any }).session;
          }
        }

        // Executing the Secure Token Verification Process
        const stv: ReplyType = await middleware.process.stv(req, res, ssv);
        if (!stv.success) {
          console.error("\x1b[31m%s\x1b[0m", `NASS STV Process failed: ${stv.message}`);
          if (!stv.data || !stv.data["session"]) {
            stv.data = stv.data || {};
          }
          if (newSessionID) {
            stv.data["session"] = newSessionID;
          }
          return software.methods.manageErrorCode(stv, res);
        }


        if (stv.data) {
          if ((stv.data as { token?: string }).token) {
            (req as any).newTokenID = (stv.data as any).token;
          }
          if ((stv.data as { retry_after?: number }).retry_after) {
            (req as any).retry_after = (stv.data as { retry_after?: number }).retry_after;
          }
          if ((stv.data as { token?: string }).token) {
            (req as any).token = (stv.data as { token?: string }).token;
          }
        }

        console.log("\x1b[32m%s\x1b[0m", "NASS Verification Process completed successfully.");
        console.log(`\x1b[90mAdditional data before processing: \n\x1b[90mNew Session ID: ${(req as any).newSessionID || "None"}\n\x1b[90mNew Token ID: ${(req as any).newTokenID || "None"}\n\x1b[90mRetry After: ${(req as any).retry_after || "None"}\n\x1b[90mToken: ${(req as any).token || "None"} \x1b[0m`);

        const serviceID = req.body.client?.service_id;
        await services.service.logs.setTraffic(serviceID, {
          endpoint: "/nass/instance",
          method: "REQUEST_ORIGIN_CHECK",
          timestamp: Date.now(),
          type: "USER",
          id: v4()
        });

        return next();
      }
    } catch (error) {
      console.error("\x1b[31m%s\x1b[0m", "Unexpected error during NASS Verification Process: ", error, req.body);
      return software.methods.manageErrorCode(
        {
          status: 500,
          message: "Internal server error during NASS Verification Process.",
          success: false,
        },
        res
      );
    }
  } else {
    console.log("\x1b[31m%s\x1b[0m", "NASS Verification Process failed: No request body provided.");
    return software.methods.manageErrorCode(
      {
        status: 400,
        message: "No request body provided.",
        success: false,
      },
      res
    );
  }
}
