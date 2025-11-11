import { motion, AnimatePresence } from "framer-motion";
import html2canvas from "html2canvas";

const captureAgreement = async (): Promise<string | null> => {
  const element = document.getElementById("agreement-section");
  if (!element) return null;

  const canvas = await html2canvas(element, { scale: 2 });
  return canvas.toDataURL("image/png");
};

export default function PreviewModal({
  isOpen,
  onClose,
  onConfirm,
  data,
}: any) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="modal-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="signature-modal"
            id="agreement-section"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
          >
            <header className="modal-header">
              <h2 className="">Preview Sign Document</h2>
              <button onClick={onClose} className="">
                ✕
              </button>
            </header>

            <div className="sub-modal-overlay">
              <h3 className="">
                SOHCAHTOA INVESTMENT LIMITED - NON-COMPETE AND
                NON-CIRCUMVENTION AGREEMENT
              </h3>
              <p>
                <strong>Name:</strong> {data.firstName} {data.Surname}
              </p>
              <p>
                <strong>Date:</strong> {data.date}
              </p>
              <p>
                <strong>Signature:</strong>
              </p>
              {data.signature && (
  <div>
    {/* Case 1: Base64 string */}
    {typeof data.signature === "string" && data.signature.startsWith("data:") ? (
      <img
        src={data.signature}
        alt="Signature"
        className="h-20 object-contain"
      />
    ) 
    // Case 2: Plain text initials
    : typeof data.signature === "string" ? (
      <span>{data.signature}</span>
    ) 
    // Case 3: File upload
    : data.signature instanceof File ? (
      <img
        src={URL.createObjectURL(data.signature)}
        alt="Signature file"
        className="h-20 object-contain"
      />
    ) 
    : null}
  </div>
)}

            </div>

            <p className="understand">
              I understand and accept that my electronic signature will be as
              valid as a handwritten signature and considered original to the
              extent allowed by applicable law.
            </p>

            <button
              onClick={async () => {
                const screenshot = await captureAgreement();
                if (screenshot) {
      onConfirm(screenshot);
    }
    onClose();
              }}
              className="confirm"
            >
              Sign Document
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
