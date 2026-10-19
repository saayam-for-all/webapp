import React, { useState, useMemo, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";

const Skills = ({ selectedSkills, setSelectedSkills, categories }) => {
  const { t, i18n } = useTranslation(["common", "categories"]);
  const [hoveredCategory, setHoveredCategory] = useState(null);
  const [hoveredSubcategory, setHoveredSubcategory] = useState(null);
  const [mobileActiveCategory, setMobileActiveCategory] = useState(null);
  const [mobileActiveSubcategory, setMobileActiveSubcategory] = useState(null);

  // Keyboard navigation state
  const [activeColumn, setActiveColumn] = useState(0); // 0: Cat, 1: SubCat, 2: SubSubCat
  const [focusedCatIndex, setFocusedCatIndex] = useState(0);
  const [focusedSubCatIndex, setFocusedSubCatIndex] = useState(0);
  const [focusedSubSubCatIndex, setFocusedSubSubCatIndex] = useState(0);

  // Refs to focus DOM elements directly
  const col1ItemRefs = useRef([]);
  const col2ItemRefs = useRef([]);
  const col3ItemRefs = useRef([]);

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

  // Set default hoveredCategory on initial load
  useEffect(() => {
    if (sortedCategories.length > 0 && !hoveredCategory) {
      setHoveredCategory(sortedCategories[0]);
    }
  }, [sortedCategories, hoveredCategory]);

  // Handle automatic DOM focus shifting when column or indexes change
  useEffect(() => {
    if (activeColumn === 0) {
      col1ItemRefs.current[focusedCatIndex]?.focus();
    } else if (activeColumn === 1) {
      col2ItemRefs.current[focusedSubCatIndex]?.focus();
    } else if (activeColumn === 2) {
      col3ItemRefs.current[focusedSubSubCatIndex]?.focus();
    }
  }, [
    activeColumn,
    focusedCatIndex,
    focusedSubCatIndex,
    focusedSubSubCatIndex,
    hoveredCategory,
    hoveredSubcategory,
  ]);

  const isLeaf = (node) =>
    !node.subCategories || node.subCategories.length === 0;

  const isSelected = (catId) => selectedSkills.includes(catId);

  const toggleSkill = (catId) => {
    if (isSelected(catId)) {
      setSelectedSkills(selectedSkills.filter((id) => id !== catId));
    } else {
      setSelectedSkills([...selectedSkills, catId]);
    }
  };

  const resolveSkillPath = (catId) => {
    for (const cat of categories) {
      if (cat.catId === catId && isLeaf(cat)) {
        return {
          categoryName: t(
            `categories:REQUEST_CATEGORIES.${cat.catName}.LABEL`,
            { defaultValue: cat.catName },
          ),
          skillName: t(`categories:REQUEST_CATEGORIES.${cat.catName}.LABEL`, {
            defaultValue: cat.catName,
          }),
        };
      }
      for (const sub of cat.subCategories || []) {
        if (sub.catId === catId && isLeaf(sub)) {
          const catLabel = t(
            `categories:REQUEST_CATEGORIES.${cat.catName}.LABEL`,
            { defaultValue: cat.catName },
          );
          const subLabel = t(
            `categories:REQUEST_CATEGORIES.${cat.catName}.SUBCATEGORIES.${sub.catName}.LABEL`,
            { defaultValue: sub.catName },
          );
          return { categoryName: catLabel, skillName: subLabel };
        }
        for (const subSub of sub.subCategories || []) {
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
            };
          }
        }
      }
    }
    return { categoryName: catId, skillName: catId };
  };

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

  const removeCategorySkills = (catIds) => {
    setSelectedSkills(selectedSkills.filter((id) => !catIds.includes(id)));
  };

  const hasSubCats = hoveredCategory?.subCategories?.length > 0;
  const hasSubSubCats = hoveredSubcategory?.subCategories?.length > 0;

  // Keyboard Handlers
  const handleCol1KeyDown = (e, index, category) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      const nextIndex = (index + 1) % sortedCategories.length;
      setFocusedCatIndex(nextIndex);
      const nextCat = sortedCategories[nextIndex];
      setHoveredCategory(nextCat);
      setHoveredSubcategory(null);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      const prevIndex =
        (index - 1 + sortedCategories.length) % sortedCategories.length;
      setFocusedCatIndex(prevIndex);
      const prevCat = sortedCategories[prevIndex];
      setHoveredCategory(prevCat);
      setHoveredSubcategory(null);
    } else if (e.key === "ArrowRight" || e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      if (isLeaf(category)) {
        toggleSkill(category.catId);
      } else if (category.subCategories?.length > 0) {
        setHoveredSubcategory(category.subCategories[0]);
        setFocusedSubCatIndex(0);
        setActiveColumn(1);
      }
    }
  };

  const handleCol2KeyDown = (e, index, subcategory) => {
    const subList = hoveredCategory?.subCategories || [];
    if (e.key === "ArrowDown") {
      e.preventDefault();
      const nextIndex = (index + 1) % subList.length;
      setFocusedSubCatIndex(nextIndex);
      setHoveredSubcategory(subList[nextIndex]);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      const prevIndex = (index - 1 + subList.length) % subList.length;
      setFocusedSubCatIndex(prevIndex);
      setHoveredSubcategory(subList[prevIndex]);
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      setActiveColumn(0);
    } else if (e.key === "ArrowRight" || e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      if (isLeaf(subcategory)) {
        toggleSkill(subcategory.catId);
      } else if (subcategory.subCategories?.length > 0) {
        setFocusedSubSubCatIndex(0);
        setActiveColumn(2);
      }
    }
  };

  const handleCol3KeyDown = (e, index, subSubCat) => {
    const subSubList = hoveredSubcategory?.subCategories || [];
    if (e.key === "ArrowDown") {
      e.preventDefault();
      const nextIndex = (index + 1) % subSubList.length;
      setFocusedSubSubCatIndex(nextIndex);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      const prevIndex = (index - 1 + subSubList.length) % subSubList.length;
      setFocusedSubSubCatIndex(prevIndex);
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      setActiveColumn(1);
    } else if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      toggleSkill(subSubCat.catId);
    }
  };

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
            {sortedCategories.map((category, index) => {
              const leaf = isLeaf(category);
              const selected = leaf && isSelected(category.catId);
              const isFocused = activeColumn === 0 && focusedCatIndex === index;
              return (
                <div
                  key={category.catId}
                  ref={(el) => (col1ItemRefs.current[index] = el)}
                  tabIndex={isFocused ? 0 : -1}
                  className={`p-2 flex items-center justify-between outline-none ${
                    leaf ? "cursor-pointer" : "cursor-default"
                  } hover:bg-gray-100 focus:bg-gray-100 ${
                    hoveredCategory?.catId === category.catId
                      ? "font-semibold bg-gray-50"
                      : ""
                  } ${selected ? "bg-blue-50" : "bg-white"}`}
                  onClick={() => {
                    setActiveColumn(0);
                    setFocusedCatIndex(index);
                    setHoveredCategory(category);
                    setHoveredSubcategory(null);
                    if (leaf) {
                      toggleSkill(category.catId);
                    }
                  }}
                  onMouseEnter={() => {
                    setHoveredCategory(category);
                    setHoveredSubcategory(null);
                  }}
                  onKeyDown={(e) => handleCol1KeyDown(e, index, category)}
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
                  const isFocused =
                    activeColumn === 1 && focusedSubCatIndex === index;
                  return (
                    <div
                      key={subcategory.catId}
                      ref={(el) => (col2ItemRefs.current[index] = el)}
                      tabIndex={isFocused ? 0 : -1}
                      className={`p-2 flex items-center justify-between outline-none ${
                        leaf ? "cursor-pointer" : "cursor-default"
                      } hover:bg-gray-200 focus:bg-gray-200 ${
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
                        setActiveColumn(1);
                        setFocusedSubCatIndex(index);
                        setHoveredSubcategory(subcategory);
                        if (leaf) {
                          toggleSkill(subcategory.catId);
                        }
                      }}
                      onKeyDown={(e) =>
                        handleCol2KeyDown(e, index, subcategory)
                      }
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
                  const isFocused =
                    activeColumn === 2 && focusedSubSubCatIndex === index;
                  return (
                    <div
                      key={subSubCat.catId}
                      ref={(el) => (col3ItemRefs.current[index] = el)}
                      tabIndex={isFocused ? 0 : -1}
                      className={`cursor-pointer hover:bg-gray-200 focus:bg-gray-200 p-2 flex items-center justify-between outline-none ${
                        index !== 0 ? " border-t border-gray-200" : ""
                      } ${selected ? "bg-blue-50" : "bg-white"}`}
                      onClick={() => {
                        setActiveColumn(2);
                        setFocusedSubSubCatIndex(index);
                        toggleSkill(subSubCat.catId);
                      }}
                      onKeyDown={(e) => handleCol3KeyDown(e, index, subSubCat)}
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
                <div className="font-medium text-sm text-blue-900 mb-2 flex items-center">
                  <span>{group.categoryName}</span>
                  <button
                    type="button"
                    className="text-red-600 hover:text-red-800 font-bold ml-1 text-lg"
                    onClick={() => removeCategorySkills(group.catIds)}
                    title={t("common:REMOVE_CATEGORY")}
                  >
                    &times;
                  </button>
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
