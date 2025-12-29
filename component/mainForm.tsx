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
import PDFTemplate from "./pdfForm";

export default function ParentForm() {
  const [expanded, setExpanded] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [formData, setFormData] = useState<FullFormType | null>(null);
  const [showPDFTemplate, setShowPDFTemplate] = useState(false);

  const router = useRouter();

  const methods = useForm<FullFormType>({
    resolver: zodResolver(fullFormSchema),
    mode: "onChange",
  });

  const { handleSubmit } = methods;

  // Toggle expand/collapse
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

  // First step → show preview
  const handlePreview = (data: FullFormType) => {
    setFormData(data);
    setPreviewOpen(true);
  };

  const captureFormAsPDF = async (): Promise<string> => {
    try {
      if (!formData) {
        throw new Error("Form data not found");
      }

      // Show the PDF template
      setShowPDFTemplate(true);
      
      // Wait longer for render + images to load
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Get the PDF template element
      const pdfElement = document.getElementById('pdf-template');
      if (!pdfElement) {
        throw new Error("PDF template not found");
      }

      // Capture the entire PDF template
      const canvas = await html2canvas(pdfElement, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
        allowTaint: true,
        foreignObjectRendering: false,
        imageTimeout: 15000,
        onclone: (clonedDoc) => {
          const clonedElement = clonedDoc.getElementById('pdf-template');
          if (clonedElement) {
            clonedElement.style.display = 'block';
          }
        }
      });

      // Hide the template
      setShowPDFTemplate(false);

      // Create PDF
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      const imgData = canvas.toDataURL('image/jpeg', 0.85);
      const pageWidth = 210; // A4 width in mm
      const pageHeight = 297; // A4 height in mm
      const imgWidth = pageWidth;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      let heightLeft = imgHeight;
      let position = 0;

      // Add first page
      pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      // Add additional pages if content is longer than one page
      while (heightLeft > 0) {
        position = -pageHeight * Math.ceil((imgHeight - heightLeft) / pageHeight);
        pdf.addPage();
        pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      // Convert PDF to base64
      const pdfBase64 = pdf.output('dataurlstring');
      return pdfBase64;
      
    } catch (error) {
      setShowPDFTemplate(false);
      console.error('PDF generation error:', error);
      throw error;
    }
  };

  // Final submit
  const finalSubmit = async (
    data: FullFormType,
    screenshot?: string | null    
  ) => {
    setLoading(true);
    try {
      // Generate PDF
      const formPDF = await captureFormAsPDF();

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

      // Add screenshot if available
      if (screenshot) {
        submissionData.agreementScreenshot = screenshot;
      }

      // FIXED: Add the PDF to submission data
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
      {showPDFTemplate && formData && (
        <div style={{ 
          position: 'fixed', 
          top: 0, 
          left: '-9999px', // Hide offscreen instead of overlay
          width: '210mm', // A4 width
          backgroundColor: 'white',
          zIndex: 9999
        }}>
          <PDFTemplate data={formData} />
        </div>
      )}

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