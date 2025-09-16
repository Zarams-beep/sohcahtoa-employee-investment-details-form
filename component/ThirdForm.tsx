import { useFormContext } from "react-hook-form";
import { ThirdStageType } from "@/schema/formSchema";
import { CgAsterisk } from "react-icons/cg";
import DependentsTable from "./tablePropComponent";

export function ThirdForm() {
  const {
    register,
    formState: { errors },
  } = useFormContext<ThirdStageType>();

  return (
    <div className="form">
      <div className="overall-form-sub">
        <DependentsTable />

        {/*Next of Kin's Section */}
        <section className="sub-section-container">
          <h4>
            Next of Kin <CgAsterisk className="star-icon" />
          </h4>
          <div className="sub-input-container-unique-2">
            <span>
              <select {...register("titleKin")}>
                <option value=""></option>
                {["Mr.", "Mrs.", "Miss.", "Dr.", "Prof.", "Rev."].map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
              {errors.titleKin ? (
                <p className="error-message">{errors.titleKin.message}</p>
              ) : (
                <h5>Title</h5>
              )}
            </span>

            <span>
              <input
                {...register("SurnameKin")}
                placeholder=""
                className={errors.SurnameKin ? "error-line" : ""}
                type="text"
              />
              {errors.SurnameKin ? (
                <p className="error-message">{errors.SurnameKin.message}</p>
              ) : (
                <h5>Surname</h5>
              )}
            </span>

            <span>
              <input
                {...register("firstNameKin")}
                placeholder=""
                className={errors.firstNameKin ? "error-line" : ""}
                type="text"
              />
              {errors.firstNameKin ? (
                <p className="error-message">{errors.firstNameKin.message}</p>
              ) : (
                <h5>First Name</h5>
              )}
            </span>
          </div>
        </section>

        <div className="sub-input-container-unique">
          {/* Next of Kin's Relationship */}
          <section className="sub-section-container">
            <h4>
              Relationship <CgAsterisk className="star-icon" />
            </h4>
            <input
              {...register("relationshipKin")}
              placeholder=""
              className={errors.relationshipKin ? "error-line" : ""}
              type="text"
            />
            {errors.relationshipKin && (
              <p className="error-message">{errors.relationshipKin.message}</p>
            )}
          </section>

          {/* fatherPhoneNo */}
          <section className="sub-section-container">
            <h4>
              Phone Number <CgAsterisk className="star-icon" />
            </h4>
            <input
              {...register("kinPhoneNo")}
              placeholder=""
              className={errors.kinPhoneNo ? "error-line" : ""}
              type="number"
            />
            {errors.kinPhoneNo && (
              <p className="error-message">{errors.kinPhoneNo.message}</p>
            )}
          </section>
        </div>

        {/* Next of Kin's Address */}
        <section className="sub-section-container">
          <h4>
            Address <CgAsterisk className="star-icon" />
          </h4>
          <span>
            <input
              {...register("kinAddress")}
              placeholder=""
              className={errors.kinAddress ? "error-line" : ""}
              type="text"
            />
            {errors.kinAddress ? (
      <p className="error-message">{errors.kinAddress.message}</p>
    ) : (
      <h5>Street Address</h5>
    )}
          </span>
        </section>

        {/* Emergency Section */}

        <section className="sub-section-container">
          <h4>
            Emergency Contact <CgAsterisk className="star-icon" />
          </h4>
          <div className="sub-input-container-unique-2">
            <span>
              <select {...register("titleEmergency")}>
                <option value=""></option>
                {["Mr.", "Mrs.", "Miss.", "Dr.", "Prof.", "Rev."].map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
              {errors.titleEmergency ? (
                <p className="error-message">{errors.titleEmergency.message}</p>
              ) : (
                <h5>Title</h5>
              )}
            </span>

            <span>
              <input
                {...register("SurnameEmergency")}
                placeholder=""
                className={errors.SurnameEmergency ? "error-line" : ""}
                type="text"
              />
              {errors.SurnameEmergency ? (
                <p className="error-message">
                  {errors.SurnameEmergency.message}
                </p>
              ) : (
                <h5>Surname</h5>
              )}
            </span>

            <span>
              <input
                {...register("firstNameEmergency")}
                placeholder=""
                className={errors.firstNameEmergency ? "error-line" : ""}
                type="text"
              />
              {errors.firstNameEmergency ? (
                <p className="error-message">
                  {errors.firstNameEmergency.message}
                </p>
              ) : (
                <h5>First Name</h5>
              )}
            </span>
          </div>
        </section>

        <div className="sub-input-container-unique">
          {/* Emergency's Relationship */}
          <section className="sub-section-container">
            <h4>
              Relationship <CgAsterisk className="star-icon" />
            </h4>
            <input
              {...register("relationshipEmergency")}
              placeholder=""
              className={errors.relationshipEmergency ? "error-line" : ""}
              type="text"
            />
            {errors.relationshipEmergency && (
              <p className="error-message">
                {errors.relationshipEmergency.message}
              </p>
            )}
          </section>

          {/* emergencyPhoneNo */}
          <section className="sub-section-container">
            <h4>
              Phone Number <CgAsterisk className="star-icon" />
            </h4>
            <input
              {...register("emergencyPhoneNo")}
              placeholder=""
              className={errors.emergencyPhoneNo ? "error-line" : ""}
              type="number"
            />
            {errors.emergencyPhoneNo && (
              <p className="error-message">{errors.emergencyPhoneNo.message}</p>
            )}
          </section>
        </div>

        {/* fatherAddress */}
        <section className="sub-section-container">
          <h4>
            Address <CgAsterisk className="star-icon" />
          </h4>
          <input
            {...register("emergencyAddress")}
            placeholder=""
            className={errors.emergencyAddress ? "error-line" : ""}
            type="text"
          />
          {errors.emergencyAddress && (
            <p className="error-message">{errors.emergencyAddress.message}</p>
          )}
        </section>
      </div>
    </div>
  );
}
