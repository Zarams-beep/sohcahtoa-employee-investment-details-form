import { z } from "zod";

export const firstStage = z.object({
  contractType: z.enum(["Full Time", "Part Time", "Intern", "Other"]),
  ifOthers: z.string().optional(),
  title: z.enum(["Mr.", "Mrs.", "Miss.", "Dr.", "Prof.", "Rev."]),
  Surname: z.string().min(3, "Surname is required"),
  firstName: z.string().min(3, "First Name is required"),
  middleName: z.string().min(3, "Middle Name is required"),
  maidenName: z.string().optional(),
  jobTitle: z.string().min(3, "Job title is required"),
  department: z.string().min(3, "Enter your department please"),
  location: z.string().min(1, "Enter your location please"),
  startDate: z
    .string()
    .min(1, "Date is required")
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format (YYYY-MM-DD)"),
  currentAddress: z.string().min(5, "Enter your current address please"),
  permanentAddress: z.string().min(5, "Enter your permanent address please"),
  phoneNo: z
    .string()
    .regex(/^\d+$/, "Phone Number must contain only numbers")
    .min(9, "Phone Number is required"),
  email: z.string().email("Invalid email format"),
  confirmEmail: z.string().email("Invalid email format"),
});
