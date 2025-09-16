import { useFormContext } from "react-hook-form";
import DependentsTable2 from "./tablePropComponent2";
import DependentsTable3 from "./tablePropComponent3";
export default function FourthForm (){
    const {
        formState: { errors },
      } = useFormContext();
    return(
        <div className="form">
<div className="overall-form-sub">
    <DependentsTable2/>
    <DependentsTable3/>
</div>
            
        </div>
    )
}