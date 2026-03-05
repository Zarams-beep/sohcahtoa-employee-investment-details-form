import { useState, useCallback, forwardRef, useEffect } from "react";
import { useFormContext, Controller, useWatch } from "react-hook-form";
import { FullFormType } from "@/schema/formSchema";
import { CgAsterisk } from "react-icons/cg";
import { FaRegCalendarAlt } from "react-icons/fa";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import SignatureProp from "./SignatureUploaderBox";
import FileUploaderBox from "./FileUploaderBox";

const DateInput = forwardRef<
  HTMLButtonElement,
  { value?: string; onClick?: () => void; hasError?: boolean }
>(({ value, onClick, hasError }, ref) => (
  <button type="button" onClick={onClick} ref={ref}
    className={`date-input ${hasError ? "error-line" : ""}`}>
    <span>{value || "DD/MM/YYYY"}</span>
    <FaRegCalendarAlt />
  </button>
));
DateInput.displayName = "DateInput";

const formatDateToLocal = (date: Date): string => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
};

const parseLocalDate = (s: string): Date | null => {
  const parts = s.split("-").map(Number);
  if (parts.length !== 3 || parts.some(isNaN)) return null;
  const d = new Date(parts[0], parts[1] - 1, parts[2]);
  return isNaN(d.getTime()) ? null : d;
};

export default function SixthForm() {
  const [date, setDate] = useState<Date | null>(null);
  const [fileNames, setFileNames] = useState<Record<string, string | null>>({});

  const { register, control, setValue, formState: { errors } } = useFormContext<FullFormType>();
  const dateValue      = useWatch({ control, name: "date" });
  const convictedCrime = useWatch({ control, name: "convictedCrime" });

  // Default to today on mount
  useEffect(() => {
    const today = new Date();
    setValue("date", formatDateToLocal(today), { shouldValidate: true });
    setDate(today);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Keep picker in sync if value changes externally
  useEffect(() => {
    if (dateValue) {
      const parsed = parseLocalDate(dateValue);
      if (parsed) setDate(parsed);
    }
  }, [dateValue]);

  const handleFileChange = useCallback(
    (field: keyof FullFormType, file?: File) => {
      if (file) {
        setValue(field, file, { shouldTouch: true, shouldValidate: true });
        setFileNames((prev) => ({ ...prev, [field]: file.name }));
      } else {
        setFileNames((prev) => ({ ...prev, [field]: null }));
      }
    },
    [setValue]
  );

  return (
    <div className="form">
      <div className="overall-form-sub">
        {/* Convicted Crime */}
        <section className="sub-section-container">
          <h4>Convicted Crime <CgAsterisk className="star-icon" /></h4>
          <div className="radio-group">
            <label><input type="radio" value="Yes" {...register("convictedCrime")} /> Yes</label>
            <label><input type="radio" value="No"  {...register("convictedCrime")} /> No</label>
          </div>
          {errors.convictedCrime && <p className="error-message">{errors.convictedCrime.message}</p>}
        </section>

        {convictedCrime === "Yes" && (
          <section className="sub-section-container">
            <h4>If yes, give details</h4>
            <textarea {...register("ifOthers")} className={errors.ifOthers ? "error-line" : ""} />
            {errors.ifOthers && <p className="error-message">{errors.ifOthers.message}</p>}
          </section>
        )}

        {/* Date + Signature */}
        <section className="sub-section-container-1">
          <div className="sub-input-container-unique">
            <span className="sub-span">
              <h4>Date <CgAsterisk className="star-icon star-icon-2" /></h4>
              <Controller
                name="date"
                control={control}
                render={({ field }) => (
                  <DatePicker
                    selected={date}
                    onChange={(d: Date | null) => {
                      setDate(d);
                      field.onChange(d ? formatDateToLocal(d) : "");
                    }}
                    dateFormat="dd/MM/yyyy"
                    showPopperArrow={false}
                    showMonthDropdown
                    showYearDropdown
                    dropdownMode="select"
                    placeholderText="DD/MM/YYYY"
                    customInput={<DateInput hasError={!!errors.date} />}
                    calendarClassName="custom-calendar"
                    popperClassName="z-50"
                  />
                )}
              />
              {errors.date && <p className="error-message">{errors.date.message}</p>}
            </span>

            <span className="sub-span">
              <h4>Signature <CgAsterisk className="star-icon" /></h4>
              <Controller
                name="signature"
                control={control}
                render={({ field, fieldState }) => (
                  <SignatureProp
                    id="signature"
                    onSignatureChange={(val) => {
                      if (!val) field.onChange("");
                      else if (val.type === "typed")    field.onChange(val.value);
                      else if (val.type === "drawn")    field.onChange(val.value);
                      else if (val.type === "uploaded") field.onChange(val.value);
                    }}
                    hasError={!!fieldState.error}
                  />
                )}
              />
              {errors.signature && <p className="error-message">{errors.signature.message}</p>}
            </span>
          </div>
        </section>

        {/* Passport Upload */}
        <section className="sub-section-container">
          <h4>Upload Passport Photograph (jpg, jpeg) <CgAsterisk className="star-icon" /></h4>
          <Controller
            name="uploadPassport"
            control={control}
            render={({ field, fieldState }) => (
              <FileUploaderBox
                id="uploadPassport"
                hasError={!!fieldState.error}
                onFileSelect={(file) => {
                  if (!file) {
                    handleFileChange("uploadPassport", undefined);
                    field.onChange(null);
                    return;
                  }
                  handleFileChange("uploadPassport", file);
                  field.onChange(file);
                }}
              />
            )}
          />
          {errors.uploadPassport && <p className="error-message">{errors.uploadPassport.message}</p>}
        </section>
      </div>
    </div>
  );
}
