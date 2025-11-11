import { z } from "zod";

export const secondStage = z
  .object({
    DOB: z
      .string()
      .min(1, "Date is required")
      .regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format (YYYY-MM-DD)"),
    age: z
      .string()
      .regex(/^\d+$/, "Age must contain only numbers")
      .min(1, "Age is required"),
    gender: z.enum(["Male", "Female"]),
    stateOfOrigin: z.string().min(1, "State of Origin is required"),
    LGA: z.string().min(1, "LGA is required"),
    maritalStatus: z.enum([
      "Single",
      "Married",
      "Divorced",
      "Separated",
      "Other",
    ]),
    ifOthers: z.string().optional(),
    Religion: z.enum(["Christian", "Muslim", "Other"]),
    Ethnicity: z.string().min(1, "Ethnicity is required"),
    NIN: z
      .string()
      .regex(/^\d+$/, "National I.D. Number must contain only numbers")
      .min(1, "National I.D. Number is required"),
    PhysicallyChallenged: z.enum(["Yes", "No"]),

    // father name
    titleFather: z.enum(["Mr.", "Mrs.", "Miss.", "Dr.", "Prof.", "Rev."]),
    SurnameFather: z.string().min(3, "Father Surname is required"),
    firstNameFather: z.string().min(3, "Father First Name is required"),
    fatherAddress: z.string().min(5, "Enter your Father address please"),
    fatherPhoneNo: z
      .string()
      .regex(/^\d+$/, "Father's Phone Number must contain only numbers")
      .min(8, "Father's Phone Number is required"),

    // mother name
    titleMother: z.enum(["Mr.", "Mrs.", "Miss.", "Dr.", "Prof.", "Rev."]),
    SurnameMother: z.string().min(3, "Mother Surname is required"),
    firstNameMother: z.string().min(3, "Mother First Name is required"),
    motherAddress: z.string().min(5, "Enter your Mother's Address please"),
    motherPhoneNo: z
      .string()
      .regex(/^\d+$/, "Mother's Phone Number must contain only numbers")
      .min(8, "Mother's Phone Number is required"),

    // spouse details (made optional by default)
    titleSpouse: z.enum(["Mr.", "Mrs.", "Miss.", "Dr.", "Prof.", "Rev."]).optional(),
    SurnameSpouse: z.string().optional(),
    firstNameSpouse: z.string().optional(),
    spouseAddress: z.string().optional(),
    spousePhoneNo: z.string().optional(),
  })
