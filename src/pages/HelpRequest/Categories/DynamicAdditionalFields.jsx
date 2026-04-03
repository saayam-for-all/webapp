import React, { useState, useEffect, useMemo } from "react";

/**
 * Convert UPPER_SNAKE_CASE keys to Title Case labels.
 * e.g. "PREFERRED_MEAL_TYPE" → "Preferred Meal Type"
 */
const toTitleCase = (str) =>
  str
    .replace(/_/g, " ")
    .toLowerCase()
    .replace(/\b\w/g, (c) => c.toUpperCase());

/**
 * DynamicAdditionalFields
 *
 * Reads the metadata JSON from localStorage and dynamically renders
 * form fields for the selected category/subcategory.
 *
 * Props:
 *   catId        – currently selected category ID (e.g. "1.1", "6.4")
 *   onChange      – callback receiving { [fieldId]: value } on every change
 *   initialValues – optional pre-filled values (for edit mode)
 */
const DynamicAdditionalFields = ({ catId, onChange, initialValues = null }) => {
  const [fieldValues, setFieldValues] = useState({});

  // ── Resolve metadata for the current catId ──────────────────────────
  const metadataFields = useMemo(() => {
    if (!catId) return [];
    try {
      const raw = localStorage.getItem("metadata");
      if (!raw) return [];
      const allMetadata = JSON.parse(raw);
      if (!Array.isArray(allMetadata)) return [];

      // Try exact match first
      let entry = allMetadata.find((m) => m.catId === catId);

      if (!entry && catId.includes(".")) {
        const parentCatId = catId.substring(0, catId.lastIndexOf("."));
        entry = allMetadata.find((m) => m.catId === parentCatId);
      }

      if (!entry || !Array.isArray(entry.fields)) return [];
      // Only show active fields
      return entry.fields.filter((f) => f.status === "active");
    } catch {
      return [];
    }
  }, [catId]);

  // ── Reset field values when catId changes ───────────────────────────
  useEffect(() => {
    if (initialValues) {
      setFieldValues(initialValues);
    } else {
      setFieldValues({});
    }
  }, [catId]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Propagate changes to parent ─────────────────────────────────────
  useEffect(() => {
    if (metadataFields.length > 0) {
      onChange(fieldValues);
    }
  }, [fieldValues]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Nothing to render ───────────────────────────────────────────────
  if (metadataFields.length === 0) return null;

  // ── Helpers ─────────────────────────────────────────────────────────
  const updateField = (fieldId, value) => {
    setFieldValues((prev) => ({ ...prev, [fieldId]: value }));
  };

  const toggleCheckbox = (fieldId, itemValue) => {
    setFieldValues((prev) => {
      const current = Array.isArray(prev[fieldId]) ? prev[fieldId] : [];
      const next = current.includes(itemValue)
        ? current.filter((v) => v !== itemValue)
        : [...current, itemValue];
      return { ...prev, [fieldId]: next };
    });
  };

  const updateListItemValue = (fieldId, itemId, value) => {
    setFieldValues((prev) => {
      const current =
        typeof prev[fieldId] === "object" && !Array.isArray(prev[fieldId])
          ? prev[fieldId]
          : {};
      return { ...prev, [fieldId]: { ...current, [itemId]: value } };
    });
  };

  // ── Render a single list item based on its itemType ─────────────────
  const renderListItem = (field, item) => {
    const fieldId = field.fieldId;
    const key = item.itemId;

    switch (item.itemType) {
      case "radiobutton":
        return (
          <label key={key} className="flex items-center space-x-2">
            <input
              type="radio"
              name={fieldId}
              value={item.itemId}
              checked={
                Array.isArray(fieldValues[fieldId]) &&
                fieldValues[fieldId].includes(item.itemId)
              }
              onChange={() => updateField(fieldId, [item.itemId])}
              className="rounded"
              data-testid={`radio-${key}`}
            />
            <span className="text-sm">{toTitleCase(item.itemValue)}</span>
          </label>
        );

      case "checkbox":
        return (
          <label key={key} className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={(Array.isArray(fieldValues[fieldId])
                ? fieldValues[fieldId]
                : []
              ).includes(item.itemId)}
              onChange={() => toggleCheckbox(fieldId, item.itemId)}
              className="rounded"
              data-testid={`checkbox-${key}`}
            />
            <span className="text-sm">{toTitleCase(item.itemValue)}</span>
          </label>
        );

      case "textbox":
        return (
          <div key={key} className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-600 min-w-[120px]">
              {toTitleCase(item.itemValue)}
            </span>
            <input
              type="text"
              value={
                (typeof fieldValues[fieldId] === "object" &&
                  !Array.isArray(fieldValues[fieldId]) &&
                  fieldValues[fieldId]?.[item.itemId]) ||
                ""
              }
              onChange={(e) =>
                updateListItemValue(fieldId, item.itemId, e.target.value)
              }
              className="flex-1 rounded-lg border border-gray-300 py-1.5 px-2 text-sm"
              data-testid={`text-${key}`}
            />
          </div>
        );

      case "integer":
        return (
          <div key={key} className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-600 min-w-[120px]">
              {toTitleCase(item.itemValue)}
            </span>
            <input
              type="number"
              value={
                (typeof fieldValues[fieldId] === "object" &&
                  !Array.isArray(fieldValues[fieldId]) &&
                  fieldValues[fieldId]?.[item.itemId]) ||
                ""
              }
              onChange={(e) =>
                updateListItemValue(fieldId, item.itemId, e.target.value)
              }
              className="w-24 rounded-lg border border-gray-300 py-1.5 px-2 text-sm"
              data-testid={`int-${key}`}
            />
          </div>
        );

      case "currency":
        return (
          <div key={key} className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-600 min-w-[120px]">
              {toTitleCase(item.itemValue)}
            </span>
            <div className="flex items-center">
              <span className="text-sm text-gray-500 mr-1">$</span>
              <input
                type="number"
                min="0"
                step="0.01"
                value={
                  (typeof fieldValues[fieldId] === "object" &&
                    !Array.isArray(fieldValues[fieldId]) &&
                    fieldValues[fieldId]?.[item.itemId]) ||
                  ""
                }
                onChange={(e) =>
                  updateListItemValue(fieldId, item.itemId, e.target.value)
                }
                className="w-28 rounded-lg border border-gray-300 py-1.5 px-2 text-sm"
                data-testid={`currency-${key}`}
              />
            </div>
          </div>
        );

      case "date&time":
        return (
          <div key={key} className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-medium text-gray-600 min-w-[120px]">
              {toTitleCase(item.itemValue)}
            </span>
            <input
              type="date"
              value={
                (typeof fieldValues[fieldId] === "object" &&
                  !Array.isArray(fieldValues[fieldId]) &&
                  fieldValues[fieldId]?.[`${item.itemId}_date`]) ||
                ""
              }
              onChange={(e) =>
                updateListItemValue(
                  fieldId,
                  `${item.itemId}_date`,
                  e.target.value,
                )
              }
              className="rounded-lg border border-gray-300 py-1.5 px-2 text-sm"
              data-testid={`date-${key}`}
            />
            <input
              type="time"
              value={
                (typeof fieldValues[fieldId] === "object" &&
                  !Array.isArray(fieldValues[fieldId]) &&
                  fieldValues[fieldId]?.[`${item.itemId}_time`]) ||
                ""
              }
              onChange={(e) =>
                updateListItemValue(
                  fieldId,
                  `${item.itemId}_time`,
                  e.target.value,
                )
              }
              className="rounded-lg border border-gray-300 py-1.5 px-2 text-sm"
              data-testid={`time-${key}`}
            />
          </div>
        );

      default:
        return null;
    }
  };

  // ── Render a top-level field ─────────────────────────────────────────
  const renderField = (field) => {
    const { fieldId, fieldNameKey, fieldType, listItems } = field;
    const label = toTitleCase(fieldNameKey);

    switch (fieldType) {
      // Simple text input
      case "textbox":
        return (
          <div key={fieldId} className="mt-3">
            <label className="block text-gray-700 font-medium mb-1">
              {label}
            </label>
            <input
              type="text"
              value={fieldValues[fieldId] || ""}
              onChange={(e) => updateField(fieldId, e.target.value)}
              className="w-full rounded-lg border border-gray-300 py-2 px-3"
              data-testid={`field-${fieldId}`}
            />
          </div>
        );

      // Integer / number input
      case "int":
      case "integer":
        return (
          <div key={fieldId} className="mt-3">
            <label className="block text-gray-700 font-medium mb-1">
              {label}
            </label>
            <input
              type="number"
              min="0"
              value={fieldValues[fieldId] || ""}
              onChange={(e) => updateField(fieldId, e.target.value)}
              className="w-full rounded-lg border border-gray-300 py-2 px-3"
              data-testid={`field-${fieldId}`}
            />
          </div>
        );

      // Standalone boolean checkbox (no listItems)
      case "checkbox":
        return (
          <div key={fieldId} className="mt-3 flex items-center space-x-2">
            <input
              type="checkbox"
              checked={fieldValues[fieldId] === "true"}
              onChange={(e) =>
                updateField(fieldId, e.target.checked ? "true" : "false")
              }
              className="rounded"
              data-testid={`field-${fieldId}`}
            />
            <label className="text-gray-700 font-medium">{label}</label>
          </div>
        );

      // Date & time picker
      case "date&time":
        return (
          <div key={fieldId} className="mt-3">
            <label className="block text-gray-700 font-medium mb-1">
              {label}
            </label>
            <div className="flex gap-2">
              <input
                type="date"
                value={
                  (fieldValues[fieldId] &&
                    fieldValues[fieldId][`${fieldId}_date`]) ||
                  ""
                }
                onChange={(e) =>
                  updateListItemValue(
                    fieldId,
                    `${fieldId}_date`,
                    e.target.value,
                  )
                }
                className="rounded-lg border border-gray-300 py-2 px-3"
                data-testid={`field-${fieldId}-date`}
              />
              <input
                type="time"
                value={
                  (fieldValues[fieldId] &&
                    fieldValues[fieldId][`${fieldId}_time`]) ||
                  ""
                }
                onChange={(e) =>
                  updateListItemValue(
                    fieldId,
                    `${fieldId}_time`,
                    e.target.value,
                  )
                }
                className="rounded-lg border border-gray-300 py-2 px-3"
                data-testid={`field-${fieldId}-time`}
              />
            </div>
          </div>
        );

      // Time-only picker
      case "time":
        return (
          <div key={fieldId} className="mt-3">
            <label className="block text-gray-700 font-medium mb-1">
              {label}
            </label>
            <input
              type="time"
              value={fieldValues[fieldId] || ""}
              onChange={(e) => updateField(fieldId, e.target.value)}
              className="rounded-lg border border-gray-300 py-2 px-3"
              data-testid={`field-${fieldId}`}
            />
          </div>
        );

      // Currency input
      case "currency":
        return (
          <div key={fieldId} className="mt-3">
            <label className="block text-gray-700 font-medium mb-1">
              {label}
            </label>
            <div className="flex items-center">
              <span className="text-gray-500 mr-1">$</span>
              <input
                type="number"
                min="0"
                step="0.01"
                value={fieldValues[fieldId] || ""}
                onChange={(e) => updateField(fieldId, e.target.value)}
                className="w-full rounded-lg border border-gray-300 py-2 px-3"
                data-testid={`field-${fieldId}`}
              />
            </div>
          </div>
        );

      // List field — delegate to item-level renderers
      case "list":
        if (!listItems || listItems.length === 0) return null;

        // Determine if items are all radiobuttons or all checkboxes
        // for cleaner grid layout
        const allRadio = listItems.every((i) => i.itemType === "radiobutton");
        const allCheckbox = listItems.every((i) => i.itemType === "checkbox");

        return (
          <div key={fieldId} className="mt-3">
            <label className="block text-gray-700 font-medium mb-2">
              {label}
            </label>
            <div
              className={
                allRadio || allCheckbox ? "flex flex-wrap gap-3" : "space-y-2"
              }
            >
              {listItems.map((item) => renderListItem(field, item))}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  // ── Main render ─────────────────────────────────────────────────────
  return (
    <div
      className="mt-4 ml-2 sm:ml-4 pt-1 pb-4 px-4 border border-gray-200 rounded-lg bg-gray-50"
      data-testid="dynamic-additional-fields"
    >
      {metadataFields.map((field) => renderField(field))}
    </div>
  );
};

export default DynamicAdditionalFields;
