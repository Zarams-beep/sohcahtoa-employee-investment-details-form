import { useEffect } from "react";
import { useFieldArray, useFormContext } from "react-hook-form";
import { CgAsterisk } from "react-icons/cg";
import { FullFormType } from "@/schema/formSchema";

interface SchoolTableProps {
  name?: "school";
}

export default function DependentsTable2({ name="school"}: SchoolTableProps) {
    const {
      control,
      register,
      formState: { errors },
    } = useFormContext<FullFormType>();
  
    const { fields, append, remove } = useFieldArray({
      control,
      name,
    });
  
  useEffect(() => {
    if (fields.length === 0) {
        append({ nameOfInstitution: "", degreeObtained: "", from: "", to:"", grade:"" });
    }
  }, [fields, append]);

  return (
    <div className="table-container">
      <h4 className="">
        Schools Attended 
        <CgAsterisk className="star-icon" />
      </h4>
      <div className="table-sub-container">
      <table className="">
        <thead>
          <tr className="">
            <th className=""></th>
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
                  className=""
                  placeholder="Name of Institution"
                />
              </td>
              <td className="tbody-side">
                <input
                  {...register(`${name}.${rowIndex}.degreeObtained`)}
                  className=""
                  placeholder="Degree Obtained"
                />
              </td>
             
                <td className="tbody-side">
                <input
                  {...register(`${name}.${rowIndex}.from`)}
                  className=""
                  placeholder=""
                  type="date"
                />
              </td>

              <td className="tbody-side">
                <input
                  {...register(`${name}.${rowIndex}.to`)}
                  className=""
                  placeholder=""
                  type="date"
                />
              </td>

              <td className="tbody-side">
                <input
                  {...register(`${name}.${rowIndex}.grade`)}
                  className=""
                  placeholder=""
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table></div>

      {errors.school && (
        <p className="error-message text-center">
          {errors.school.message as string}
        </p>
      )}
      <div className="table-button-container">
        <button
          type="button"
          className="table-add-btn"
          onClick={() => append({ nameOfInstitution: "", degreeObtained: "", from: "", to: "", grade: "" })}
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
