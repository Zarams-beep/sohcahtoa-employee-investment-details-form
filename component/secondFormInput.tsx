"use client";
import { useState, forwardRef, useEffect } from "react";
import { useFormContext, Controller, useWatch } from "react-hook-form";
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
    <span>{value || "DD/MM/YYYY"}</span>
    <FaRegCalendarAlt />
  </button>
));
DateInput.displayName = "DateInput";

/**
 * Format a Date → YYYY-MM-DD using LOCAL year/month/day.
 * Never use .toISOString() — that converts to UTC first, which shifts
 * the date by 1 day for users in timezones like WAT (UTC+1).
 */
const formatDateToLocal = (date: Date): string => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
};

/**
 * Parse YYYY-MM-DD → Date in LOCAL timezone.
 * new Date("1990-05-15") parses as UTC midnight → wrong day in WAT.
 * new Date(1990, 4, 15) uses local time → correct.
 */
const parseLocalDate = (s: string): Date | null => {
  const parts = s.split("-").map(Number);
  if (parts.length !== 3 || parts.some(isNaN)) return null;
  const d = new Date(parts[0], parts[1] - 1, parts[2]);
  return isNaN(d.getTime()) ? null : d;
};

/** Calculate age from a stored YYYY-MM-DD string. */
const calculateAge = (dob: string): string => {
  const d = parseLocalDate(dob);
  if (!d) return "";
  const today = new Date();
  let age = today.getFullYear() - d.getFullYear();
  const notYet =
    today.getMonth() < d.getMonth() ||
    (today.getMonth() === d.getMonth() && today.getDate() < d.getDate());
  if (notYet) age--;
  return age >= 0 ? String(age) : "";
};

export function SecondForm() {
  const [dobDate, setDobDate] = useState<Date | null>(null);

  const {
    register,
    control,
    setValue,
    formState: { errors },
  } = useFormContext<FullFormType>();

  const dobValue      = useWatch({ control, name: "DOB" });
  const maritalStatus = useWatch({ control, name: "maritalStatus" });

  // Sync picker + auto-age whenever DOB value changes
  useEffect(() => {
    if (dobValue) {
      const parsed = parseLocalDate(dobValue);
      if (parsed) {
        setDobDate(parsed);
        setValue("age", calculateAge(dobValue), { shouldValidate: true });
      }
    }
  }, [dobValue, setValue]);

  return (
    <div className="form">
      <div className="overall-form-sub">
        <div className="sub-input-container-unique">

          {/* ── Date of Birth ── */}
          <section className="sub-section-container">
            <h4>Date of Birth <CgAsterisk className="star-icon" /></h4>
            <Controller
              name="DOB"
              control={control}
              render={({ field }) => (
                <DatePicker
                  selected={dobDate}
                  onChange={(d: Date | null) => {
                    setDobDate(d);
                    // Store as YYYY-MM-DD using local time — never UTC
                    field.onChange(d ? formatDateToLocal(d) : "");
                  }}
                  // No onChangeRaw — removed because its type signature changed
                  // in newer react-datepicker versions, causing TypeScript build
                  // errors. The Zod dateSchema handles format normalisation.
                  dateFormat="dd/MM/yyyy"
                  showPopperArrow={false}
                  showMonthDropdown
                  showYearDropdown
                  dropdownMode="select"
                  maxDate={new Date()}
                  minDate={new Date(1900, 0, 1)}
                  placeholderText="DD/MM/YYYY"
                  customInput={<DateInput hasError={!!errors.DOB} />}
                  calendarClassName="custom-calendar"
                  popperClassName="z-50"
                />
              )}
            />
            {errors.DOB && (
              <p className="error-message">{errors.DOB.message as string}</p>
            )}
          </section>

          {/* ── Age (auto-calculated, read-only) ── */}
          <section className="sub-section-container">
            <h4>Age <CgAsterisk className="star-icon" /></h4>
            <input
              {...register("age")}
              className={errors.age ? "error-line" : ""}
              type="number"
              readOnly
            />
            {errors.age && (
              <p className="error-message">{errors.age.message as string}</p>
            )}
          </section>
        </div>

        <div className="sub-input-container-unique">
          {/* Gender */}
          <section className="sub-section-container">
            <h4>Gender <CgAsterisk className="star-icon" /></h4>
            <select {...register("gender")}>
              <option value="">Please Select</option>
              {["Female", "Male"].map((opt) => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
            {errors.gender && <p className="error-message">{errors.gender.message as string}</p>}
          </section>

          {/* State of Origin */}
          <section className="sub-section-container">
            <h4>State of Origin <CgAsterisk className="star-icon" /></h4>
            <input {...register("stateOfOrigin")} className={errors.stateOfOrigin ? "error-line" : ""} />
            {errors.stateOfOrigin && <p className="error-message">{errors.stateOfOrigin.message as string}</p>}
          </section>
        </div>

        <div className="sub-input-container-unique">
          {/* LGA */}
          <section className="sub-section-container">
            <h4>Local Government Area <CgAsterisk className="star-icon" /></h4>
            <input {...register("LGA")} className={errors.LGA ? "error-line" : ""} />
            {errors.LGA && <p className="error-message">{errors.LGA.message as string}</p>}
          </section>

          {/* Marital Status */}
          <section className="sub-section-container">
            <h4>Marital Status <CgAsterisk className="star-icon" /></h4>
            <select {...register("maritalStatus")}>
              <option value="">Please Select</option>
              {["Single", "Married", "Divorced", "Separated", "Other"].map((opt) => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
            {errors.maritalStatus && <p className="error-message">{errors.maritalStatus.message as string}</p>}
          </section>
        </div>

        <div className="sub-input-container-unique">
          {maritalStatus === "Other" && (
            <section className="sub-section-container">
              <h4>Other, specify</h4>
              <input {...register("ifOthers")} className={errors.ifOthers ? "error-line" : ""} />
              {errors.ifOthers && <p className="error-message">{errors.ifOthers.message as string}</p>}
            </section>
          )}

          {/* Religion */}
          <section className="sub-section-container">
            <h4>Religion <CgAsterisk className="star-icon" /></h4>
            <select {...register("Religion")}>
              <option value="">Please Select</option>
              {["Christian", "Muslim", "Other"].map((opt) => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
            {errors.Religion && <p className="error-message">{errors.Religion.message as string}</p>}
          </section>
        </div>

        <div className="sub-input-container-unique">
          {/* Ethnicity */}
          <section className="sub-section-container">
            <h4>Ethnicity <CgAsterisk className="star-icon" /></h4>
            <input {...register("Ethnicity")} className={errors.Ethnicity ? "error-line" : ""} />
            {errors.Ethnicity && <p className="error-message">{errors.Ethnicity.message as string}</p>}
          </section>

          {/* NIN */}
          <section className="sub-section-container">
            <h4>National I.D. Number <CgAsterisk className="star-icon" /></h4>
            <input {...register("NIN")} className={errors.NIN ? "error-line" : ""} />
            {errors.NIN && <p className="error-message">{errors.NIN.message as string}</p>}
          </section>
        </div>

        {/* Physically Challenged */}
        <section className="sub-section-container">
          <h4>Physically Challenged <CgAsterisk className="star-icon" /></h4>
          <div className="radio-group">
            <label><input type="radio" value="Yes" {...register("PhysicallyChallenged")} /> Yes</label>
            <label><input type="radio" value="No"  {...register("PhysicallyChallenged")} /> No</label>
          </div>
          {errors.PhysicallyChallenged && <p className="error-message">{errors.PhysicallyChallenged.message as string}</p>}
        </section>

        {/* ── Father ── */}
        <section className="sub-section-container">
          <h4>Father's Name <CgAsterisk className="star-icon" /></h4>
          <div className="sub-input-container-unique-2">
            <span>
              <select {...register("titleFather")}>
                <option value=""></option>
                {["Mr.", "Mrs.", "Miss.", "Dr.", "Prof.", "Rev."].map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
              {errors.titleFather ? <p className="error-message">{errors.titleFather.message as string}</p> : <h5>Title</h5>}
            </span>
            <span>
              <input {...register("SurnameFather")} className={errors.SurnameFather ? "error-line" : ""} />
              {errors.SurnameFather ? <p className="error-message">{errors.SurnameFather.message as string}</p> : <h5>Surname</h5>}
            </span>
            <span>
              <input {...register("firstNameFather")} className={errors.firstNameFather ? "error-line" : ""} />
              {errors.firstNameFather ? <p className="error-message">{errors.firstNameFather.message as string}</p> : <h5>First Name</h5>}
            </span>
          </div>
        </section>
        <div className="sub-input-container-unique">
          <section className="sub-section-container">
            <h4>Address <CgAsterisk className="star-icon" /></h4>
            <input {...register("fatherAddress")} className={errors.fatherAddress ? "error-line" : ""} />
            {errors.fatherAddress && <p className="error-message">{errors.fatherAddress.message as string}</p>}
          </section>
          <section className="sub-section-container">
            <h4>Phone Number <CgAsterisk className="star-icon" /></h4>
            <input {...register("fatherPhoneNo")} className={errors.fatherPhoneNo ? "error-line" : ""} />
            {errors.fatherPhoneNo && <p className="error-message">{errors.fatherPhoneNo.message as string}</p>}
          </section>
        </div>

        {/* ── Mother ── */}
        <section className="sub-section-container">
          <h4>Mother's Name <CgAsterisk className="star-icon" /></h4>
          <div className="sub-input-container-unique-2">
            <span>
              <select {...register("titleMother")}>
                <option value=""></option>
                {["Mr.", "Mrs.", "Miss.", "Dr.", "Prof.", "Rev."].map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
              {errors.titleMother ? <p className="error-message">{errors.titleMother.message as string}</p> : <h5>Title</h5>}
            </span>
            <span>
              <input {...register("SurnameMother")} className={errors.SurnameMother ? "error-line" : ""} />
              {errors.SurnameMother ? <p className="error-message">{errors.SurnameMother.message as string}</p> : <h5>Surname</h5>}
            </span>
            <span>
              <input {...register("firstNameMother")} className={errors.firstNameMother ? "error-line" : ""} />
              {errors.firstNameMother ? <p className="error-message">{errors.firstNameMother.message as string}</p> : <h5>First Name</h5>}
            </span>
          </div>
        </section>
        <div className="sub-input-container-unique">
          <section className="sub-section-container">
            <h4>Address <CgAsterisk className="star-icon" /></h4>
            <input {...register("motherAddress")} className={errors.motherAddress ? "error-line" : ""} />
            {errors.motherAddress && <p className="error-message">{errors.motherAddress.message as string}</p>}
          </section>
          <section className="sub-section-container">
            <h4>Phone Number <CgAsterisk className="star-icon" /></h4>
            <input {...register("motherPhoneNo")} className={errors.motherPhoneNo ? "error-line" : ""} />
            {errors.motherPhoneNo && <p className="error-message">{errors.motherPhoneNo.message as string}</p>}
          </section>
        </div>

        {/* ── Spouse (only when Married) ── */}
        {maritalStatus === "Married" && (
          <>
            <section className="sub-section-container">
              <h4>Spouse's Name <CgAsterisk className="star-icon" /></h4>
              <div className="sub-input-container-unique-2">
                <span>
                  <select {...register("titleSpouse")}>
                    <option value=""></option>
                    {["Mr.", "Mrs.", "Miss.", "Dr.", "Prof.", "Rev."].map((opt) => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                  {errors.titleSpouse ? <p className="error-message">{errors.titleSpouse.message as string}</p> : <h5>Title</h5>}
                </span>
                <span>
                  <input {...register("SurnameSpouse")} className={errors.SurnameSpouse ? "error-line" : ""} />
                  {errors.SurnameSpouse ? <p className="error-message">{errors.SurnameSpouse.message as string}</p> : <h5>Surname</h5>}
                </span>
                <span>
                  <input {...register("firstNameSpouse")} className={errors.firstNameSpouse ? "error-line" : ""} />
                  {errors.firstNameSpouse ? <p className="error-message">{errors.firstNameSpouse.message as string}</p> : <h5>First Name</h5>}
                </span>
              </div>
            </section>
            <div className="sub-input-container-unique">
              <section className="sub-section-container">
                <h4>Address <CgAsterisk className="star-icon" /></h4>
                <input {...register("spouseAddress")} className={errors.spouseAddress ? "error-line" : ""} />
                {errors.spouseAddress && <p className="error-message">{errors.spouseAddress.message as string}</p>}
              </section>
              <section className="sub-section-container">
                <h4>Phone Number <CgAsterisk className="star-icon" /></h4>
                <input {...register("spousePhoneNo")} className={errors.spousePhoneNo ? "error-line" : ""} />
                {errors.spousePhoneNo && <p className="error-message">{errors.spousePhoneNo.message as string}</p>}
              </section>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
