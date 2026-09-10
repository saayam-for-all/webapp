import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { getAdditionalFields } from "../../services/requestServices";

/**
 * AdditionalFieldsDisplay (#1456)
 *
 * Read-only, label:value rendering of the dynamic additional info
 * fields captured on Create Request (see DynamicAdditionalFields.jsx),
 * shown on the Request Details "Details" tab.
 *
 * Props:
 *   requestId    - the request's ID
 *   requesterId  - the requester's ID
 *   category     - requestData.category (may be a catName like
 *                  "GROCERY_SHOPPING_AND_DELIVERY" or already a numeric
 *                  catId like "1.1")
 */
const toTitleCase = (str) =>
  String(str)
    .toLowerCase()
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());

const AdditionalFieldsDisplay = ({ requestId, requesterId, category }) => {
  const { t } = useTranslation("metadata");
  const categories = useSelector((state) => state.request?.categories);

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const catId = useMemo(() => {
    if (!category || !categories) return category;
    if (/^\d+(\.\d+)*$/.test(category)) return category;
    for (const cat of categories) {
      if (cat.catName === category) return cat.catId;
      for (const sub of cat.subCategories || []) {
        if (sub.catName === category) return sub.catId;
        for (const subsub of sub.subCategories || []) {
          if (subsub.catName === category) return subsub.catId;
        }
      }
    }
    return category;
  }, [category, categories]);

  const metadataFields = useMemo(() => {
    if (!catId) return [];
    try {
      const raw = localStorage.getItem("metadata");
      if (!raw) return [];
      const allMetadata = JSON.parse(raw);
      if (!Array.isArray(allMetadata)) return [];

      let entry = allMetadata.find((m) => m.catId === catId);
      if (!entry && catId.includes(".")) {
        const parentCatId = catId.substring(0, catId.lastIndexOf("."));
        entry = allMetadata.find((m) => m.catId === parentCatId);
      }
      if (!entry || !Array.isArray(entry.fields)) return [];
      return entry.fields.filter((f) => f.status === "active");
    } catch {
      return [];
    }
  }, [catId]);

  useEffect(() => {
    if (!requestId || !requesterId) {
      setLoading(false);
      return;
    }
    const fetchFields = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await getAdditionalFields({ requestId, requesterId });
        setData(response?.data ?? null);
      } catch (err) {
        setError("Failed to load additional details. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchFields();
  }, [requestId, requesterId]);

  const translateMetadataLabel = (key, fallback) => {
    const translated = t(key, { defaultValue: fallback });
    return translated === key ? fallback : translated;
  };

  const getFieldLabel = (fieldNameKey) =>
    translateMetadataLabel(`FIELDS.${fieldNameKey}`, toTitleCase(fieldNameKey));

  const getItemLabel = (itemValue) =>
    translateMetadataLabel(`ITEMS.${itemValue}`, toTitleCase(itemValue));

  const formatRawValue = (value) => {
    if (value === null || value === undefined || value === "") return "";
    if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}T/.test(value)) {
      const parsed = new Date(value);
      if (!isNaN(parsed.getTime())) {
        return parsed.toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
          timeZone: "UTC",
        });
      }
    }
    // Some fields (e.g. currency-type) come back as an object rather
    // than a scalar (e.g. { amount, currency } or { amount, unit }).
    // Join its own values into a readable string rather than
    // stringifying to "[object Object]".
    if (typeof value === "object" && !Array.isArray(value)) {
      return Object.values(value).join(" - ");
    }
    return String(value);
  };

  const renderValue = (field, rawValue) => {
    if (Array.isArray(rawValue)) {
      const listItems = field?.listItems || [];
      return rawValue
        .map((itemId) => {
          const item = listItems.find((li) => li.itemId === itemId);
          return item ? getItemLabel(item.itemValue) : itemId;
        })
        .join(", ");
    }
    return formatRawValue(rawValue);
  };

  if (loading) {
    return (
      <div className="text-sm text-gray-500 py-2">
        Loading additional details...
      </div>
    );
  }

  if (error) {
    return <div className="text-sm text-red-600 py-2">{error}</div>;
  }

  if (!data || Object.keys(data).length === 0) {
    return (
      <p className="text-xs text-gray-400 italic mb-4">
        No additional information available.
      </p>
    );
  }

  const entries = Object.entries(data);

  return (
    <div
      className="mt-3 mb-4 space-y-2"
      data-testid="additional-fields-display"
    >
      {entries.map(([fieldId, rawValue]) => {
        const field = metadataFields.find((f) => f.fieldId === fieldId);
        const label = field
          ? getFieldLabel(field.fieldNameKey)
          : toTitleCase(fieldId);
        return (
          <div key={fieldId} className="flex flex-col sm:flex-row sm:gap-2">
            <span className="text-sm font-semibold text-gray-700">
              {label}:
            </span>
            <span className="text-sm text-gray-600">
              {renderValue(field, rawValue)}
            </span>
          </div>
        );
      })}
    </div>
  );
};

export default AdditionalFieldsDisplay;
