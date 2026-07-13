import { useTranslation } from "react-i18next";
import { PiWarningDiamondFill } from "react-icons/pi";
import { TbTriangleSquareCircle } from "react-icons/tb";
import { VscCalendar } from "react-icons/vsc";
import "./RequestDescription.css";

const priorityColorMap = {
  LOW: "text-green-500",
  MEDIUM: "text-yellow-500",
  HIGH: "text-orange-500",
  CRITICAL: "text-red-500",
};

const findCategoryLabel = (node, targetKey) => {
  if (!node || !targetKey) return null;

  for (const [key, value] of Object.entries(node)) {
    if (key === targetKey && value?.LABEL) {
      return value.LABEL;
    }

    if (value?.SUBCATEGORIES) {
      const found = findCategoryLabel(value.SUBCATEGORIES, targetKey);

      if (found) {
        return found;
      }
    }
  }

  return null;
};

const RequestDescription = ({ requestData }) => {
  const { t, i18n } = useTranslation();

  const normalizedPriority = String(requestData?.priority || "")
    .trim()
    .toUpperCase();

  const priorityColor = priorityColorMap[normalizedPriority] || "text-gray-500";

  const creationDateValue =
    requestData?.creationDate ||
    requestData?.createdDate ||
    requestData?.createdAt;

  const formattedDate = creationDateValue
    ? new Date(creationDateValue).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "—";

  const updatedDateValue =
    requestData?.lastUpdatedAt ||
    requestData?.updatedDate ||
    requestData?.updatedAt ||
    requestData?.lastUpdated ||
    requestData?.modifiedDate;

  const formattedUpdatedDate = updatedDateValue
    ? new Date(updatedDateValue).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "—";

  const lang = i18n.resolvedLanguage || i18n.language || "en";

  const categoriesBundle = i18n.hasResourceBundle?.(lang, "categories")
    ? i18n.getResourceBundle(lang, "categories")
    : i18n.getResourceBundle("en", "categories");

  const categoryLabel =
    findCategoryLabel(
      categoriesBundle?.REQUEST_CATEGORIES,
      requestData?.category,
    ) ||
    requestData?.category ||
    "—";

  return (
    <div className="border border-gray-300 rounded-lg p-4">
      <div>
        <ul className="w-full flex flex-col sm:flex-row items-start flex-wrap md:gap-2 lg:gap-6 text-xs text-gray-700 sm:items-center justify-between">
          {/* Creation Date */}
          <li className="flex items-center gap-2 group relative">
            <VscCalendar size={22} />

            <span className="cursor-help border-b border-dashed border-gray-400">
              {formattedDate}
            </span>

            <div className="absolute top-6 left-0 z-10 px-3 py-1 bg-gray-800 text-white text-xs rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none">
              {t("CREATION_DATE")}
            </div>
          </li>

          {/* Updated Date */}
          <li className="flex items-center gap-2 group relative">
            <VscCalendar size={22} />

            <span className="cursor-help border-b border-dashed border-gray-400">
              {formattedUpdatedDate}
            </span>

            <div className="absolute top-6 left-0 z-10 px-3 py-1 bg-gray-800 text-white text-xs rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none">
              {t("UPDATED_DATE")}
            </div>
          </li>

          {/* Category */}
          <li className="flex items-center gap-2">
            <TbTriangleSquareCircle size={22} />
            <span>{categoryLabel}</span>
          </li>

          {/* Status */}
          <li className="group relative">
            <span className="bg-green-200 text-xs px-3 py-1 rounded-full cursor-help">
              {t(requestData?.status || "")}
            </span>

            <div className="absolute top-6 left-0 z-10 px-3 py-1 bg-gray-800 text-white text-xs rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none">
              {t("STATUS")}
            </div>
          </li>

          {/* Priority */}
          <li className="flex items-center group relative">
            <PiWarningDiamondFill
              className={`mr-1 ${priorityColor}`}
              size={18}
            />

            <span className="font-bold cursor-help">
              {t(
                `enums:requestPriority.${normalizedPriority}`,
                requestData?.priority || normalizedPriority,
              )}
            </span>

            <div className="absolute top-6 left-0 z-10 px-3 py-1 bg-gray-800 text-white text-xs rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none">
              {t("PRIORITY")}
            </div>
          </li>
        </ul>

        {/* Description */}
        <div className="w-full m-0">
          <p className="text-sm p-5">{t(requestData?.description || "")}</p>
        </div>

        {/* Additional Information */}
        <div className="mt-4 border-t border-gray-200 pt-4">
          <h3 className="text-sm font-semibold text-gray-700 mb-2">
            {t("ADDITIONAL_INFO")}
          </h3>

          {requestData?.additionalInfo &&
          Object.keys(requestData.additionalInfo).length > 0 ? (
            <div className="space-y-1 mb-4">
              {Object.entries(requestData.additionalInfo).map(
                ([key, value]) => (
                  <div
                    key={key}
                    className="flex justify-between items-center text-sm py-1 border-b border-gray-100"
                  >
                    <span className="text-gray-500 capitalize">
                      {key.replace(/_/g, " ")}
                    </span>

                    <span className="text-gray-800">{String(value)}</span>
                  </div>
                ),
              )}
            </div>
          ) : (
            <p className="text-xs text-gray-400 italic mb-4">
              No additional information available.
            </p>
          )}

          {/* Attached Files */}
          <h3 className="text-sm font-semibold text-gray-700 mb-2">
            {t("ATTACHED_FILES")}
          </h3>

          {requestData?.attachments?.length > 0 ? (
            <ul className="space-y-1">
              {requestData.attachments.map((file, index) => (
                <li key={file.url || file.name || index}>
                  <a
                    href={file.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-500 hover:underline"
                  >
                    {file.name || `File ${index + 1}`}
                  </a>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-xs text-gray-400 italic">No files attached.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default RequestDescription;
