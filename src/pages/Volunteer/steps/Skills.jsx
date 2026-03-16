import React, { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";

const Skills = ({ selectedSkills, setSelectedSkills, categories }) => {
  const { t, i18n } = useTranslation(["common", "categories"]);
  const [hoveredCategory, setHoveredCategory] = useState(null);
  const [hoveredSubcategory, setHoveredSubcategory] = useState(null);
  const [mobileActiveCategory, setMobileActiveCategory] = useState(null);
  const [mobileActiveSubcategory, setMobileActiveSubcategory] = useState(null);

  // Sort categories alphabetically by translated label, push General to end
  const sortedCategories = useMemo(() => {
    if (!categories || categories.length === 0) return [];
    const general = categories.find(
      (cat) => cat.catName === "GENERAL_CATEGORY",
    );
    const others = categories.filter(
      (cat) => cat.catName !== "GENERAL_CATEGORY",
    );
    const resolvedLabel = (cat) =>
      t(`categories:REQUEST_CATEGORIES.${cat.catName}.LABEL`, {
        defaultValue: cat.catName,
      });
    const sorted = others.sort((a, b) =>
      resolvedLabel(a).localeCompare(resolvedLabel(b), i18n.language || "en"),
    );
    if (general) sorted.push(general);
    return sorted;
  }, [categories, i18n.language, t]);

  // Check if a category node is a leaf (no subcategories)
  const isLeaf = (node) =>
    !node.subCategories || node.subCategories.length === 0;

  // Check if a skill is selected
  const isSelected = (catId) => selectedSkills.includes(catId);

  // Toggle a leaf skill selection
  const toggleSkill = (catId) => {
    if (isSelected(catId)) {
      setSelectedSkills(selectedSkills.filter((id) => id !== catId));
    } else {
      setSelectedSkills([...selectedSkills, catId]);
    }
  };

  // Resolve the full hierarchy path label for a selected skill catId
  const resolveSkillPath = (catId) => {
    for (const cat of categories) {
      // Level 1 leaf
      if (cat.catId === catId && isLeaf(cat)) {
        return {
          categoryName: t(
            `categories:REQUEST_CATEGORIES.${cat.catName}.LABEL`,
            {
              defaultValue: cat.catName,
            },
          ),
          skillName: t(`categories:REQUEST_CATEGORIES.${cat.catName}.LABEL`, {
            defaultValue: cat.catName,
          }),
          isLevel1: true,
        };
      }
      for (const sub of cat.subCategories || []) {
        // Level 2 leaf
        if (sub.catId === catId && isLeaf(sub)) {
          const catLabel = t(
            `categories:REQUEST_CATEGORIES.${cat.catName}.LABEL`,
            { defaultValue: cat.catName },
          );
          const subLabel = t(
            `categories:REQUEST_CATEGORIES.${cat.catName}.SUBCATEGORIES.${sub.catName}.LABEL`,
            { defaultValue: sub.catName },
          );
          return {
            categoryName: catLabel,
            skillName: subLabel,
            isLevel1: false,
          };
        }
        for (const subSub of sub.subCategories || []) {
          // Level 3 leaf
          if (subSub.catId === catId) {
            const catLabel = t(
              `categories:REQUEST_CATEGORIES.${cat.catName}.LABEL`,
              { defaultValue: cat.catName },
            );
            const subLabel = t(
              `categories:REQUEST_CATEGORIES.${cat.catName}.SUBCATEGORIES.${sub.catName}.LABEL`,
              { defaultValue: sub.catName },
            );
            const subSubLabel = t(
              `categories:REQUEST_CATEGORIES.${cat.catName}.SUBCATEGORIES.${sub.catName}.SUBCATEGORIES.${subSub.catName}.LABEL`,
              { defaultValue: subSub.catName },
            );
            return {
              categoryName: catLabel,
              parentName: subLabel,
              skillName: subSubLabel,
              isLevel1: false,
            };
          }
        }
      }
    }
    return { categoryName: catId, skillName: catId, isLevel1: true };
  };

  // Group selected skills by category for display
  const groupedSelectedSkills = useMemo(() => {
    const groups = {};
    selectedSkills.forEach((catId) => {
      const pathInfo = resolveSkillPath(catId);
      const key = pathInfo.categoryName;
      if (!groups[key]) {
        groups[key] = {
          categoryName: pathInfo.categoryName,
          skills: [],
          catIds: [],
        };
      }
      groups[key].skills.push(
        pathInfo.parentName
          ? `${pathInfo.parentName} → ${pathInfo.skillName}`
          : pathInfo.skillName,
      );
      groups[key].catIds.push(catId);
    });
    return Object.values(groups);
  }, [selectedSkills, categories, i18n.language]);

  const hasSubCats = hoveredCategory?.subCategories?.length > 0;
  const hasSubSubCats = hoveredSubcategory?.subCategories?.length > 0;

  return (
    <div>
      <p className="font-bold text-xl mb-2">
        {t("common:SKILLS_SELECTOR_TITLE")}
      </p>
      <p className="text-sm text-gray-500 mb-4">
        {t("common:SKILLS_SELECTOR_PLACEHOLDER")}
      </p>

      {/* Desktop: Multi-column selector panel */}
      <div className="hidden md:block">
        <div
          className={`bg-white border rounded shadow-lg w-full flex${
            !hasSubCats ? " flex-col" : ""
          }`}
          style={{
            maxHeight: "280px",
            minHeight: "140px",
            overflow: "hidden",
          }}
        >
          {/* Column 1: Main categories */}
          <div
            className={
              hasSubSubCats
                ? "w-1/3 overflow-y-auto"
                : hasSubCats
                  ? "w-1/2 overflow-y-auto"
                  : "w-full overflow-y-auto"
            }
            style={{ maxHeight: "280px" }}
          >
            {sortedCategories.map((category) => {
              const leaf = isLeaf(category);
              const selected = leaf && isSelected(category.catId);
              return (
                <div
                  key={category.catId}
                  className={`p-2 flex items-center justify-between ${
                    leaf ? "cursor-pointer" : "cursor-default"
                  } hover:bg-gray-100 ${
                    hoveredCategory?.catId === category.catId
                      ? "font-semibold bg-gray-50"
                      : ""
                  } ${selected ? "bg-blue-50" : "bg-white"}`}
                  onClick={() => {
                    if (leaf) {
                      toggleSkill(category.catId);
                    }
                  }}
                  onMouseEnter={() => {
                    setHoveredCategory(category);
                    setHoveredSubcategory(null);
                  }}
                >
                  <span
                    title={t(
                      `categories:REQUEST_CATEGORIES.${category.catName}.DESC`,
                      { defaultValue: category.catDesc },
                    )}
                  >
                    {t(
                      `categories:REQUEST_CATEGORIES.${category.catName}.LABEL`,
                      { defaultValue: category.catName },
                    )}
                  </span>
                  <span className="flex items-center gap-1">
                    {selected && (
                      <span className="text-green-600 text-sm">&#10003;</span>
                    )}
                    {!leaf && <span className="ml-2 text-gray-400">&gt;</span>}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Column 2: Subcategories */}
          {hasSubCats && (
            <>
              <div
                className="w-px bg-gray-300 mx-1"
                style={{ minHeight: "100%" }}
              />
              <div
                className={
                  hasSubSubCats
                    ? "w-1/3 overflow-y-auto"
                    : "w-1/2 overflow-y-auto"
                }
                style={{ maxHeight: "280px" }}
              >
                {hoveredCategory.subCategories.map((subcategory, index) => {
                  const leaf = isLeaf(subcategory);
                  const selected = leaf && isSelected(subcategory.catId);
                  return (
                    <div
                      key={subcategory.catId}
                      className={`p-2 flex items-center justify-between ${
                        leaf ? "cursor-pointer" : "cursor-default"
                      } hover:bg-gray-200 ${
                        index !== 0 ? " border-t border-gray-200" : ""
                      } ${
                        hoveredSubcategory?.catId === subcategory.catId
                          ? "bg-gray-100"
                          : ""
                      } ${selected ? "bg-blue-50" : "bg-white"}`}
                      onMouseEnter={() => {
                        setHoveredSubcategory(subcategory);
                      }}
                      onClick={() => {
                        if (leaf) {
                          toggleSkill(subcategory.catId);
                        }
                      }}
                    >
                      <span
                        title={t(
                          `categories:REQUEST_CATEGORIES.${hoveredCategory.catName}.SUBCATEGORIES.${subcategory.catName}.DESC`,
                          { defaultValue: subcategory.catDesc },
                        )}
                      >
                        {t(
                          `categories:REQUEST_CATEGORIES.${hoveredCategory.catName}.SUBCATEGORIES.${subcategory.catName}.LABEL`,
                          { defaultValue: subcategory.catName },
                        )}
                      </span>
                      <span className="flex items-center gap-1">
                        {selected && (
                          <span className="text-green-600 text-sm">
                            &#10003;
                          </span>
                        )}
                        {!leaf && (
                          <span className="ml-2 text-gray-400">&gt;</span>
                        )}
                      </span>
                    </div>
                  );
                })}
              </div>
            </>
          )}

          {/* Column 3: Sub-sub-categories */}
          {hasSubSubCats && (
            <>
              <div
                className="w-px bg-gray-300 mx-1"
                style={{ minHeight: "100%" }}
              />
              <div
                className="w-1/3 overflow-y-auto"
                style={{ maxHeight: "280px" }}
              >
                {hoveredSubcategory.subCategories.map((subSubCat, index) => {
                  const selected = isSelected(subSubCat.catId);
                  return (
                    <div
                      key={subSubCat.catId}
                      className={`cursor-pointer hover:bg-gray-200 p-2 flex items-center justify-between ${
                        index !== 0 ? " border-t border-gray-200" : ""
                      } ${selected ? "bg-blue-50" : "bg-white"}`}
                      onClick={() => {
                        toggleSkill(subSubCat.catId);
                      }}
                    >
                      <span
                        title={t(
                          `categories:REQUEST_CATEGORIES.${hoveredCategory.catName}.SUBCATEGORIES.${hoveredSubcategory.catName}.SUBCATEGORIES.${subSubCat.catName}.DESC`,
                          { defaultValue: subSubCat.catDesc },
                        )}
                      >
                        {t(
                          `categories:REQUEST_CATEGORIES.${hoveredCategory.catName}.SUBCATEGORIES.${hoveredSubcategory.catName}.SUBCATEGORIES.${subSubCat.catName}.LABEL`,
                          { defaultValue: subSubCat.catName },
                        )}
                      </span>
                      {selected && (
                        <span className="text-green-600 text-sm">&#10003;</span>
                      )}
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Mobile: Single-column drill-down selector */}
      <div className="md:hidden bg-white border rounded shadow-lg w-full">
        {/* Level 1: Main categories (or back button + subcategories) */}
        {!mobileActiveCategory ? (
          <div className="overflow-y-auto" style={{ maxHeight: "280px" }}>
            {sortedCategories.map((category) => {
              const leaf = isLeaf(category);
              const selected = leaf && isSelected(category.catId);
              return (
                <div
                  key={category.catId}
                  className={`p-3 flex items-center justify-between border-b border-gray-200 active:bg-gray-100 ${
                    selected ? "bg-blue-50" : "bg-white"
                  }`}
                  onClick={() => {
                    if (leaf) {
                      toggleSkill(category.catId);
                    } else {
                      setMobileActiveCategory(category);
                      setMobileActiveSubcategory(null);
                    }
                  }}
                >
                  <span className="text-base">
                    {t(
                      `categories:REQUEST_CATEGORIES.${category.catName}.LABEL`,
                      { defaultValue: category.catName },
                    )}
                  </span>
                  <span className="flex items-center gap-2">
                    {selected && (
                      <span className="text-green-600 text-lg">&#10003;</span>
                    )}
                    {!leaf && (
                      <span className="text-gray-400 text-xl">&gt;</span>
                    )}
                  </span>
                </div>
              );
            })}
          </div>
        ) : !mobileActiveSubcategory ? (
          <div>
            {/* Back button */}
            <div
              className="p-3 flex items-center gap-2 border-b border-gray-300 bg-gray-50 active:bg-gray-200 sticky top-0"
              onClick={() => setMobileActiveCategory(null)}
            >
              <span className="text-gray-600 text-xl">&lt;</span>
              <span className="font-semibold">
                {t(
                  `categories:REQUEST_CATEGORIES.${mobileActiveCategory.catName}.LABEL`,
                  { defaultValue: mobileActiveCategory.catName },
                )}
              </span>
            </div>
            {/* Subcategories */}
            <div className="overflow-y-auto" style={{ maxHeight: "240px" }}>
              {mobileActiveCategory.subCategories?.map((subcategory) => {
                const leaf = isLeaf(subcategory);
                const selected = leaf && isSelected(subcategory.catId);
                return (
                  <div
                    key={subcategory.catId}
                    className={`p-3 flex items-center justify-between border-b border-gray-200 active:bg-gray-100 ${
                      selected ? "bg-blue-50" : "bg-white"
                    }`}
                    onClick={() => {
                      if (leaf) {
                        toggleSkill(subcategory.catId);
                      } else {
                        setMobileActiveSubcategory(subcategory);
                      }
                    }}
                  >
                    <span className="text-base">
                      {t(
                        `categories:REQUEST_CATEGORIES.${mobileActiveCategory.catName}.SUBCATEGORIES.${subcategory.catName}.LABEL`,
                        { defaultValue: subcategory.catName },
                      )}
                    </span>
                    <span className="flex items-center gap-2">
                      {selected && (
                        <span className="text-green-600 text-lg">&#10003;</span>
                      )}
                      {!leaf && (
                        <span className="text-gray-400 text-xl">&gt;</span>
                      )}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div>
            {/* Back button */}
            <div
              className="p-3 flex items-center gap-2 border-b border-gray-300 bg-gray-50 active:bg-gray-200 sticky top-0"
              onClick={() => setMobileActiveSubcategory(null)}
            >
              <span className="text-gray-600 text-xl">&lt;</span>
              <span className="font-semibold">
                {t(
                  `categories:REQUEST_CATEGORIES.${mobileActiveCategory.catName}.SUBCATEGORIES.${mobileActiveSubcategory.catName}.LABEL`,
                  { defaultValue: mobileActiveSubcategory.catName },
                )}
              </span>
            </div>
            {/* Sub-subcategories */}
            <div className="overflow-y-auto" style={{ maxHeight: "240px" }}>
              {mobileActiveSubcategory.subCategories?.map((subSubCat) => {
                const selected = isSelected(subSubCat.catId);
                return (
                  <div
                    key={subSubCat.catId}
                    className={`p-3 flex items-center justify-between border-b border-gray-200 active:bg-gray-100 ${
                      selected ? "bg-blue-50" : "bg-white"
                    }`}
                    onClick={() => {
                      toggleSkill(subSubCat.catId);
                    }}
                  >
                    <span className="text-base">
                      {t(
                        `categories:REQUEST_CATEGORIES.${mobileActiveCategory.catName}.SUBCATEGORIES.${mobileActiveSubcategory.catName}.SUBCATEGORIES.${subSubCat.catName}.LABEL`,
                        { defaultValue: subSubCat.catName },
                      )}
                    </span>
                    {selected && (
                      <span className="text-green-600 text-lg">&#10003;</span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Selected skills display */}
      <div className="mt-6">
        <p className="font-semibold text-lg mb-2">
          {t("common:SELECTED_SKILLS")}
        </p>
        {selectedSkills.length === 0 ? (
          <p className="text-sm text-gray-400 italic">
            {t("common:NO_SKILLS_SELECTED")}
          </p>
        ) : (
          <div className="flex flex-col gap-3">
            {groupedSelectedSkills.map((group) => (
              <div
                key={group.categoryName}
                className="border border-blue-200 rounded-lg bg-blue-50 p-3"
              >
                <div className="font-medium text-sm text-blue-900 mb-2">
                  {group.categoryName}
                </div>
                <div className="flex flex-wrap gap-2">
                  {group.skills.map((skillName, index) => (
                    <div
                      key={group.catIds[index]}
                      className="flex items-center gap-1 bg-white border border-blue-300 rounded-full px-3 py-1 text-sm shadow-sm"
                    >
                      <span>{skillName}</span>
                      <button
                        type="button"
                        className="text-gray-500 hover:text-red-500 font-bold ml-1"
                        onClick={() => {
                          setSelectedSkills(
                            selectedSkills.filter(
                              (id) => id !== group.catIds[index],
                            ),
                          );
                        }}
                        title={t("common:REMOVE_SKILL")}
                      >
                        &times;
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Skills;
