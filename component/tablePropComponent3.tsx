import { useEffect } from "react";
import { useFieldArray, useFormContext } from "react-hook-form";
import { CgAsterisk } from "react-icons/cg";
import { FullFormType } from "@/schema/formSchema";
interface ProfessionalTableProps {
  name?: "professional";
}


export default function DependentsTable3({ name="professional" }: ProfessionalTableProps) {
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
        append({ certification: "", award: "", year: "" });
    }
  }, [fields, append]);

  return (
    <div className="table-container">
      <h4 className="">
       Professional Training 
        <CgAsterisk className="star-icon" />
      </h4>
    <div className="table-sub-container">  
      <table className="">
        <thead>
          <tr className="">
            <th className=""></th>
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
                  className=""
                  placeholder="Certification"
                />
              </td>
              <td className="tbody-side">
                <input
                  {...register(`${name}.${rowIndex}.award`)}
                  className=""
                  placeholder="Award"
                />
              </td>
             
                <td className="tbody-side">
                <input
                  {...register(`${name}.${rowIndex}.year`)}
                  className=""
                  placeholder=""
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table></div>

      {errors.professional && (
        <p className="error-message text-center">
          {errors.professional.message as string}
        </p>
      )}

      <div className="table-button-container">
        <button
          type="button"
          className="table-add-btn"
          onClick={() => append({ certification: "", award: "", year: "" })}
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
