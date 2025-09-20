import { useEffect } from "react";
import {
  useFieldArray,
  useFormContext,
  useWatch,
} from "react-hook-form";
import { CgAsterisk } from "react-icons/cg";
import { FullFormType } from "@/schema/formSchema";

interface DependentsTableProps {
  name?: "dependent";
}

export default function DependentsTable({
  name = "dependent",
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

  // Ensure at least one blank row exists on mount
  useEffect(() => {
    if (fields.length === 0) {
      append({ name: "", age: "", gender: "" });
    }
  }, [fields, append]);

  // 🔑 Watch all dependent rows
  const dependents = useWatch({
    control,
    name,
  }) as { name: string; age: string; gender: string }[] | undefined;

  // ✅ Ignore rows that are completely empty
  const activeRows =
    dependents?.filter((d) => d.name || d.age || d.gender) || [];

  // ✅ Trigger error only when at least one active row is incomplete
  const someRowIncomplete =
    activeRows.length > 0 &&
    activeRows.some((d) => !d.name || !d.age || !d.gender);

  // ✅ Dynamically set / clear global error in RHF state
  useEffect(() => {
    if (someRowIncomplete) {
      setError(name, {
        type: "manual",
        message: "Please fill all dependent fields",
      });
    } else {
      clearErrors(name);
    }
  }, [someRowIncomplete, setError, clearErrors, name]);

  return (
    <div className="table-container">
      <h4>
        List of Dependents <CgAsterisk className="star-icon" />
      </h4>

      <div className="table-sub-container">
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th className="tr-showing-part">Name</th>
              <th className="tr-showing-part">Age</th>
              <th className="tr-showing-part">Gender</th>
            </tr>
          </thead>
          <tbody>
            {fields.map((field, index) => (
              <tr key={field.id}>
                <td className="tr-showing-part">{index + 1}</td>

                <td className="tbody-side">
                  <input
                    {...register(`dependent.${index}.name`, {
                      required: "Name is required",
                    })}
                    placeholder="Name"
                  />
                </td>

                <td className="tbody-side">
                  <input
                    {...register(`dependent.${index}.age`, {
                      required: "Age is required",
                    })}
                    placeholder="Age"
                  />
                </td>

                <td className="tbody-side">
                  <select
                    {...register(`dependent.${index}.gender`, {
                      required: "Gender is required",
                    })}
                  >
                    <option value="">Select</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ✅ Show the global dependent error */}
      {errors.dependent && (
        <p className="error-message text-center">
          {errors.dependent.message as string}
        </p>
      )}

      <div className="table-button-container">
        <button
          type="button"
          className="table-add-btn"
          onClick={() => append({ name: "", age: "", gender: "" })}
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
