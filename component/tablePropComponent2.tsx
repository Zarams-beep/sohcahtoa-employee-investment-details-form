import { useEffect } from "react";
import { useFieldArray, useFormContext, useWatch } from "react-hook-form"; // ✅ added useWatch
import { CgAsterisk } from "react-icons/cg";
import { FullFormType } from "@/schema/formSchema";

interface SchoolTableProps {
  name?: "school";
}

export default function DependentsTable2({ name = "school" }: SchoolTableProps) {
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

  useEffect(() => {
    if (fields.length === 0) {
      append({ nameOfInstitution: "", degreeObtained: "", from: "", to: "", grade: "" });
    }
  }, [fields, append]);

  const schools = useWatch({ control, name }) as
    | {
        nameOfInstitution: string;
        degreeObtained: string;
        from: string;
        to: string;
        grade: string;
      }[]
    | undefined;

  // ✅ ignore rows that are completely empty
  const activeRows =
    schools?.filter(
      (s) =>
        s.nameOfInstitution ||
        s.degreeObtained ||
        s.from ||
        s.to ||
        s.grade
    ) || [];

  // ✅ show error only if there is at least one active row AND any of them is incomplete
  const someRowIncomplete =
    activeRows.length > 0 &&
    activeRows.some(
      (s) =>
        !s.nameOfInstitution ||
        !s.degreeObtained ||
        !s.from ||
        !s.to ||
        !s.grade
    );

  // ✅ sync custom error with RHF so it clears as soon as fields are complete
  useEffect(() => {
    if (someRowIncomplete) {
      setError("school", { type: "manual", message: "Please fill all school fields" });
    } else {
      clearErrors("school");
    }
  }, [someRowIncomplete, setError, clearErrors]);

  return (
    <div className="table-container">
      <h4>
        Schools Attended
        <CgAsterisk className="star-icon" />
      </h4>

      <div className="table-sub-container">
        <table>
          <thead>
            <tr>
              <th></th>
              <th className="tr-showing-part">Name of Institution</th>
              <th className="tr-showing-part">Degree Obtained</th>
              <th className="tr-showing-part">From</th>
              <th className="tr-showing-part">To</th>
              <th className="tr-showing-part">Grade</th>
            </tr>
          </thead>
          <tbody>
            {fields.map((field, rowIndex) => (
              <tr key={field.id}>
                <td className="tr-showing-part">{rowIndex + 1}</td>
                <td className="tbody-side">
                  <input
                    {...register(`${name}.${rowIndex}.nameOfInstitution`)}
                    placeholder="Name of Institution"
                  />
                </td>
                <td className="tbody-side">
                  <input
                    {...register(`${name}.${rowIndex}.degreeObtained`)}
                    placeholder="Degree Obtained"
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
                    {...register(`${name}.${rowIndex}.grade`)}
                    placeholder="Grade"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {errors.school && (
        <p className="error-message text-center">
          {errors.school.message as string}
        </p>
      )}

      <div className="table-button-container">
        <button
          type="button"
          className="table-add-btn"
          onClick={() =>
            append({ nameOfInstitution: "", degreeObtained: "", from: "", to: "", grade: "" })
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
