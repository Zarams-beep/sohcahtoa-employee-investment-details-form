import { useEffect } from "react";
import { useFieldArray, useFormContext } from "react-hook-form";
import { CgAsterisk } from "react-icons/cg";
import { FullFormType } from "@/schema/formSchema";

interface DependentsTableProps {
  name?: "dependent";
}

export default function DependentsTable({ name = "dependent" }: DependentsTableProps) {
  // ✅ use the same type as the parent form (FullFormType)
  const {
    control,
    register,
    formState: { errors },
  } = useFormContext<FullFormType>();

  const { fields, append, remove } = useFieldArray({
    control,
    name,
  });

  // ✅ ensure at least one row exists on mount
  useEffect(() => {
    if (fields.length === 0) {
      append({ name: "", age: "", gender: "" });
    }
  }, [fields, append]);

  const dependentsError =
    (errors.dependent?.message as string) ||
    (Array.isArray(errors.dependent) && errors.dependent.some(Boolean) ? "Please fill all dependent fields" : "");


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
                    {...register(`dependent.${index}.name` as const)}
                    placeholder="Name"
                  />
                </td>
                <td className="tbody-side">
                  <input
                    {...register(`dependent.${index}.age` as const)}
                    placeholder="Age"
                  />
                </td>
                <td className="tbody-side">
                  <select {...register(`dependent.${index}.gender` as const)}>
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

      {dependentsError && (
        <p className="error-message text-center">{dependentsError}</p>
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
          <button type="button" onClick={() => remove(fields.length - 1)}>
            –
          </button>
        )}
      </div>
    </div>
  );
}
