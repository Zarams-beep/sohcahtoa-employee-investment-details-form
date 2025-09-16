import { z } from "zod";

const schoolRow = z.object({
  nameOfInstitution: z.string().trim().min(1, "Institution name is required"),
  degreeObtained: z.string().trim().min(1, "Degree is required"),
  from: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Use YYYY-MM-DD"),
  to: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Use YYYY-MM-DD"),
  grade: z.string().trim().min(1, "Grade is required"),
});

// allow user to add multiple schools but ignore empty rows
const schoolArray = z
  .array(
    z.object({
      nameOfInstitution: z.string().optional(),
      degreeObtained: z.string().optional(),
      from: z.string().optional(),
      to: z.string().optional(),
      grade: z.string().optional(),
    })
  )
  .transform(rows =>
    // keep only rows where at least one field is filled
    rows.filter(
      r =>
        r.nameOfInstitution ||
        r.degreeObtained ||
        r.from ||
        r.to ||
        r.grade
    )
  )
  .refine(rows => rows.length > 0, {
    message: "Please provide at least one complete school entry",
  })
  .refine(
    rows => rows.every(r => schoolRow.safeParse(r).success),
    { message: "Each filled school entry must have all fields valid" }
  );

// professional rows
const professionalRow = z.object({
  certification: z.string().trim().min(1, "Certification is required"),
  award: z.string().trim().min(1, "Award is required"),
  year: z.string(),
});

const professionalArray = z
  .array(
    z.object({
      certification: z.string().optional(),
      award: z.string().optional(),
      year: z.string().optional(),
    })
  )
  .transform(rows =>
    // keep only rows where at least one field is filled
    rows.filter(
      p =>
        p.certification ||
        p.award ||
        p.year
    )
  )
  .refine(rows => rows.length > 0, {
    message: "Please provide at least one complete professional entry",
  })
  .refine(
    rows => rows.every(r => professionalRow.safeParse(r).success),
    { message: "Each filled professional entry must have all fields valid" }
  );


export const fourthStage = z.object({
  school: schoolArray,
  professional: professionalArray,
});
