"use client";
import "@/styles/form.css";
import { useSearchParams, useRouter } from "next/navigation";
import { useState } from "react";

export default function ThankYouPage() {
  const params = useSearchParams();
  const name = params.get("name");
  const router = useRouter();
  const [answered, setAnswered] = useState(false);

  return (
    <div className="form-container thank-you-container">
      <h1 className="">
        Thank you {name ? name : ""} for your submission! 🎉
      </h1>

      {!answered ? (
        <>
          <p className="">
            We’ve received your form. Would you like to fill out another form?
          </p>
          <div className="thank-you-sub-container">
            <button
              onClick={() => router.push("/")} // Change to your form route
              className=""
            >
              Yes, take me to the form
            </button>
            <button
              onClick={() => setAnswered(true)}
              className=""
            >
              No, maybe later
            </button>
          </div>
        </>
      ) : (
        <p className="">
          Alright, thank you again! Have a great day. 🌟
        </p>
      )}
    </div>
  );
}
