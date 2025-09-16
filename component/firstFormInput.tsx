import { useState, forwardRef } from "react";
import { useFormContext, Controller, useWatch} from "react-hook-form";
import { FullFormType } from "@/schema/formSchema";
import { CgAsterisk } from "react-icons/cg";
import { FaRegCalendarAlt } from "react-icons/fa";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

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

export function FirstForm() {
  const [date, setDate] = useState<Date | null>(null);

  const {
    register,
    control,
    formState: { errors },
  } = useFormContext<FullFormType>();

  const contractType = useWatch({
    control,
    name:"contractType"
  })
  return (
    <div className="form">
      <div className="overall-form-sub">
        <div className="sub-input-container-unique">
        {/* Contract Type */}
        <section className="sub-section-container">
          <h4>
            Contract type <CgAsterisk className="star-icon" />
          </h4>
          <select {...register("contractType")}>
            <option value=""></option>
            {["Full Time", "Part Time", "Intern", "Other"].map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
          {errors.contractType && (
            <p className="error-message">{errors.contractType.message}</p>
          )}
        </section>

        {/* If Other */}
        {
          contractType === 'Other' &&
           <section className="sub-section-container">
          <h4>If Other, specify below</h4>
          <input
            {...register("ifOthers")}
            className={errors.ifOthers ? "error-line" : ""}
            type="text"
          />
          {errors.ifOthers && (
            <p className="error-message">{errors.ifOthers.message}</p>
          )}
        </section>
        }
       </div>

        {/* Name Section */}
        <section className="sub-section-container">
          <h4>
            Name <CgAsterisk className="star-icon" />
          </h4>
<div className="sub-input-container-unique-2">
  <span>
    <select {...register("title")} className={errors.title ? "error-line" : ""}>
      <option value=""></option>
      {["Mr.", "Mrs.", "Miss.", "Dr.", "Prof.", "Rev."].map((opt) => (
        <option key={opt} value={opt}>
          {opt}
        </option>
      ))}
    </select>
    {errors.title ? (
      <p className="error-message">{errors.title.message}</p>
    ) : (
      <h5>Title</h5>
    )}
  </span>

  <span>
    <input
      {...register("Surname")}
      placeholder=""
      className={errors.Surname ? "error-line" : ""}
      type="text"
    />
     {errors.Surname ? (
      <p className="error-message">{errors.Surname.message}</p>
    ) : (
      <h5>Surname</h5>
    )}
  </span>

  <span>
    <input
      {...register("firstName")}
      placeholder=""
      className={errors.firstName ? "error-line" : ""}
      type="text"
    />
         {errors.firstName ? (
      <p className="error-message">{errors.firstName.message}</p>
    ) : (
      <h5>First Name</h5>
    )}
  </span>

  <span>
    <input
      {...register("middleName")}
      placeholder=""
      className={errors.middleName ? "error-line" : ""}
      type="text"
    />
         {errors.middleName ? (
      <p className="error-message">{errors.middleName.message}</p>
    ) : (
      <h5>Middle Name</h5>
    )}
  </span>
</div>

        </section>

        {/* Maiden & Job Title */}
        <div className="sub-input-container-unique">
          <section className="sub-section-container">
            <h4>Maiden Name (if applicable)</h4>
            <input
              {...register("maidenName")}
              className={errors.maidenName ? "error-line" : ""}
              type="text"
            />
            {errors.maidenName && (
              <p className="error-message">{errors.maidenName.message}</p>
            )}
          </section>

          <section className="sub-section-container">
            <h4>
              Job Title <CgAsterisk className="star-icon" />
            </h4>
            <input
              {...register("jobTitle")}
              placeholder="Kindly Enter Your Job Title"
              className={errors.jobTitle ? "error-line" : ""}
              type="text"
            />
            {errors.jobTitle && (
              <p className="error-message">{errors.jobTitle.message}</p>
            )}
          </section>
        </div>

        {/* Department & Location */}
        <div className="sub-input-container-unique">
          <section className="sub-section-container">
            <h4>
              Department <CgAsterisk className="star-icon" />
            </h4>
            <input
              {...register("department")}
              placeholder="Kindly Enter Department"
              className={errors.department ? "error-line" : ""}
              type="text"
            />
            {errors.department && (
              <p className="error-message">{errors.department.message}</p>
            )}
          </section>

          <section className="sub-section-container">
            <h4>
              Location <CgAsterisk className="star-icon" />
            </h4>
            <input
              {...register("location")}
              placeholder="Kindly Enter Location"
              className={errors.location ? "error-line" : ""}
              type="text"
            />
            {errors.location && (
              <p className="error-message">{errors.location.message}</p>
            )}
          </section>
        </div>

        {/* Start Date */}
        <section className="sub-section-container">
          <h4>
            Start Date <CgAsterisk className="star-icon" />
          </h4>
          <Controller
            name="startDate"
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
                customInput={<DateInput hasError={!!errors.startDate} />}
                calendarClassName="custom-calendar"
                popperClassName="z-50"
              />
            )}
          />
          {errors.startDate && (
            <p className="error-message">{errors.startDate.message}</p>
          )}
        </section>

        {/* Address */}
        <section className="sub-section-container">
          <h4>
            Address <CgAsterisk className="star-icon" />
          </h4>
          <div className="sub-input-container">
            <span>
              <input
                {...register("currentAddress")}
                placeholder="Kindly Enter Current Address"
                className={errors.currentAddress ? "error-line" : ""}
                type="text"
              />
                 {errors.currentAddress ? (
      <p className="error-message">{errors.currentAddress.message}</p>
    ) : (
      <h5>Current Address</h5>
    )}
            </span>

            <span>
              <input
                {...register("permanentAddress")}
                placeholder="Kindly Enter Permanent Address"
                className={errors.permanentAddress ? "error-line" : ""}
                type="text"
              />
      {errors.permanentAddress ? (
      <p className="error-message">{errors.permanentAddress.message}</p>
    ) : (
      <h5>Permanent Address</h5>
    )}
            </span>
          </div>
        </section>

        {/* Email & Confirm Email */}
        <div className="sub-section-container">
          <h4>
            Email <CgAsterisk className="star-icon" />
          </h4>

<section className="sub-input-container-unique">
          <div className="sub-section-container">
            <input
              {...register("email")}
              placeholder="example@example.com"
              className={errors.email ? "error-line" : ""}
              type="text"
            />
            {errors.email && (
              <p className="error-message">{errors.email.message}</p>
            )}
          </div>

          <div className="sub-section-container">
            <input
              {...register("confirmEmail")}
              placeholder="Confirm Email Please"
              className={errors.confirmEmail ? "error-line" : ""}
              type="text"
            />
            {errors.confirmEmail && (
              <p className="error-message">{errors.confirmEmail.message}</p>
            )}
          </div></section>
        </div>

        {/* Phone Number */}
        <section className="sub-section-container">
          <h4>
            Phone Number <CgAsterisk className="star-icon" />
          </h4>
          <input
            {...register("phoneNo")}
            placeholder="(000)(0000)(0000)"
            className={errors.phoneNo ? "error-line" : ""}
            type="text"
          />
          {errors.phoneNo && (
            <p className="error-message">{errors.phoneNo.message}</p>
          )}
        </section>
      </div>
    </div>
  );
}
