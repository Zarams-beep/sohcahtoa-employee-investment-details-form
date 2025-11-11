import { z } from "zod";

const employmentRow = z.object({
  company: z.string().min(3, "Name of Company is required"),
  address: z.string().min(5, "Enter your address please"),
  from: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Use YYYY-MM-DD"),
  to: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Use YYYY-MM-DD"),
  durationOfService: z
    .string()
    .regex(/^\d+$/, "Duration must contain only numbers")
    .min(1, "Duration is required"),
  designation: z.string().min(3, "Designation is required"),
});

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
  .transform(rows =>
    rows.filter(
      r =>
        r.company ||
        r.address ||
        r.from ||
        r.to ||
        r.durationOfService ||
        r.designation
    )
  )
  .refine(rows => rows.length > 0, {
    message: "Please provide at least one complete employment history",
  })
  .refine(
    rows => rows.every(r => employmentRow.safeParse(r).success),
    { message: "Each filled employment history must have all fields valid" }
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
  .transform(rows =>
    rows.filter(
      r =>
        r.name ||
        r.company ||
        r.position ||
        r.contactDetails
    )
  )
  .refine(rows => rows.length > 0, {
    message: "Please provide at least one complete previous employer",
  })
  .refine(
    rows => rows.every(r => previousEmployerRow.safeParse(r).success),
    { message: "Each filled previous employer must have all fields valid" }
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



// dependent
// school
// professional
// employmentHistory
// previousEmployers