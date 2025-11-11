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
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

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

     // NEW: Capture form as PDF
  const captureFormAsPDF = async (): Promise<string> => {
    try {
      // Get the form element
      const formElement = document.querySelector('.form-input-container') as HTMLElement;
      
      if (!formElement) {
        throw new Error("Form element not found");
      }

      // Capture as canvas
      const canvas = await html2canvas(formElement, {
        scale: 2, // Higher quality
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff'
      });

      // Convert canvas to image
      const imgData = canvas.toDataURL('image/png');
      
      // Create PDF
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'px',
        format: [canvas.width, canvas.height]
      });

      pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
      
      // Convert PDF to base64
      const pdfBase64 = pdf.output('dataurlstring');
      
      return pdfBase64;
    } catch (error) {
      console.error("Error capturing form as PDF:", error);
      throw error;
    }
  };

    // First step → show preview
  const handlePreview = (data: FullFormType) => {
    setFormData(data);
    setPreviewOpen(true);
  };

  // Final submit
  const finalSubmit = async (
    data: FullFormType,
    screenshot?: string | null    
  ) => {
    setLoading(true);
    try {
      // Capture form as PDF before submitting
      const formPDF = await captureFormAsPDF();

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
      submissionData.formPDF = formPDF;
      
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
