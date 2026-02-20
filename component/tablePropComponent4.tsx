import { useEffect } from "react";
import {
  useFieldArray,
  useFormContext,
  useWatch,
} from "react-hook-form";
import { CgAsterisk } from "react-icons/cg";
import { FullFormType } from "@/schema/formSchema";

interface EmploymentHistoryTableProps {
  name?: "employmentHistory";
}

export default function EmploymentHistoryTable({
  name = "employmentHistory",
}: EmploymentHistoryTableProps) {
  const {
    control,
    register,
    setError,
    clearErrors,
    formState: { errors },
  } = useFormContext<FullFormType>();

  const { fields, append, remove } = useFieldArray({
    control,
    name,
  });

  // Ensure at least one empty row on mount
  useEffect(() => {
    if (fields.length === 0) {
      append({
        company: "",
        address: "",
        from: "",
        to: "",
        durationOfService: "",
        designation: "",
      });
    }
  }, [fields, append]);

  // 🔑 Watch all employment history rows
  const jobs = useWatch({
    control,
    name,
  }) as
    | {
        company: string;
        address: string;
        from: string;
        to: string;
        durationOfService: string;
        designation: string;
      }[]
    | undefined;

  // ✅ Ignore rows that are completely empty
  const activeRows =
    jobs?.filter(
      (j) =>
        j.company ||
        j.address ||
        j.from ||
        j.to ||
        j.durationOfService ||
        j.designation
    ) || [];

  // ✅ Check if a job row has valid date range
  const isValidDateRange = (from: string, to: string): boolean => {
    if (!from || !to) return true; // allow empty dates
    return new Date(from) <= new Date(to);
  };

  // ✅ Mark as incomplete if any required field is missing or date range is invalid
  const someRowIncomplete =
    activeRows.length > 0 &&
    activeRows.some(
      (j) =>
        !j.company ||
        !j.address ||
        !j.from ||
        !j.to ||
        !j.durationOfService ||
        !j.designation ||
        !isValidDateRange(j.from, j.to)
    );

  // ✅ Dynamically set / clear global error
  useEffect(() => {
    if (someRowIncomplete) {
      setError(name, {
        type: "manual",
        message: "Please fill all employment history fields and ensure start date is not after end date",
      });
    } else {
      clearErrors(name);
    }
  }, [someRowIncomplete, setError, clearErrors, name]);

  return (
    <div className="table-container">
      <h4>
        Employment History
        <CgAsterisk className="star-icon" />
      </h4>

      <div className="table-sub-container">
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th className="tr-showing-part">Company</th>
              <th className="tr-showing-part">Address</th>
              <th className="tr-showing-part">From</th>
              <th className="tr-showing-part">To</th>
              <th className="tr-showing-part">Duration of Service</th>
              <th className="tr-showing-part">Designation</th>
            </tr>
          </thead>
          <tbody>
            {fields.map((field, rowIndex) => (
              <tr key={field.id}>
                <td className="tr-showing-part">{rowIndex + 1}</td>

                <td className="tbody-side">
                  <input
                    {...register(`${name}.${rowIndex}.company`)}
                    placeholder="Name of Company"
                  />
                </td>
                <td className="tbody-side">
                  <input
                    {...register(`${name}.${rowIndex}.address`)}
                    placeholder="Address"
                  />
                </td>
                <td className="tbody-side">
                  <input
                    {...register(`${name}.${rowIndex}.from`)}
                    type="date"
                  />
                </td>
                <td className="tbody-side">
                  <input
                    {...register(`${name}.${rowIndex}.to`)}
                    type="date"
                  />
                </td>
                <td className="tbody-side">
                  <input
                    {...register(`${name}.${rowIndex}.durationOfService`)}
                    type="number"
                    placeholder="Months / Years"
                  />
                </td>
                <td className="tbody-side">
                  <input
                    {...register(`${name}.${rowIndex}.designation`)}
                    placeholder="Designation"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ✅ Show the global RHF error */}
      {errors.employmentHistory && (
        <p className="error-message text-center">
          {errors.employmentHistory.message as string}
        </p>
      )}

      <div className="table-button-container">
        <button
          type="button"
          className="table-add-btn"
          onClick={() =>
            append({
              company: "",
              address: "",
              from: "",
              to: "",
              durationOfService: "",
              designation: "",
            })
          }
        >
          +
        </button>
        {fields.length > 4 && (
          <button
            type="button"
            onClick={() => remove(fields.length - 1)}
          >
            –
          </button>
        )}
      </div>
    </div>
  );
}
