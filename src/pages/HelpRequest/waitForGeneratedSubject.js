export const waitForGeneratedSubject = async (
  getSubject,
  { timeoutMs = 5000, pollIntervalMs = 200 } = {},
) => {
  const hasSubject = () => (getSubject() || "").trim() !== "";

  if (hasSubject()) return true;

  const deadline = Date.now() + timeoutMs;

  while (Date.now() < deadline) {
    await new Promise((resolve) => setTimeout(resolve, pollIntervalMs));
    if (hasSubject()) return true;
  }

  return hasSubject();
};
