// Mock data for the Organization Overview dashboard.
// Shape mirrors the documented `organization_overview` API response so a live
// fetch can be swapped in later without changing how the component reads it:
//
// {
//   summary: { total_organizations, non_profit_organizations, ... },
//   organization_activity_trend: [{ date: "YYYY-MM-DD", count }],
//   organizations_by_type: [{ name, count }],
//   organizations_by_size: [{ name, count }],
//   organizations_by_location: { state: [{ name, count }], city: [{ name, count }] },
//   collaborator_distribution: [{ name, count }],
//   contributor_distribution: [{ name, count }],
// }

// Deterministic (no Math.random/Date.now) daily registration counts spanning
// two years, so Daily/Weekly/Monthly/Yearly aggregations all have real data.
const generateActivityTrend = () => {
  const trend = [];
  const start = new Date(2024, 6, 1); // Jul 1, 2024
  const totalDays = 730;
  for (let i = 0; i < totalDays; i++) {
    const date = new Date(start);
    date.setDate(date.getDate() + i);
    const count = 1 + ((i * 7) % 6); // deterministic 1-6 range
    trend.push({
      date: date.toISOString().slice(0, 10),
      count,
    });
  }
  return trend;
};

const organizationOverview = {
  summary: {
    total_organizations: 120,
    non_profit_organizations: 85,
    for_profit_organizations: 35,
    collaborator_organizations: 42,
    non_collaborator_organizations: 78,
    contributor_organizations: 65,
    non_contributor_organizations: 55,
  },
  organization_activity_trend: generateActivityTrend(),
  organizations_by_type: [
    { name: "Non-Profit", count: 85 },
    { name: "For-Profit", count: 35 },
  ],
  organizations_by_size: [
    { name: "Small", count: 70 },
    { name: "Medium", count: 35 },
    { name: "Large", count: 15 },
  ],
  organizations_by_location: {
    state: [
      { name: "California", count: 24 },
      { name: "Texas", count: 18 },
      { name: "New York", count: 16 },
      { name: "Florida", count: 12 },
      { name: "Illinois", count: 10 },
      { name: "Washington", count: 9 },
      { name: "Georgia", count: 8 },
      { name: "Ohio", count: 7 },
      { name: "Colorado", count: 6 },
      { name: "Other", count: 10 },
    ],
    city: [
      { name: "San Francisco", count: 14 },
      { name: "Austin", count: 11 },
      { name: "New York City", count: 10 },
      { name: "Miami", count: 9 },
      { name: "Chicago", count: 8 },
      { name: "Seattle", count: 7 },
      { name: "Atlanta", count: 6 },
      { name: "Columbus", count: 5 },
      { name: "Denver", count: 5 },
      { name: "Other", count: 45 },
    ],
  },
  collaborator_distribution: [
    { name: "Collaborator", count: 42 },
    { name: "Non-Collaborator", count: 78 },
  ],
  contributor_distribution: [
    { name: "Contributor", count: 65 },
    { name: "Non-Contributor", count: 55 },
  ],
  top_collobrator_organizations: [
    { total: 100, collaborator: 65, non_collaborator: 35 },
  ],
  top_contributor_organizations: [
    { total: 100, contributor: 55, non_contributor: 45 },
  ],
  Organization_Ratings: [
    { name: "Organization 1", rating: 2.3, type: "profit", size: 42 },
    { name: "Organization 2", rating: 4.5, type: "non-profit", size: 21 },
    { name: "Organization 3", rating: 4.2, type: "profit", size: 78 },
    { name: "Organization 4", rating: 3.1, type: "non-profit", size: 15 },
    { name: "Organization 5", rating: 1.8, type: "non-profit", size: 64 },
    { name: "Organization 6", rating: 4.9, type: "profit", size: 92 },
    { name: "Organization 7", rating: 2.7, type: "profit", size: 33 },
    { name: "Organization 8", rating: 3.6, type: "non-profit", size: 50 },
    { name: "Organization 9", rating: 5.0, type: "profit", size: 88 },
    { name: "Organization 10", rating: 1.2, type: "non-profit", size: 12 },
    { name: "Organization 11", rating: 3.8, type: "profit", size: 45 },
    { name: "Organization 12", rating: 2.4, type: "non-profit", size: 29 },
    { name: "Organization 13", rating: 4.1, type: "profit", size: 71 },
    { name: "Organization 14", rating: 3.3, type: "non-profit", size: 38 },
    { name: "Organization 15", rating: 2.9, type: "profit", size: 56 },
    { name: "Organization 16", rating: 4.7, type: "profit", size: 83 },
    { name: "Organization 17", rating: 1.5, type: "non-profit", size: 19 },
    { name: "Organization 18", rating: 3.9, type: "profit", size: 67 },
    { name: "Organization 19", rating: 4.4, type: "non-profit", size: 81 },
    { name: "Organization 20", rating: 2.1, type: "profit", size: 25 },
    { name: "Organization 21", rating: 3.0, type: "non-profit", size: 44 },
    { name: "Organization 22", rating: 4.8, type: "profit", size: 95 },
    { name: "Organization 23", rating: 1.7, type: "non-profit", size: 11 },
    { name: "Organization 24", rating: 3.5, type: "profit", size: 53 },
    { name: "Organization 25", rating: 2.6, type: "non-profit", size: 36 },
    { name: "Organization 26", rating: 4.3, type: "profit", size: 74 },
    { name: "Organization 27", rating: 3.2, type: "non-profit", size: 48 },
    { name: "Organization 28", rating: 1.9, type: "profit", size: 22 },
    { name: "Organization 29", rating: 4.6, type: "non-profit", size: 89 },
    { name: "Organization 30", rating: 2.5, type: "profit", size: 31 },
    { name: "Organization 31", rating: 3.7, type: "non-profit", size: 60 },
    { name: "Organization 32", rating: 4.0, type: "profit", size: 77 },
    { name: "Organization 33", rating: 1.4, type: "non-profit", size: 14 },
    { name: "Organization 34", rating: 2.8, type: "profit", size: 40 },
    { name: "Organization 35", rating: 4.5, type: "non-profit", size: 85 },
    { name: "Organization 36", rating: 3.4, type: "profit", size: 52 },
    { name: "Organization 37", rating: 2.2, type: "non-profit", size: 27 },
    { name: "Organization 38", rating: 4.9, type: "profit", size: 98 },
    { name: "Organization 39", rating: 1.6, type: "non-profit", size: 18 },
    { name: "Organization 40", rating: 3.8, type: "profit", size: 66 },
    { name: "Organization 41", rating: 2.0, type: "non-profit", size: 23 },
    { name: "Organization 42", rating: 4.3, type: "profit", size: 79 },
    { name: "Organization 43", rating: 3.1, type: "non-profit", size: 46 },
    { name: "Organization 44", rating: 4.7, type: "profit", size: 91 },
    { name: "Organization 45", rating: 1.3, type: "non-profit", size: 10 },
    { name: "Organization 46", rating: 3.6, type: "profit", size: 58 },
    { name: "Organization 47", rating: 2.9, type: "non-profit", size: 35 },
    { name: "Organization 48", rating: 4.2, type: "profit", size: 75 },
    { name: "Organization 49", rating: 3.5, type: "non-profit", size: 51 },
    { name: "Organization 50", rating: 4.8, type: "profit", size: 94 },
    { name: "Organization 51", rating: null, type: "non-profit", size: 30 },
    { name: "Organization 52", rating: null, type: "profit", size: 62 },
    { name: "Organization 53", rating: null, type: "non-profit", size: 17 },
    { name: "Organization 54", rating: null, type: "profit", size: 84 },
    { name: "Organization 55", rating: null, type: "profit", size: 41 },
    { name: "Organization 56", rating: null, type: "non-profit", size: 24 },
    { name: "Organization 57", rating: null, type: "profit", size: 73 },
    { name: "Organization 58", rating: null, type: "non-profit", size: 39 },
    { name: "Organization 59", rating: null, type: "profit", size: 90 },
    { name: "Organization 60", rating: null, type: "non-profit", size: 16 },
    { name: "Organization 61", rating: null, type: "profit", size: 68 },
    { name: "Organization 62", rating: null, type: "non-profit", size: 28 },
    { name: "Organization 63", rating: null, type: "profit", size: 76 },
    { name: "Organization 64", rating: null, type: "non-profit", size: 49 },
    { name: "Organization 65", rating: null, type: "profit", size: 87 },
    { name: "Organization 66", rating: null, type: "non-profit", size: 20 },
    { name: "Organization 67", rating: null, type: "profit", size: 65 },
  ],
};

export default organizationOverview;
