import { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";

const METRICS_S3_URL = import.meta.env.VITE_METRICS_S3_URL || "";

// A11Y-compliant colors on #f8fafc background (all >= 4.5:1 contrast ratio)
const METRIC_CONFIGS = [
  {
    key: "totalRequests",
    labelKey: "TOTAL_REQUESTS",
    suffix: "",
    color: "#1e40af",
  },
  {
    key: "requestsResolved",
    labelKey: "REQUESTS_RESOLVED",
    suffix: "",
    color: "#166534",
  },
  {
    key: "avgResolutionHours",
    labelKey: "AVG_RESOLUTION_TIME",
    suffix: " hrs",
    color: "#92400e",
  },
  {
    key: "totalVolunteers",
    labelKey: "TOTAL_VOLUNTEERS",
    suffix: "",
    color: "#5b21b6",
  },
  {
    key: "totalBeneficiaries",
    labelKey: "TOTAL_BENEFICIARIES",
    suffix: "",
    color: "#9a3412",
  },
];

function useCountUp(target, duration = 1200) {
  const [value, setValue] = useState(0);
  const rafRef = useRef(null);

  useEffect(() => {
    if (target === 0) {
      setValue(0);
      return;
    }
    const start = performance.now();
    const animate = (now) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(eased * target));
      if (progress < 1) rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [target, duration]);

  return value;
}

function MetricItem({ config, rawValue, label }) {
  const animated = useCountUp(rawValue);
  const isFloat =
    config.key === "avgResolutionHours" && !Number.isInteger(rawValue);
  const displayValue = isFloat
    ? rawValue.toFixed(1)
    : animated.toLocaleString();

  return (
    <span className="inline-flex items-baseline gap-1 whitespace-nowrap">
      <span className="text-gray-500 text-sm font-medium">{label}:</span>
      <span
        className="text-sm font-bold tabular-nums"
        style={{ color: config.color }}
      >
        {displayValue}
        {config.suffix}
      </span>
    </span>
  );
}

const MetricsTicker = () => {
  const { t } = useTranslation();
  const [metrics, setMetrics] = useState({
    totalRequests: 0,
    requestsResolved: 0,
    avgResolutionHours: 0,
    totalVolunteers: 0,
    totalBeneficiaries: 0,
  });

  useEffect(() => {
    if (!METRICS_S3_URL) return;
    fetch(METRICS_S3_URL)
      .then((res) => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then((data) => setMetrics((prev) => ({ ...prev, ...data })))
      .catch(() => {});
  }, []);

  return (
    <div className="w-full bg-gray-50 border-y border-gray-200 shadow-sm">
      <div className="overflow-x-auto">
        <div className="flex items-center px-4 py-2.5 min-w-max mx-auto justify-center">
          {METRIC_CONFIGS.map((config, index) => (
            <span key={config.key} className="flex items-center">
              <MetricItem
                config={config}
                rawValue={metrics[config.key]}
                label={t(config.labelKey)}
              />
              {index < METRIC_CONFIGS.length - 1 && (
                <span className="mx-3 text-gray-300 select-none font-light">
                  |
                </span>
              )}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MetricsTicker;
