import { useState, useEffect, useRef } from "react";

const METRICS_S3_URL = import.meta.env.VITE_METRICS_S3_URL || "";

const METRIC_CONFIGS = [
  {
    key: "totalRequests",
    label: "Total Requests",
    suffix: "",
    accentColor: "#4a90e2",
    icon: (
      <svg
        className="w-6 h-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.8}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
        />
      </svg>
    ),
    highlight: false,
  },
  {
    key: "requestsResolved",
    label: "Requests Resolved",
    suffix: "",
    accentColor: "#22c55e",
    icon: (
      <svg
        className="w-6 h-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.8}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
    highlight: true,
  },
  {
    key: "avgResolutionHours",
    label: "Avg Resolution Time",
    suffix: " hrs",
    accentColor: "#38bdf8",
    icon: (
      <svg
        className="w-6 h-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.8}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
    highlight: false,
  },
  {
    key: "totalVolunteers",
    label: "Total Volunteers",
    suffix: "",
    accentColor: "#818cf8",
    icon: (
      <svg
        className="w-6 h-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.8}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
        />
      </svg>
    ),
    highlight: false,
  },
  {
    key: "totalBeneficiaries",
    label: "Total Beneficiaries",
    suffix: "",
    accentColor: "#f59e0b",
    icon: (
      <svg
        className="w-6 h-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.8}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
        />
      </svg>
    ),
    highlight: false,
  },
];

// Animate a number from 0 to target over ~1.5s
function useCountUp(target, duration = 1500) {
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
      // Ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(eased * target));
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(animate);
      }
    };
    rafRef.current = requestAnimationFrame(animate);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [target, duration]);

  return value;
}

function MetricCard({ config, rawValue }) {
  const animated = useCountUp(rawValue);
  const isFloat =
    !Number.isInteger(rawValue) && config.key === "avgResolutionHours";
  const displayValue = isFloat
    ? rawValue.toFixed(1)
    : animated.toLocaleString();

  return (
    <div
      className={`relative flex flex-col items-center justify-between py-5 px-4 flex-1 min-w-0 transition-all duration-300 ${
        config.highlight ? "bg-[#16a34a]" : "bg-transparent hover:bg-white/10"
      }`}
      style={{
        borderRight: "1px solid rgba(255,255,255,0.25)",
      }}
    >
      {/* Label */}
      <p className="text-xs md:text-sm font-semibold text-white/80 tracking-wide uppercase text-center mb-3">
        {config.label}
      </p>

      {/* Icon + Number row */}
      <div className="flex items-center gap-2 mb-3">
        <span style={{ color: config.highlight ? "#fff" : config.accentColor }}>
          {config.icon}
        </span>
        <span className="text-2xl md:text-4xl font-bold text-white leading-none tabular-nums">
          {displayValue}
          {config.suffix}
        </span>
      </div>

      {/* Bottom accent bar */}
      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-1 rounded-full"
        style={{ backgroundColor: config.accentColor }}
      />

      {/* Bottom accent dot */}
      <div
        className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full border-2 border-[#3b82f6]"
        style={{ backgroundColor: config.accentColor }}
      />
    </div>
  );
}

const MetricsTicker = () => {
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
        if (!res.ok) throw new Error("Failed to fetch metrics");
        return res.json();
      })
      .then((data) => {
        setMetrics((prev) => ({ ...prev, ...data }));
      })
      .catch(() => {
        // Silently fall back to zeros
      });
  }, []);

  return (
    <div
      className="w-full my-6 md:my-8 shadow-xl"
      style={{ backgroundColor: "#3b82f6" }}
    >
      {/* Thin top accent line */}
      <div className="h-0.5 w-full bg-gradient-to-r from-white/40 via-white/70 to-white/40" />

      {/* Metrics row */}
      <div className="flex flex-col sm:flex-row w-full divide-y sm:divide-y-0 divide-white/20">
        {METRIC_CONFIGS.map((config) => (
          <MetricCard
            key={config.key}
            config={config}
            rawValue={metrics[config.key]}
          />
        ))}
      </div>

      {/* Thin bottom accent line */}
      <div className="h-0.5 w-full bg-gradient-to-r from-white/40 via-white/70 to-white/40" />
    </div>
  );
};

export default MetricsTicker;
