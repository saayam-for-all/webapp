import { useTranslation } from "react-i18next";
import { FiUpload, FiFile, FiX, FiCheck } from "react-icons/fi";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

const DocumentUploads = ({
  documents,
  setDocuments,
  errors,
  setErrors,
  locationData,
}) => {
  const { t } = useTranslation();

  const validateFile = (file) => {
    if (!file) return null;

    // Check file type
    if (file.type !== "application/pdf") {
      return "Only PDF files are allowed";
    }

    // Check file size
    if (file.size > MAX_FILE_SIZE) {
      return "File size must be less than 10MB";
    }

    return null;
  };

  const handleFileChange = (docType, e) => {
    const file = e.target.files[0];
    if (!file) return;

    const error = validateFile(file);
    if (error) {
      setErrors((prev) => ({ ...prev, [docType]: error }));
      e.target.value = ""; // Reset input
      return;
    }

    setDocuments((prev) => ({ ...prev, [docType]: file }));
    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[docType];
      return newErrors;
    });
  };

  const removeFile = (docType) => {
    setDocuments((prev) => ({ ...prev, [docType]: null }));
  };

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  // Determine which documents are required based on location data
  const showEadCard =
    locationData.isUSBased &&
    locationData.needOfferLetter &&
    locationData.documentType === "EAD";
  const showI20 =
    locationData.isUSBased &&
    locationData.needOfferLetter &&
    locationData.documentType === "i20";
  const showGovernmentId = locationData.isUSBased === false;

  const FileUploadField = ({
    label,
    docType,
    required = true,
    description,
  }) => (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {description && <p className="text-xs text-gray-500">{description}</p>}

      {!documents[docType] ? (
        <label
          className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-xl cursor-pointer transition-all duration-200 ${
            errors[docType]
              ? "border-red-400 bg-red-50"
              : "border-gray-300 hover:border-purple-400 hover:bg-purple-50/50 hover:shadow-sm"
          }`}
        >
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <FiUpload
              className={`w-8 h-8 mb-2 ${errors[docType] ? "text-red-400" : "text-gray-400"}`}
            />
            <p className="text-sm text-gray-500">
              <span className="font-semibold text-purple-600">
                {t("CLICK_TO_UPLOAD") || "Click to upload"}
              </span>
            </p>
            <p className="text-xs text-gray-400">
              {t("PDF_ONLY") || "PDF only (max 10MB)"}
            </p>
          </div>
          <input
            type="file"
            accept=".pdf,application/pdf"
            onChange={(e) => handleFileChange(docType, e)}
            className="hidden"
          />
        </label>
      ) : (
        <div className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <FiFile className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="font-medium text-gray-700 truncate max-w-xs">
                {documents[docType].name}
              </p>
              <p className="text-xs text-gray-500">
                {formatFileSize(documents[docType].size)}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <FiCheck className="w-5 h-5 text-green-600" />
            <button
              type="button"
              onClick={() => removeFile(docType)}
              className="p-1 text-gray-400 hover:text-red-500 transition-colors"
              title="Remove file"
            >
              <FiX className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {errors[docType] && (
        <p className="text-sm text-red-600">{errors[docType]}</p>
      )}
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-2">
          {t("DOCUMENT_UPLOADS") || "Document Uploads"}
        </h2>
        <p className="text-gray-600 text-sm">
          {t("DOCUMENT_DESCRIPTION") ||
            "Upload the required documents in PDF format (max 10MB each)."}
        </p>
      </div>

      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-4 mb-6 shadow-sm">
        <p className="text-blue-800 text-sm">
          <strong>{t("FILE_REQUIREMENTS") || "File Requirements"}:</strong>
          <ul className="list-disc ml-5 mt-2 space-y-1">
            <li>{t("PDF_FORMAT") || "PDF format only"}</li>
            <li>{t("MAX_SIZE") || "Maximum file size: 10MB"}</li>
            <li>
              {t("CLEAR_READABLE") || "Documents must be clear and readable"}
            </li>
          </ul>
        </p>
      </div>

      <div className="space-y-6">
        {/* Resume - Always Required */}
        <FileUploadField
          label={t("RESUME") || "Resume"}
          docType="resume"
          required={true}
          description={
            t("RESUME_DESCRIPTION") ||
            "Your most recent resume highlighting relevant skills and experience"
          }
        />

        {/* EAD Card - Conditional */}
        {showEadCard && (
          <FileUploadField
            label={t("EAD_CARD") || "EAD Card"}
            docType="eadCard"
            required={true}
            description={
              t("EAD_DESCRIPTION") ||
              "Front and back of your Employment Authorization Document"
            }
          />
        )}

        {/* i20 - Conditional */}
        {showI20 && (
          <FileUploadField
            label={t("I20_DOCUMENT") || "i20 Document"}
            docType="i20"
            required={true}
            description={
              t("I20_DESCRIPTION") ||
              "Your Certificate of Eligibility for Student Status"
            }
          />
        )}

        {/* Government ID - Conditional for International */}
        {showGovernmentId && (
          <FileUploadField
            label={t("GOVERNMENT_ID") || "Government ID"}
            docType="governmentId"
            required={true}
            description={
              t("GOVT_ID_DESCRIPTION") ||
              "Valid government-issued ID from your country (passport, national ID, etc.)"
            }
          />
        )}
      </div>

      <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl p-4 mt-6 shadow-sm">
        <p className="text-amber-800 text-sm">
          <strong>{t("PRIVACY_NOTE") || "Privacy Note"}:</strong>{" "}
          {t("DOCUMENT_PRIVACY") ||
            "Your documents will be securely stored and only accessible to authorized HR personnel for verification purposes."}
        </p>
      </div>
    </div>
  );
};

export default DocumentUploads;
