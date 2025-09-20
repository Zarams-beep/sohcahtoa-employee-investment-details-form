import { useEffect } from "react";
import {
  useFieldArray,
  useFormContext,
  useWatch,
} from "react-hook-form";
import { CgAsterisk } from "react-icons/cg";
import { FullFormType } from "@/schema/formSchema";

interface DependentsTableProps {
  name?: "previousEmployers";
}

export default function DependentsTable5({
  name = "previousEmployers",
}: DependentsTableProps) {
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
      append({ name: "", company: "", position: "", contactDetails: "" });
    }
  }, [fields, append]);

  // 🔑 Watch all employer rows
  const employers = useWatch({
    control,
    name,
  }) as { name: string; company: string; position: string; contactDetails: string }[] | undefined;

  // ✅ Ignore rows that are completely empty
  const activeRows =
    employers?.filter(
      (e) => e.name || e.company || e.position || e.contactDetails
    ) || [];

  // ✅ Trigger error only when at least one active row is incomplete
  const someRowIncomplete =
    activeRows.length > 0 &&
    activeRows.some(
      (e) => !e.name || !e.company || !e.position || !e.contactDetails
    );

  // ✅ Dynamically set / clear global error in RHF state
  useEffect(() => {
    if (someRowIncomplete) {
      setError(name, {
        type: "manual",
        message: "Please fill all previous employer fields",
      });
    } else {
      clearErrors(name);
    }
  }, [someRowIncomplete, setError, clearErrors, name]);

  return (
    <div className="table-container">
      <h4 className="">
        Previous Employer Details
        <CgAsterisk className="star-icon" />
      </h4>
      <div className="table-sub-container">
        <table className="">
          <thead>
            <tr className="">
              <th className=""></th>
              <th className="tr-showing-part">Name</th>
              <th className="tr-showing-part">Company</th>
              <th className="tr-showing-part">Position</th>
              <th className="tr-showing-part">Contact details</th>
            </tr>
          </thead>
          <tbody>
            {fields.map((field, rowIndex) => (
              <tr key={field.id}>
                <td className="tr-showing-part">{rowIndex + 1}</td>
                <td className="tbody-side">
                  <input
                    {...register(`${name}.${rowIndex}.name`)}
                    className=""
                    placeholder=""
                  />
                </td>
                <td className="tbody-side">
                  <input
                    {...register(`${name}.${rowIndex}.company`)}
                    className=""
                    placeholder=""
                  />
                </td>
                <td className="tbody-side">
                  <input
                    {...register(`${name}.${rowIndex}.position`)}
                    className=""
                    placeholder=""
                  />
                </td>
                <td className="tbody-side">
                  <input
                    {...register(`${name}.${rowIndex}.contactDetails`)}
                    type="number"
                    className=""
                    placeholder=""
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {errors.previousEmployers && (
        <p className="error-message text-center">
          {errors.previousEmployers.message as string}
        </p>
      )}

      <div className="table-button-container">
        <button
          type="button"
          className="table-add-btn"
          onClick={() =>
            append({ name: "", company: "", position: "", contactDetails: "" })
          }
        >
          +
        </button>
        {fields.length > 4 && (
          <button
            type="button"
            className=""
            onClick={() => remove(fields.length - 1)}
          >
            –
          </button>
        )}
      </div>
    </div>
  );
}
