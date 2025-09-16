import { useState, forwardRef } from "react";
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
    <span>{value || "YYYY-MM-DD"}</span>
    <FaRegCalendarAlt />
  </button>
));
DateInput.displayName = "DateInput";

export function SecondForm() {
  const [date, setDate] = useState<Date | null>(null);

  const {
    register,
    control,
    formState: { errors },
  } = useFormContext<FullFormType>();

    const maritalStatus = useWatch({
    control,
    name: "maritalStatus",
  });

  return (
    <div className="form">
      <div className="overall-form-sub">
        <div className="sub-input-container-unique">
          {/* Date of Birth */}
          <section className="sub-section-container">
            <h4>
              Date of Birth <CgAsterisk className="star-icon" />
            </h4>
            <Controller
              name="DOB"
              control={control}
              render={({ field }) => (
                <DatePicker
                  selected={date}
                  onChange={(date: Date | null) => {
                    setDate(date);
                    field.onChange(
                      date ? date.toISOString().split("T")[0] : ""
                    );
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
                  customInput={<DateInput hasError={!!errors.DOB} />}
                  calendarClassName="custom-calendar"
                  popperClassName="z-50"
                />
              )}
            />
            {errors.DOB && (
              <p className="error-message">{errors.DOB.message}</p>
            )}
          </section>

          {/* Age */}
          <section className="sub-section-container">
            <h4>
              Age <CgAsterisk className="star-icon" />
            </h4>
            <input
              {...register("age")}
              className={errors.age ? "error-line" : ""}
              type="number"
            />
            {errors.age && (
              <p className="error-message">{errors.age.message}</p>
            )}
          </section>
        </div>

        <div className="sub-input-container-unique">
          {/* Gender */}
          <section className="sub-section-container">
            <h4>
              Gender <CgAsterisk className="star-icon" />
            </h4>
            <select {...register("gender")}>
              <option value="">Please Select</option>
              {["Female", "Male"].map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
            {errors.gender && (
              <p className="error-message">{errors.gender.message}</p>
            )}
          </section>

          {/* State of Origin */}
          <section className="sub-section-container">
            <h4>
              State of Origin{" "}
                <CgAsterisk className="star-icon" />
            </h4>
            <input
              {...register("stateOfOrigin")}
              className={errors.stateOfOrigin ? "error-line" : ""}
            />
            {errors.stateOfOrigin && (
              <p className="error-message">{errors.stateOfOrigin.message}</p>
            )}
          </section>
        </div>

        <div className="sub-input-container-unique">
          {/* Local Government Area */}
          <section className="sub-section-container">
              <h4>
                Local Government Area{" "}
                <CgAsterisk className="star-icon" />
            </h4>
            <input
              {...register("LGA")}
              className={errors.LGA ? "error-line" : ""}
            />
            {errors.LGA && (
              <p className="error-message">{errors.LGA.message}</p>
            )}
          </section>

          {/* maritalStatus */}
          <section className="sub-section-container">
            <h4>
              Marital Status <CgAsterisk className="star-icon" />
            </h4>
            <select {...register("maritalStatus")}>
              <option value="">Please Select</option>
              {["Single", "Married", "Divorced", "Separated", "Other"].map(
                (opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                )
              )}
            </select>
            {errors.maritalStatus && (
              <p className="error-message">{errors.maritalStatus.message}</p>
            )}
          </section>
        </div>

        <div className="sub-input-container-unique">
          {/* ifOthers */}

          {maritalStatus === "Other" &&
          <section className="sub-section-container">
            <h4>Other, specify</h4>
            <input
              {...register("ifOthers")}
              className={errors.ifOthers ? "error-line" : ""}
            />
            {errors.ifOthers && (
              <p className="error-message">{errors.ifOthers.message}</p>
            )}
          </section>}

          {/* Religion */}
          <section className="sub-section-container">
            <h4>
              Religion <CgAsterisk className="star-icon" />
            </h4>
            <select {...register("Religion")}>
              <option value="">Please Select</option>
              {["Christian", "Muslim", "Other"].map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
            {errors.Religion && (
              <p className="error-message">{errors.Religion.message}</p>
            )}
          </section>
        </div>

        <div className="sub-input-container-unique">
          {/* Ethnicity */}
          <section className="sub-section-container">
            <h4>
              Ethnicity <CgAsterisk className="star-icon" />
            </h4>
            <input
              {...register("Ethnicity")}
              placeholder=""
              className={errors.Ethnicity ? "error-line" : ""}
            />
            {errors.Ethnicity && (
              <p className="error-message">{errors.Ethnicity.message}</p>
            )}
          </section>

          {/* National I.D. Number */}
          <section className="sub-section-container">
            <h4>
              National I.D. Number <CgAsterisk className="star-icon" />
            </h4>
            <input
              {...register("NIN")}
              placeholder=""
              className={errors.NIN ? "error-line" : ""}
            />
            {errors.NIN && (
              <p className="error-message">{errors.NIN.message}</p>
            )}
          </section>
        </div>

        {/* Physically Challenged */}
        <section className="sub-section-container">
          <h4>
            Physically Challenged <CgAsterisk className="star-icon" />
          </h4>
          <div className="radio-group">
            <label>
              <input
                type="radio"
                value="Yes"
                {...register("PhysicallyChallenged")}
              />
              Yes
            </label>
            <label>
              <input
                type="radio"
                value="No"
                {...register("PhysicallyChallenged")}
              />
              No
            </label>
          </div>
          {errors.PhysicallyChallenged && (
            <p className="error-message">
              {errors.PhysicallyChallenged.message}
            </p>
          )}
        </section>

        {/*Father's Section */}
        <section className="sub-section-container">
          <h4>
            Father's Name <CgAsterisk className="star-icon" />
          </h4>
          <div className="sub-input-container-unique-2">
            <span>
              <select {...register("titleFather")}>
                <option value=""></option>
                {["Mr.", "Mrs.", "Miss.", "Dr.", "Prof.", "Rev."].map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
              {errors.titleFather ? (
                <p className="error-message">{errors.titleFather.message}</p>
              ) : (
                <h5>Title</h5>
              )}
            </span>

            <span>
              <input
                {...register("SurnameFather")}
                placeholder=""
                className={errors.SurnameFather ? "error-line" : ""}
              />
              {errors.SurnameFather ? (
                <p className="error-message">{errors.SurnameFather.message}</p>
              ) : (
                <h5>Surname</h5>
              )}
            </span>

            <span>
              <input
                {...register("firstNameFather")}
                placeholder=""
                className={errors.firstNameFather ? "error-line" : ""}
              />
              {errors.firstNameFather ? (
                <p className="error-message">
                  {errors.firstNameFather.message}
                </p>
              ) : (
                <h5>First Name</h5>
              )}
            </span>
          </div>
        </section>

        <div className="sub-input-container-unique">
          {/* fatherAddress */}
          <section className="sub-section-container">
            <h4>
              Address <CgAsterisk className="star-icon" />
            </h4>
            <input
              {...register("fatherAddress")}
              placeholder=""
              className={errors.fatherAddress ? "error-line" : ""}
            />
            {errors.fatherAddress && (
              <p className="error-message">{errors.fatherAddress.message}</p>
            )}
          </section>

          {/* fatherPhoneNo */}
          <section className="sub-section-container">
            <h4>
              Phone Number <CgAsterisk className="star-icon" />
            </h4>
            <input
              {...register("fatherPhoneNo")}
              placeholder=""
              className={errors.fatherPhoneNo ? "error-line" : ""}
            />
            {errors.fatherPhoneNo && (
              <p className="error-message">{errors.fatherPhoneNo.message}</p>
            )}
          </section>
        </div>

        {/* mother details section */}
        <section className="sub-section-container">
          <h4>
            Mother's Name <CgAsterisk className="star-icon" />
          </h4>
          <div className="sub-input-container-unique-2">
            <span>
              <select {...register("titleMother")}>
                <option value=""></option>
                {["Mr.", "Mrs.", "Miss.", "Dr.", "Prof.", "Rev."].map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
              {errors.titleMother ? (
                <p className="error-message">{errors.titleMother.message}</p>
              ) : (
                <h5>Title</h5>
              )}
            </span>

            <span>
              <input
                {...register("SurnameMother")}
                placeholder=""
                className={errors.SurnameMother ? "error-line" : ""}
              />
              {errors.SurnameMother ? (
                <p className="error-message">{errors.SurnameMother.message}</p>
              ) : (
                <h5>Surname</h5>
              )}
            </span>

            <span>
              <input
                {...register("firstNameMother")}
                placeholder=""
                className={errors.firstNameMother ? "error-line" : ""}
              />
              {errors.firstNameMother ? (
                <p className="error-message">
                  {errors.firstNameMother.message}
                </p>
              ) : (
                <h5>First Name</h5>
              )}
            </span>
          </div>
        </section>

        <div className="sub-input-container-unique">
          {/* motherAddress */}
          <section className="sub-section-container">
            <h4>
              Address <CgAsterisk className="star-icon" />
            </h4>
            <input
              {...register("motherAddress")}
              placeholder=""
              className={errors.motherAddress ? "error-line" : ""}
            />
            {errors.motherAddress && (
              <p className="error-message">{errors.motherAddress.message}</p>
            )}
          </section>

          {/* motherPhoneNo */}
          <section className="sub-section-container">
            <h4>
              Phone Number <CgAsterisk className="star-icon" />
            </h4>
            <input
              {...register("motherPhoneNo")}
              placeholder=""
              className={errors.motherPhoneNo ? "error-line" : ""}
            />
            {errors.motherPhoneNo && (
              <p className="error-message">{errors.motherPhoneNo.message}</p>
            )}
          </section>

          {/* spouse details section */}
        </div>

{maritalStatus==='Married' &&
(
  <>
   {/* spouse details section */}
        <section className="sub-section-container">
          <h4>
            Spouse's Name <CgAsterisk className="star-icon" />
          </h4>
          <div className="sub-input-container-unique-2">
            <span>
              <select {...register("titleSpouse")}>
                <option value=""></option>
                {["Mr.", "Mrs.", "Miss.", "Dr.", "Prof.", "Rev."].map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
              {errors.titleSpouse ? (
                <p className="error-message">{errors.titleSpouse.message}</p>
              ) : (
                <h5>Title</h5>
              )}
            </span>

            <span>
              <input
                {...register("SurnameSpouse")}
                placeholder=""
                className={errors.SurnameSpouse ? "error-line" : ""}
              />
              {errors.SurnameSpouse ? (
                <p className="error-message">{errors.SurnameSpouse.message}</p>
              ) : (
                <h5>Surname</h5>
              )}
            </span>

            <span>
              <input
                {...register("firstNameSpouse")}
                placeholder=""
                className={errors.firstNameSpouse ? "error-line" : ""}
              />
              {errors.firstNameSpouse ? (
                <p className="error-message">
                  {errors.firstNameSpouse.message}
                </p>
              ) : (
                <h5>First Name</h5>
              )}
            </span>
          </div>
        </section>

        <div className="sub-input-container-unique">
          {/* spouseAddress */}
          <section className="sub-section-container">
            <h4>
              Address <CgAsterisk className="star-icon" />
            </h4>
            <input
              {...register("spouseAddress")}
              placeholder=""
              className={errors.spouseAddress ? "error-line" : ""}
            />
            {errors.spouseAddress && (
              <p className="error-message">{errors.spouseAddress.message}</p>
            )}
          </section>

          {/* spousePhoneNo */}
          <section className="sub-section-container">
            <h4>
              Phone Number <CgAsterisk className="star-icon" />
            </h4>
            <input
              {...register("spousePhoneNo")}
              placeholder=""
              className={errors.spousePhoneNo ? "error-line" : ""}
            />
            {errors.spousePhoneNo && (
              <p className="error-message">{errors.spousePhoneNo.message}</p>
            )}
          </section>
        </div>
  </>
)       
}
      </div>
    </div>
  );
}
