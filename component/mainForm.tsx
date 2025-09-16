"use client";

import { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { IoMdArrowDropleftCircle, IoMdArrowDropdownCircle } from "react-icons/io";
import { FullFormType, fullFormSchema } from "@/schema/formSchema";
import PreviewModal from "./agreementModel";
import { FirstForm } from "./firstFormInput";
import { SecondForm } from "./secondFormInput";
import { ThirdForm } from "./ThirdForm";
import FourthForm from "./FourthForm";
import FifthForm from "./FifthForm";
import SixthForm from "./SixthForm";
import { motion } from "framer-motion";

export default function ParentForm() {
  const [expanded, setExpanded] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [formData, setFormData] = useState<FullFormType | null>(null);

  const router = useRouter();

  const methods = useForm<FullFormType>({
    resolver: zodResolver(fullFormSchema),
    mode: "onChange",
  });

  const { handleSubmit } = methods;

  // ⬇️ Toggle expand/collapse
  const toggleSection = (section: string) => {
    setExpanded(expanded === section ? null : section);
  };

  const fileToBase64 = (file: File) =>
    new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (err) => reject(err);
    });

    // 1️⃣ First step → show preview
  const handlePreview = (data: FullFormType) => {
    setFormData(data);
    setPreviewOpen(true);
  };

  // 2️⃣ Final submit
  const finalSubmit = async (
    data: FullFormType,
    screenshot?: string | null    
  ) => {
    setLoading(true);
    try {
      // Convert files → base64
      const entries = await Promise.all(
        Object.entries(data).map(async ([key, value]) => {
          if (value instanceof File) {
            const base64 = await fileToBase64(value);
            return [key, base64];
          }
          return [key, value];
        })
      );

      const submissionData: any = Object.fromEntries(entries);

      if (screenshot) {
        submissionData.agreementScreenshot = screenshot;
      }

      const res = await fetch("/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(submissionData),
      });

      const result = await res.json();

      if (res.ok && result.success) {
        router.push(
          `/thank-you?name=${encodeURIComponent(data.firstName)}`
        );
      } else {
        alert(result.error || result.message || "Submission failed.");
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong submitting form.");
    } finally {
      setLoading(false);
      setPreviewOpen(false);
    }
  };


  const sections = [
  { id: "A", title: "PART A: PROFILE DETAILS (Kindly complete the details below accurately)", Component: FirstForm },
  { id: "B", title: "PART B: BIODATA (Kindly complete the details below accurately)", Component: SecondForm },
  { id: "C", title: "PART C: DEPENDENT/NEXT OF KIN/EMERGENCY CONTACT DETAILS (Kindly complete the details below accurately)", Component: ThirdForm },
  { id: "D", title: "PART D: EDUCATION/PROFESSIONAL TRAINING HISTORY (Kindly complete the details below accurately)", Component: FourthForm },
  { id: "E", title: "PART E: EMPLOYMENT HISTORY/PENSION AND BANK DETAILS (Kindly complete the details below accurately)", Component: FifthForm },
  { id: "F", title: "PART F: OTHER CIVIC DETAILS/SIGNATURE/DATE/PASSPORT PHOTOGRAPH (Kindly complete the details below accurately)", Component: SixthForm },
];


  return (
    <FormProvider {...methods}>
      <form
        onSubmit={handleSubmit(handlePreview, (errors) => {
          console.error("Validation errors:", errors);
          alert("Some fields are missing or invalid. Check console.");
        })}
        className=""
      >
        {sections.map(({ id, title, Component }) => (
          <div key={id} className="first-main-form-container">
            <button
              type="button"
              onClick={() => toggleSection(id)}
              className="main-form-btn"
            >
              <span>{title}</span>
              {expanded === id ? (
                <IoMdArrowDropdownCircle className="arrow-form-icon" />
              ) : (
                <IoMdArrowDropleftCircle className="arrow-form-icon" />
              )}
            </button>

            {expanded === id && (
              <div className="p-4">
                <Component />
              </div>
            )}
          </div>
        ))}

        <motion.button
                type="submit"
                disabled={loading}
                className={`submit-button ${
                  loading ? "opacity-50 cursor-not-allowed" : ""
                }`}
                whileHover={{ scale: !loading ? 1.02 : 1 }}
                whileTap={{ scale: 0.98 }}
              >
                {loading ? "Sending..." : "Submit"}
              </motion.button>
      </form>

      <PreviewModal
        isOpen={previewOpen}
        onClose={() => setPreviewOpen(false)}
        onConfirm={(screenshot: string | null) =>
          formData && finalSubmit(formData, screenshot)
        }
        data={formData || {}}
      />
    </FormProvider>
  );
}
