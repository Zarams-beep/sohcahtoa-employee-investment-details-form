import { useState, useRef, useCallback } from "react";
import SignatureCanvas from "react-signature-canvas";
import { FiTrash2, FiEdit2 } from "react-icons/fi";
import { AiFillSignature } from "react-icons/ai";
import { FaCircle } from "react-icons/fa6";

type SignatureValue =
  | { type: "typed"; value: string }
  | { type: "drawn"; value: string } // base64 string
  | { type: "uploaded"; value: File; base64: string };

interface SignaturePropProps {
  id?: string;
  onSignatureChange: (value: SignatureValue | null) => void;
  hasError: boolean;
}

export default function SignatureProp({
  id,
  onSignatureChange,
  hasError,
}: SignaturePropProps) {
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<"typed" | "drawn" | "uploaded">("typed");
  const [typedSignature, setTypedSignature] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [penColor, setPenColor] = useState("black");
  const [signaturePreview, setSignaturePreview] = useState<string | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);
  const sigCanvasRef = useRef<SignatureCanvas>(null);

  // --- File validation
  const validateFile = (file: File) => {
    const maxSizeMB = 5;
    const allowedTypes = ["image/png", "image/jpeg"];
    if (!allowedTypes.includes(file.type)) {
      alert("Signature must be a PNG or JPEG image.");
      return false;
    }
    if (file.size > maxSizeMB * 1024 * 1024) {
      alert(`File size must be less than ${maxSizeMB} MB`);
      return false;
    }
    return true;
  };

  const handleFileSelect = (file: File) => {
    if (!validateFile(file)) return;
    setSelectedFile(file);
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const base64 = reader.result as string;
      setSignaturePreview(base64);
      onSignatureChange({ type: "uploaded", value: file, base64 });
    };
  };

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) handleFileSelect(file);
  }, []);

  const handleRemove = () => {
    setSelectedFile(null);
    setSignaturePreview(null);
    onSignatureChange(null);
    if (inputRef.current) inputRef.current.value = "";
  };

 const saveDrawnSignature = () => {
  if (!sigCanvasRef.current) return;
  try {
    if (!sigCanvasRef.current.isEmpty()) {
      // use getCanvas ONLY (skip getTrimmedCanvas to avoid the bug)
      const canvas = sigCanvasRef.current.getCanvas();
      const dataUrl = canvas.toDataURL("image/png");
      setSignaturePreview(dataUrl);
      onSignatureChange({ type: "drawn", value: dataUrl });
    } else {
      setSignaturePreview(null);
      onSignatureChange(null);
    }
  } catch (err) {
    console.error("Error saving drawn signature:", err);
  }
};



  const resetSignature = () => {
    setTypedSignature("");
    setSelectedFile(null);
    setSignaturePreview(null);
    sigCanvasRef.current?.clear();
    onSignatureChange(null);
  };

  return (
    <div className="signature-prop">
      {/* Step 1: Show only "Add Signature" button with preview */}
      {!open && (
        <button
          type="button"
          className="open-signature-btn"
          onClick={() => setOpen(true)}
        >
          {signaturePreview ? (
            signaturePreview.startsWith("data:") ? (
              <img
                src={signaturePreview}
                alt="Signature preview"
                className=""
              />
            ) : (
              <span className="signature-text-preview">{signaturePreview}</span>
            )
          ) : (
            <AiFillSignature className="" />
          )}
        </button>
      )}

      {/* Step 2: Modal */}
      {open && (
        <div className="modal-overlay">
          <div className="signature-modal">
            {/* Header */}
            <div className="modal-header">
              <h2>Your Signature</h2>
              <button onClick={() => setOpen(false)}>✕</button>
            </div>

            {/* Mode toggle */}
            <div className="mode-toggle">
              {["typed", "drawn", "uploaded"].map((m) => (
               // inside mode toggle
<button
  key={m}
  type="button"
  onClick={() => {
    resetSignature();
    if (m !== "uploaded") {
      setSelectedFile(null);
    }
    setMode(m as typeof mode);
  }}
  className={`mode-btn ${mode === m ? "active" : ""}`}
>
  {m.charAt(0).toUpperCase() + m.slice(1)}
</button>

              ))}
            </div>

            {/* Typed */}
            {mode === "typed" && (
              <input
                id={id}
                type="text"
                value={typedSignature}
                onChange={(e) => {
                  const value = e.target.value;
                  setTypedSignature(value);
                  setSignaturePreview(value || null);
                  onSignatureChange(value ? { type: "typed", value } : null);
                }}
                placeholder="Type your signature"
                className={`signature-input ${hasError ? "error-style" : ""}`}
              />
            )}

            {/* Drawn */}
            {mode === "drawn" && (
              <div className="drawn-container">
                <SignatureCanvas
                  ref={sigCanvasRef}
                  penColor={penColor}
                  canvasProps={{
                    width: 400,
                    height: 150,
                    className: "sigCanvas",
                  }}
                  onEnd={saveDrawnSignature}
                />
                {/* Color palette */}
                <div className="color-palette">
                  <div className="color-sub-palette">
                    {["black", "red", "blue"].map((color) => (
                      <button
                        key={color}
                        type="button"
                        onClick={() => setPenColor(color)}
                        className="relative"
                      >
                        <FaCircle className="text-2xl" style={{ color }} />
                      </button>
                    ))}
                  </div>

                  {/* Clear button */}
                  <button
                    type="button"
                    onClick={() => {
                      sigCanvasRef.current?.clear();
                      setSignaturePreview(null);
                      onSignatureChange(null);
                    }}
                    className="clear-btn"
                  >
                    Clear
                  </button>
                </div>
              </div>
            )}

            {/* Uploaded */}
            {mode === "uploaded" && (
              <div className="upload-container">
                <input
                  ref={inputRef}
                  type="file"
                  accept=".png,.jpg,.jpeg"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleFileSelect(file);
                  }}
                />

                {selectedFile && (
                  <div className="file-actions">
                    <button
                      type="button"
                      onClick={() => inputRef.current?.click()}
                      className="flex items-center gap-1 "
                    >
                      <FiEdit2 /> Edit
                    </button>
                    <button
                      type="button"
                      onClick={handleRemove}
                      className="remove"
                    >
                      <FiTrash2 /> Remove
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Footer */}
            <div className="modal-footer">
              <button type="button" onClick={() => setOpen(false)}>
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  if (mode === "drawn") {
                    saveDrawnSignature();
                  } else if (mode === "typed" && typedSignature) {
                    onSignatureChange({ type: "typed", value: typedSignature });
                  } else if (
                    mode === "uploaded" &&
                    selectedFile &&
                    signaturePreview
                  ) {
                    onSignatureChange({
                      type: "uploaded",
                      value: selectedFile,
                      base64: signaturePreview,
                    });
                  }
                  setOpen(false);
                }}
                className="use"
              >
                Use
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
