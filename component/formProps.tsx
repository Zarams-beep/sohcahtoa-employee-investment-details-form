import "@/styles/form.css";
import Image from "next/image";
import ParentForm from "./mainForm";
export default function FormProps (){
    return(
        <div className="form-container">
            <header className="header-1">
                <div className="img-container">
                <Image src="/SIL logo.689b601bda7341.19720820.png" alt="SIL logo.689b601bda7341.19720820" width={100} height={100} priority/>
            </div>
            <h1>SOHCAHTOA INVESTMENTS LIMITED - EMPLOYEE DETAILS FORM</h1>
            </header>
            <div className="">
                <ParentForm/>
            </div>
        </div>
    )
}
