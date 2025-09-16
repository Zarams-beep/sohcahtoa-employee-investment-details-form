import { useFormContext } from "react-hook-form";
import { FifthStageType } from "@/schema/formSchema";
import { CgAsterisk } from "react-icons/cg";
import DependentsTable4 from "./tablePropComponent4";
import DependentsTable5 from "./tablePropComponent5";
export default function FifthForm (){
    const {
        register,
        formState: { errors },
      } = useFormContext<FifthStageType>();
    return(
        <div className="form">
     <div className="overall-form-sub">
        <DependentsTable4/>
        <DependentsTable5/>

        {/* pension */}
        <div className="sub-input-container-unique">
                  <section className="sub-section-container">
                    <h4>Pension Fund Administrator <CgAsterisk className="star-icon" /></h4>
                    <input
                      {...register("pensionFund")}
                      className={errors.pensionFund ? "error-line" : ""}
                    />
                    {errors.pensionFund && (
                      <p className="error-message">{errors.pensionFund.message}</p>
                    )}
                  </section>
        
                  <section className="sub-section-container">
                    <h4>
                      Pension Pin <CgAsterisk className="star-icon" />
                    </h4>
                    <input
                      {...register("pensionPin")}
                      className={errors.pensionPin ? "error-line" : ""}
                    />
                    {errors.pensionPin && (
                      <p className="error-message">{errors.pensionPin.message}</p>
                    )}
                  </section>
                </div>

                {/* bank */}
                <div className="sub-input-container-unique">
                  <section className="sub-section-container">
                    <h4>Bank Name <CgAsterisk className="star-icon" /></h4>
                    <input
                      {...register("bankName")}
                      className={errors.bankName ? "error-line" : ""}
                      type="text"
                    />
                    {errors.bankName && (
                      <p className="error-message">{errors.bankName.message}</p>
                    )}
                  </section>
        
                  <section className="sub-section-container">
                    <h4>
                      Account Name <CgAsterisk className="star-icon" />
                    </h4>
                    <input
                      {...register("accountName")}
                      className={errors.accountName ? "error-line" : ""}
                      type="text"
                    />
                    {errors.accountName && (
                      <p className="error-message">{errors.accountName.message}</p>
                    )}
                  </section>
                </div>

                <section className="sub-section-container">
                    <h4>
                      Account Number <CgAsterisk className="star-icon" />
                    </h4>
                    <input
                      {...register("accountNumber")}
                      className={errors.accountNumber ? "error-line" : ""}
                      type="text"
                    />
                    {errors.accountNumber && (
                      <p className="error-message">{errors.accountNumber.message}</p>
                    )}
                  </section>
        </div></div>
    )
}