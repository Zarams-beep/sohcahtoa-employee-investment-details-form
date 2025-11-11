import { z } from "zod";

const dependentRow = z.object({
  name: z.string().trim(),
  age: z.string().trim().regex(/^\d+$/, "Age must contain only numbers"),
  gender: z.enum(["Male", "Female"]),
});

// allow empty row object so array can contain blanks
const dependentArray = z
  .array(
    z.object({
      name: z.string().optional(),
      age: z.string().optional(),
      gender: z.string().optional(),
    })
  )
  // filter blanks and validate at least one full row
  .transform((rows) => rows.filter(r => r.name || r.age || r.gender))
  .refine((filled) => filled.length > 0, {
    message: "Please provide at least one complete dependent",
  })
  .refine(
    (filled) => filled.every(r => dependentRow.safeParse(r).success),
    { message: "Each filled dependent must have name, numeric age and gender" }
  );

export const thirdStage = z.object({
  dependent: dependentArray,  
  // next of kin
  titleKin: z.enum(["Mr.", "Mrs.", "Miss.", "Dr.", "Prof.", "Rev."]),
  SurnameKin: z.string().min(3, "Kin Surname is required"),
  firstNameKin: z.string().min(3, "Kin First Name is required"),
  kinAddress: z.string().min(5, "Enter your Kin Address please"),
  kinPhoneNo: z
    .string()
    .regex(/^\d+$/, "Next of Kin's Phone Number must contain only numbers")
    .min(8, "Next of Kin's Phone Number is required"),
    relationshipKin: z.string().min(1, "Kin Relationship is required"),

  // emergency
  titleEmergency: z.enum(["Mr.", "Mrs.", "Miss.", "Dr.", "Prof.", "Rev."]),
  SurnameEmergency: z.string().min(3, "Emergency Surname is required"),
  firstNameEmergency: z.string().min(3, "Emergency First Name is required"),
  emergencyAddress: z.string().min(5, "Enter your Emergency Address please"),
  emergencyPhoneNo: z
    .string()
    .regex(/^\d+$/, "Emergency's Phone Number must contain only numbers")
    .min(8, "Emergency's Phone Number is required"),
    relationshipEmergency: z.string().min(3, "Emergency First Name is required"),
});