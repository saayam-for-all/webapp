export const SUBJECT_GENERATION_WAIT_TIMEOUT_MS = 5000;
export const SUBJECT_GENERATION_POLL_INTERVAL_MS = 200;

export const waitForGeneratedSubject = async (
  getSubject,
  {
    timeoutMs = SUBJECT_GENERATION_WAIT_TIMEOUT_MS,
    pollIntervalMs = SUBJECT_GENERATION_POLL_INTERVAL_MS,
  } = {},
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
