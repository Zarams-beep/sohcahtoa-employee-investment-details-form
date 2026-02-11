import { useState, useCallback, forwardRef } from "react";
import { useFormContext, Controller, useWatch} from "react-hook-form";
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
  <button
    type="button"
    onClick={onClick}
    ref={ref}
    className={`date-input ${hasError ? "error-line" : ""}`}
  >
    <span>{value || "YYYY-MM-DD"}</span>
    <FaRegCalendarAlt />
  </button>
));
DateInput.displayName = "DateInput";

export default function SixthForm() {
  const [date, setDate] = useState<Date | null>(null);
  const [fileNames, setFileNames] = useState<Record<string, string | null>>({});

  const {
    register,
    control,
    setValue,
    formState: { errors },
  } = useFormContext<FullFormType>();

  const handleFileChange = useCallback(
    (field: keyof FullFormType, file?: File) => {
      if (file) {
        setValue(field, file, { shouldTouch: true, shouldValidate: true });
        setFileNames((prev) => ({
          ...prev,
          [field]: file.name,
        }));
      } else {
        setFileNames((prev) => ({
          ...prev,
          [field]: null,
        }));
      }
    },
    [setValue]
  );

  const convictedCrime = useWatch({
    control,
    name:"convictedCrime"
  })

  return (
    <div className="form">
      <div className="overall-form-sub">
        {/* convictedCrime */}
        <section className="sub-section-container">
          <h4>
            Convicted Crime <CgAsterisk className="star-icon" />
          </h4>
          <div className="radio-group">
            <label>
              <input type="radio" value="Yes" {...register("convictedCrime")} />
              Yes
            </label>
            <label>
              <input type="radio" value="No" {...register("convictedCrime")} />
              No
            </label>
          </div>
          {errors.convictedCrime && (
            <p className="error-message">{errors.convictedCrime.message}</p>
          )}
        </section>

{/* If Other */}
{
  convictedCrime === "Yes" &&
        <section className="sub-section-container">
          <h4>If yes, give details</h4>
          <textarea
            {...register("ifOthers")}
            className={errors.ifOthers ? "error-line" : ""}
          />
          {errors.ifOthers && (
            <p className="error-message">{errors.ifOthers.message}</p>
          )}
        </section>}

        {/* Date Picker + Signature */}
        <section className="sub-section-container-1">
          <div className="sub-input-container-unique">
            {/* Date */}
            <span className="sub-span">
              <h4>
                Date <CgAsterisk className="star-icon star-icon-2" />
              </h4>
              <Controller
                name="date"
                control={control}
                render={({ field }) => (
                  <DatePicker
                    selected={date}
                    onChange={(date: Date | null) => {
                      setDate(date);
                      field.onChange(date ? date.toISOString().split("T")[0] : "");
                    }}
                    onChangeRaw={(event) => {
                      if (event?.target instanceof HTMLInputElement) {
                        const manualValue = event.target.value.trim();
                        field.onChange(manualValue);
                        const parsedDate = new Date(manualValue);
                        if (!isNaN(parsedDate.getTime())) {
                          setDate(parsedDate);
                        }
                      }
                    }}
                    dateFormat="yyyy-MM-dd"
                    showPopperArrow={false}
                    showMonthDropdown
                    showYearDropdown
                    dropdownMode="select"
                    maxDate={new Date()}
                    minDate={new Date(1900, 0, 1)}
                    placeholderText="YYYY-MM-DD"
                    customInput={<DateInput hasError={!!errors.date} />}
                    calendarClassName="custom-calendar"
                    popperClassName="z-50"
                  />
                )}
              />
              {errors.date && (
                <p className="error-message">{errors.date.message}</p>
              )}
            </span>

            {/* Signature */}
            <span className="sub-span">
              <h4>
                Signature <CgAsterisk className="star-icon" />
              </h4>
              <Controller
                name="signature"
                control={control}
                render={({ field, fieldState }) => (
                  <SignatureProp
                    id="signature"
                    onSignatureChange={(val) => {
                      if (!val) {
                        field.onChange("");
                      } else if (val.type === "typed") {
                        field.onChange(val.value); // string
                      } else if (val.type === "drawn") {
                        field.onChange(val.value); // base64 string
                      } else if (val.type === "uploaded") {
                        field.onChange(val.value); // File
                      }
                    }}
                    hasError={!!fieldState.error}
                  />
                )}
              />
              {errors.signature && (
                <p className="error-message">{errors.signature.message}</p>
              )}
            </span>
          </div>
        </section>

        {/* File Upload */}
        <section className="sub-section-container">
          <h4>
            Upload Passport Photograph (jpg, jpeg){" "}
            <CgAsterisk className="star-icon" />
          </h4>
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
          {errors.uploadPassport && (
            <p className="error-message">{errors.uploadPassport.message}</p>
          )}
        </section>
      </div>
    </div>
  );
}
