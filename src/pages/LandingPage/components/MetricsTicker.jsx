import { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";

const METRICS_S3_URL = import.meta.env.VITE_METRICS_S3_URL || "";

const METRIC_CONFIGS = [
  {
    key: "totalRequests",
    labelKey: "TOTAL_REQUESTS",
    suffix: "",
    color: "#1e40af",
    bg: "#dbeafe",
  },
  {
    key: "requestsResolved",
    labelKey: "REQUESTS_RESOLVED",
    suffix: "",
    color: "#166534",
    bg: "#dcfce7",
  },
  {
    key: "totalVolunteers",
    labelKey: "TOTAL_VOLUNTEERS",
    suffix: "",
    color: "#5b21b6",
    bg: "#ede9fe",
  },
  {
    key: "totalBeneficiaries",
    labelKey: "TOTAL_BENEFICIARIES",
    suffix: "",
    color: "#9a3412",
    bg: "#ffedd5",
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

  return (
    <span
      className="inline-flex items-baseline gap-1.5 whitespace-nowrap px-3 py-1.5 rounded-full"
      style={{ backgroundColor: config.bg }}
    >
      <span className="text-sm font-medium" style={{ color: config.color }}>
        {label}:
      </span>
      <span
        className="text-sm font-bold tabular-nums"
        style={{ color: config.color }}
      >
        {animated.toLocaleString()}
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
    <div className="w-full py-3">
      <div className="overflow-x-auto">
        <div className="flex items-center justify-center px-4 min-w-max mx-auto">
          {METRIC_CONFIGS.map((config, index) => (
            <span key={config.key} className="flex items-center">
              <MetricItem
                config={config}
                rawValue={metrics[config.key]}
                label={t(config.labelKey)}
              />
              {index < METRIC_CONFIGS.length - 1 && (
                <span className="mx-4 text-gray-300 select-none font-light">
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
