import { z } from "zod";
import { dateSchema } from "./dateSchema";

const employmentRow = z.object({
  company: z.string().min(3, "Name of Company is required"),
  address: z.string().min(5, "Enter your address please"),
  from: dateSchema,
  to: dateSchema,
  durationOfService: z
    .string()
    .regex(/^\d+$/, "Duration must contain only numbers")
    .min(1, "Duration is required"),
  designation: z.string().min(3, "Designation is required"),
}).refine(
  (data) => {
    if (!data.from || !data.to) return true;
    return data.from <= data.to;
  },
  { message: "Start date cannot be after end date", path: ["to"] }
);

// Using superRefine instead of chained .transform().refine() to preserve output
// type as known to TypeScript — transform+refine produces unknown which breaks
// the @hookform/resolvers/zod Resolver type.
const employmentArray = z
  .array(
    z.object({
      company: z.string().optional(),
      address: z.string().optional(),
      from: z.string().optional(),
      to: z.string().optional(),
      durationOfService: z.string().optional(),
      designation: z.string().optional(),
    })
  )
  .superRefine((rows, ctx) => {
    const filled = rows.filter(
      (r) => r.company || r.address || r.from || r.to || r.durationOfService || r.designation
    );
    if (filled.length === 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Please provide at least one complete employment history",
      });
      return;
    }
    filled.forEach((r, i) => {
      const result = employmentRow.safeParse(r);
      if (!result.success) {
        result.error.issues.forEach((issue) => {
          ctx.addIssue({
            ...issue,
            path: [i, ...(issue.path ?? [])],
          });
        });
      }
    });
  })
  .transform((rows) =>
    rows.filter(
      (r) => r.company || r.address || r.from || r.to || r.durationOfService || r.designation
    )
  );

const previousEmployerRow = z.object({
  name: z.string().min(3, "Name is required"),
  company: z.string().min(3, "Company Name is required"),
  position: z.string().min(3, "Position is required"),
  contactDetails: z
    .string()
    .regex(/^\d+$/, "Contact Details must contain only numbers")
    .min(8, "Contact Details are required"),
});

const previousEmployerArray = z
  .array(
    z.object({
      name: z.string().optional(),
      company: z.string().optional(),
      position: z.string().optional(),
      contactDetails: z.string().optional(),
    })
  )
  .superRefine((rows, ctx) => {
    const filled = rows.filter(
      (r) => r.name || r.company || r.position || r.contactDetails
    );
    if (filled.length === 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Please provide at least one complete previous employer",
      });
      return;
    }
    filled.forEach((r, i) => {
      const result = previousEmployerRow.safeParse(r);
      if (!result.success) {
        result.error.issues.forEach((issue) => {
          ctx.addIssue({
            ...issue,
            path: [i, ...(issue.path ?? [])],
          });
        });
      }
    });
  })
  .transform((rows) =>
    rows.filter((r) => r.name || r.company || r.position || r.contactDetails)
  );

export const fifthStage = z.object({
  employmentHistory: employmentArray,
  previousEmployers: previousEmployerArray,
  pensionFund: z.string().min(3, "Pension Fund Administrator is required"),
  pensionPin: z
    .string()
    .regex(/^\d+$/, "Pension Pin must contain only numbers")
    .min(3, "Pension Pin is required"),
  bankName: z.string().min(3, "Bank Name is required"),
  accountName: z.string().min(3, "Account Name is required"),
  accountNumber: z
    .string()
    .regex(/^\d+$/, "Account Number must contain only numbers")
    .min(8, "Account Number is required"),
});
