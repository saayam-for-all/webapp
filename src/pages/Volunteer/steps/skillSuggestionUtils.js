export const MAX_SKILL_DESCRIPTION_LENGTH = 500;

export const buildSkillSuggestionPayload = (description, session) => ({
  description: description.trim(),
  mode: "volunteer_skills",
  ...(session != null ? { session } : {}),
});

export const flattenLeafSkills = (categories = []) => {
  const leaves = [];

  const visit = (nodes, parents = []) => {
    for (const node of nodes || []) {
      const hierarchy = [...parents, node.catName];

      if (node.subCategories?.length) {
        visit(node.subCategories, hierarchy);
      } else {
        leaves.push({
          catId: node.catId,
          catName: node.catName,
          hierarchy,
        });
      }
    }
  };

  visit(categories);
  return leaves;
};

export const normalizeSkillSuggestionResponse = (response) => {
  const body = response?.body ?? response;

  if (!Array.isArray(body?.categories)) {
    throw new Error("Invalid skill suggestion response");
  }

  return {
    categories: body.categories,
    unmatchedSkills: Array.isArray(body.unmatched_skills)
      ? body.unmatched_skills
      : [],
    session: body.session,
    cached: body.cached === true,
  };
};

export const resolveSuggestedSkills = (suggestions = [], categories = []) => {
  const leaves = flattenLeafSkills(categories);
  const resolved = new Map();

  for (const suggestion of suggestions) {
    const nameMatches = leaves.filter(
      (leaf) => leaf.catName === suggestion.category_name,
    );

    const exactMatch = nameMatches.find(
      (leaf) => String(leaf.catId) === String(suggestion.category_number),
    );

    const match =
      exactMatch ?? (nameMatches.length === 1 ? nameMatches[0] : null);

    if (match) {
      resolved.set(match.catId, {
        ...suggestion,
        ...match,
      });
    }
  }

  return [...resolved.values()];
};

export const getGeneralSkill = (categories = []) =>
  flattenLeafSkills(categories).find(
    (skill) => skill.catName === "GENERAL_CATEGORY",
  );

export const mergeSelectedSkills = (existingSkills = [], newSkills = []) => [
  ...new Set([...existingSkills, ...newSkills]),
];
