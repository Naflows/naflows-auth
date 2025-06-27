import { db } from "..";
import { software } from "../software/dir";
import { ReplyType } from "../types/.types/reply.type";
import middleware from "./dir";

export async function NASS_Verification_Process(req, res, next) {
  if (req.body) {
    try {
      console.log("NASS Verification Process started.");
      console.log("\x1b[34m%s\x1b[0m", `------ INCOMING REQUEST at ${req.body.request.url}  ------`);
      if (process.env.NASS_SCV_ENABLED !== "true") {
        console.log("NASS SCV is disabled, skipping verification process.");
        return next();
      } else {
        // Executing the Secure Connection Verification Process
        const scv: ReplyType = await middleware.process.scv(req, res);

        if (!scv.success) {
          console.error(
            "\x1b[31m%s\x1b[0m",
            "NASS SCV Process failed:",
            scv.message
          );
          return software.methods.manageErrorCode(scv, res);
        }

        // Executing the Secure Session Verification Process
        const ssv: ReplyType = await middleware.process.ssv(req, res);
        if (!ssv.success) {
          console.error(
            "\x1b[31m%s\x1b[0m",
            "NASS SSV Process failed:",
            ssv.message
          )
          return software.methods.manageErrorCode(ssv, res);
        }



        console.log(
          "\x1b[32m%s\x1b[0m",
          "NASS Verification Process completed successfully."
        );
        if (ssv.data) {
          // Type guard to check if ssv.data has a token property
          if ((ssv.data as { token?: string }).token) {
            (req as any).ssvData = ssv.data;
          }
          if ((ssv.data as { session?: any }).session) {
            (req as any).ucrData = (ssv.data as { session?: any }).session;
          }

          console.log(
            "\x1b[34m%s\x1b[0m",
            "SSV Data:",
            (req as any).ssvData
          );
        }

        return next();
      }
    } catch (error) {
      console.error(
        "\x1b[31m%s\x1b[0m",
        "Unexpected error during NASS Verification Process:",
        error, req.body
      );
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
    console.log(
      "\x1b[31m%s\x1b[0m",
      "NASS Verification Process failed: No request body provided."
    );
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
