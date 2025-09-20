import { useEffect } from "react";
import { useFieldArray, useFormContext, useWatch } from "react-hook-form";
import { CgAsterisk } from "react-icons/cg";
import { FullFormType } from "@/schema/formSchema";

interface ProfessionalTableProps {
  name?: "professional";
}

export default function DependentsTable3({
  name = "professional",
}: ProfessionalTableProps) {
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

  // ✅ ensure at least one empty row on mount
  useEffect(() => {
    if (fields.length === 0) {
      append({ certification: "", award: "", year: "" });
    }
  }, [fields, append]);

  // 🔑 watch the current values
  const professional = useWatch({ control, name }) as
    | { certification: string; award: string; year: string }[]
    | undefined;

  // ✅ ignore rows that are completely empty
  const activeRows =
    professional?.filter(
      (r) => r.certification || r.award || r.year
    ) || [];

  // ✅ show error only if there is at least one active row AND any is incomplete
  const someRowIncomplete =
    activeRows.length > 0 &&
    activeRows.some(
      (r) => !r.certification || !r.award || !r.year
    );

  // dynamically set/clear global error
  useEffect(() => {
    if (someRowIncomplete) {
      setError(name, {
        type: "manual",
        message: "Please fill all professional training fields",
      });
    } else {
      clearErrors(name);
    }
  }, [someRowIncomplete, setError, clearErrors, name]);

  return (
    <div className="table-container">
      <h4>
        Professional Training
        <CgAsterisk className="star-icon" />
      </h4>

      <div className="table-sub-container">
        <table>
          <thead>
            <tr>
              <th></th>
              <th className="tr-showing-part">Certification Body</th>
              <th className="tr-showing-part">Award</th>
              <th className="tr-showing-part">Year</th>
            </tr>
          </thead>
          <tbody>
            {fields.map((field, rowIndex) => (
              <tr key={field.id}>
                <td className="tr-showing-part">{rowIndex + 1}</td>
                <td className="tbody-side">
                  <input
                    {...register(`${name}.${rowIndex}.certification`)}
                    placeholder="Certification"
                  />
                </td>
                <td className="tbody-side">
                  <input
                    {...register(`${name}.${rowIndex}.award`)}
                    placeholder="Award"
                  />
                </td>
                <td className="tbody-side">
                  <input
                    {...register(`${name}.${rowIndex}.year`)}
                    placeholder="Year"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {errors.professional && (
        <p className="error-message text-center">
          {errors.professional.message as string}
        </p>
      )}

      <div className="table-button-container">
        <button
          type="button"
          className="table-add-btn"
          onClick={() =>
            append({ certification: "", award: "", year: "" })
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
