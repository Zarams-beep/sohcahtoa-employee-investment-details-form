import { z } from "zod";
import { fifthStage } from "./fifthStage";
import { fourthStage } from "./fourthStage";
import { thirdStage } from "./thirdStage";
import { secondStage } from "./secondStage";
import { firstStage } from "./firstStage";

// -----------------------
// Stage 6
// -----------------------
export const sixthStage = z
  .object({
    convictedCrime: z.enum(["Yes", "No"]),
    ifOthers: z.string().optional(),
    date: z
      .string()
      .min(1, "Date is required")
      .regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format (YYYY-MM-DD)"),
    signature: z
      .string()
      .min(1, "Signature is required")
      .or(
        z.string().regex(
          /^data:image\/(png|jpg|jpeg);base64,/,
          "Invalid base64 signature"
        )
      )
      .or(
        z
          .instanceof(File)
          .refine(
            (file) => ["image/png", "image/jpeg"].includes(file.type),
            "Signature must be PNG or JPEG"
          )
      ),
    uploadPassport: z.instanceof(File, {
      message: "Upload Passport Photograph",
    }),
  })

// -----------------------
// Types
// -----------------------
export type FirstStageType = z.infer<typeof firstStage>;
export type SecondStageType = z.infer<typeof secondStage>;
export type ThirdStageType = z.infer<typeof thirdStage>;
export type FourthStageType = z.infer<typeof fourthStage>;
export type FifthStageType = z.infer<typeof fifthStage>;
export type SixthStageType = z.infer<typeof sixthStage>;

// -----------------------
// Full Schema
// -----------------------
export const fullFormSchema = firstStage
  .merge(secondStage)
  .merge(thirdStage)
  .merge(fourthStage)
  .merge(fifthStage)
  .merge(sixthStage)
  .refine((data) => data.email === data.confirmEmail, {
    path: ["confirmEmail"],
    message: "Emails do not match",
  })
  .refine((data) => {
    if (data.contractType === "Other") {
      return data.ifOthers && data.ifOthers.trim().length > 0;
    }
    return true;
  }, {
    path: ["ifOthers"],
    message: "Kindly specify",
  })
  .refine(
    (data) => {
      if (data.maritalStatus === "Other") {
        return data.ifOthers && data.ifOthers.trim().length > 0;
      }
      return true;
    },
    {
      path: ["ifOthers"],
      message: "Kindly specify",
    }
  ).refine(
    (data) => {
      if (data.convictedCrime === "Yes") {
        return data.ifOthers && data.ifOthers.trim().length > 0;
      }
      return true;
    },
    {
      path: ["ifOthers"],
      message: "Kindly specify",
    }
  ) .superRefine((data, ctx) => {
    if (data.maritalStatus === "Married") {
      if (!data.titleSpouse) {
        ctx.addIssue({
          code: "custom",
          path: ["titleSpouse"],
          message: "Spouse title is required",
        });
      }
      if (!data.SurnameSpouse) {
        ctx.addIssue({
          code: "custom",
          path: ["SurnameSpouse"],
          message: "Spouse surname is required",
        });
      }
      if (!data.firstNameSpouse) {
        ctx.addIssue({
          code: "custom",
          path: ["firstNameSpouse"],
          message: "Spouse first name is required",
        });
      }
      if (!data.spouseAddress) {
        ctx.addIssue({
          code: "custom",
          path: ["spouseAddress"],
          message: "Spouse address is required",
        });
      }
      if (!data.spousePhoneNo || !/^\d+$/.test(data.spousePhoneNo)) {
        ctx.addIssue({
          code: "custom",
          path: ["spousePhoneNo"],
          message: "Spouse phone number must be numbers only",
        });
      }
    }
  });

export type FullFormType = z.infer<typeof fullFormSchema>;