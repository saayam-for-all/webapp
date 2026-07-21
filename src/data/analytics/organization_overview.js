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
};

export default organizationOverview;
