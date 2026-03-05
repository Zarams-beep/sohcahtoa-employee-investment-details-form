import { z } from "zod";
import { dateSchema } from "./dateSchema";

const schoolRow = z.object({
  nameOfInstitution: z.string().trim().min(3, "Institution name is required"),
  degreeObtained: z.string().trim().min(3, "Degree is required"),
  from: dateSchema,
  to: dateSchema,
  grade: z.string().trim().min(3, "Grade is required"),
}).refine(
  (data) => {
    if (!data.from || !data.to) return true;
    return data.from <= data.to;
  },
  { message: "Start date cannot be after end date", path: ["to"] }
);

// Accept rows as loose objects, filter blanks, then validate filled rows.
// Using superRefine instead of chained .transform().refine() so the array
// output type stays known to TypeScript (transform+refine → unknown).
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
  .superRefine((rows, ctx) => {
    const filled = rows.filter(
      (r) => r.nameOfInstitution || r.degreeObtained || r.from || r.to || r.grade
    );
    if (filled.length === 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Please provide at least one complete school entry",
      });
      return;
    }
    filled.forEach((r, i) => {
      const result = schoolRow.safeParse(r);
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
      (r) => r.nameOfInstitution || r.degreeObtained || r.from || r.to || r.grade
    )
  );

const professionalRow = z.object({
  certification: z.string().trim().min(1, "Certification is required"),
  award: z.string().trim().min(1, "Award is required"),
  year: z.string().min(1, "Year is required"),
});

const professionalArray = z
  .array(
    z.object({
      certification: z.string().optional(),
      award: z.string().optional(),
      year: z.string().optional(),
    })
  )
  .superRefine((rows, ctx) => {
    const filled = rows.filter((r) => r.certification || r.award || r.year);
    if (filled.length === 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Please provide at least one complete professional entry",
      });
      return;
    }
    filled.forEach((r, i) => {
      const result = professionalRow.safeParse(r);
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
    rows.filter((r) => r.certification || r.award || r.year)
  );

export const fourthStage = z.object({
  school: schoolArray,
  professional: professionalArray,
});
