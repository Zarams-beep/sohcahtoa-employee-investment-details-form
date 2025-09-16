import { useEffect } from "react";
import { useFieldArray, useFormContext } from "react-hook-form";
import { CgAsterisk } from "react-icons/cg";
import { FullFormType } from "@/schema/formSchema";
interface DependentsTableProps {
  name?:"employmentHistory";
}


export default function DependentsTable4({ name="employmentHistory" }: DependentsTableProps) {
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
        append({ company: "", address: "", from: "", to: "", durationOfService: "", designation: "" });
    }
  }, [fields, append]);

  return (
    <div className="table-container">
      <h4 className="">
        Employment History 
        <CgAsterisk className="star-icon" />
      </h4>
      <div className="table-sub-container">
      <table className="">
        <thead>
          <tr className="">
            <th className=""></th>
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
                  className=""
                  placeholder="Name of Company"
                />
              </td>
              <td className="tbody-side">
                <input
                  {...register(`${name}.${rowIndex}.address`)}
                  className=""
                  placeholder="Address"
                />
              </td>
             
                <td className="tbody-side">
                <input
                  {...register(`${name}.${rowIndex}.from`)}
                  className=""
                  type="date"
                  placeholder=""
                />
              </td>

              <td className="tbody-side">
                <input
                  {...register(`${name}.${rowIndex}.to`)}
                  className=""
                  type="date"
                  placeholder=""
                />
              </td>

              <td className="tbody-side">
                <input
                  {...register(`${name}.${rowIndex}.durationOfService`)}
                  className=""
                  type="number"
                  placeholder=""
                />
              </td>

              <td className="tbody-side">
                <input
                  {...register(`${name}.${rowIndex}.designation`)}
                  className=""
                  type="text"
                  placeholder="Designation"
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table></div>

      {errors.employmentHistory && (
        <p className="error-message text-center">
          {errors.employmentHistory.message as string}
        </p>
      )}

      <div className="table-button-container">
        <button
          type="button"
          className="table-add-btn"
          onClick={() => append({company: "", address: "", from: "", to: "", durationOfService: "", designation: "" })}
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
