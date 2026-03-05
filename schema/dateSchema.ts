import { z } from "zod";

// Reusable date schema: accepts YYYY-MM-DD from DatePicker, validates it's a real date.
// Uses .transform().pipe() instead of z.preprocess() to keep TypeScript output typed
// as `string` — z.preprocess() infers `unknown` which breaks @hookform/resolvers/zod.
export const dateSchema = z
  .string()
  .transform((val) => {
    // normalise dd/mm/yyyy or dd-mm-yyyy → yyyy-mm-dd just in case
    const m = val.match(/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{2,4})$/);
    if (m) {
      const day = m[1].padStart(2, "0");
      const mon = m[2].padStart(2, "0");
      const yr  = m[3].padStart(4, "0");
      return `${yr}-${mon}-${day}`;
    }
    return val;
  })
  .pipe(
    z
      .string()
      .nonempty("Date is required")
      .refine(
        (val) => !isNaN(Date.parse(val)),
        "Invalid date – please enter a real value"
      )
  );
