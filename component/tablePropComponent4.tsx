"use client";
import { useEffect } from "react";
import { useFieldArray, useFormContext, useWatch } from "react-hook-form";
import { CgAsterisk } from "react-icons/cg";
import { FullFormType } from "@/schema/formSchema";

export default function EmploymentHistoryTable() {
  const name = "employmentHistory" as const;

  const {
    control,
    register,
    formState: { errors, isSubmitted },
  } = useFormContext<FullFormType>();

  const { fields, append, remove } = useFieldArray({ control, name });

  useEffect(() => {
    if (fields.length === 0) {
      append({ company: "", address: "", from: "", to: "", durationOfService: "", designation: "" });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const jobs = useWatch({ control, name }) as {
    company: string; address: string; from: string;
    to: string; durationOfService: string; designation: string;
  }[] | undefined;

  return (
    <div className="table-container">
      <h4>
        Employment History <CgAsterisk className="star-icon" />
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
            {fields.map((field, rowIndex) => {
              const row = jobs?.[rowIndex];
              const hasInvalidDates = row?.from && row?.to && row.from > row.to;
              return (
                <tr
                  key={field.id}
                  style={hasInvalidDates ? { backgroundColor: "#ffe6e6" } : {}}
                >
                  <td className="tr-showing-part">{rowIndex + 1}</td>
                  <td className="tbody-side">
                    <input {...register(`${name}.${rowIndex}.company`)} placeholder="Name of Company" />
                  </td>
                  <td className="tbody-side">
                    <input {...register(`${name}.${rowIndex}.address`)} placeholder="Address" />
                  </td>
                  <td className="tbody-side">
                    <input
                      {...register(`${name}.${rowIndex}.from`)}
                      type="date"
                      style={hasInvalidDates ? { borderColor: "#dc2626", borderWidth: "2px" } : {}}
                    />
                  </td>
                  <td className="tbody-side">
                    <input
                      {...register(`${name}.${rowIndex}.to`)}
                      type="date"
                      style={hasInvalidDates ? { borderColor: "#dc2626", borderWidth: "2px" } : {}}
                    />
                  </td>
                  <td className="tbody-side">
                    <input {...register(`${name}.${rowIndex}.durationOfService`)} type="number" placeholder="Months / Years" />
                  </td>
                  <td className="tbody-side">
                    <input {...register(`${name}.${rowIndex}.designation`)} placeholder="Designation" />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {isSubmitted && errors.employmentHistory && (
        <p className="error-message text-center">
          {errors.employmentHistory.message as string}
        </p>
      )}

      <div className="table-button-container">
        <button
          type="button"
          className="table-add-btn"
          onClick={() => append({ company: "", address: "", from: "", to: "", durationOfService: "", designation: "" })}
        >
          +
        </button>
        {fields.length > 1 && (
          <button type="button" onClick={() => remove(fields.length - 1)}>
            –
          </button>
        )}
      </div>
    </div>
  );
}
