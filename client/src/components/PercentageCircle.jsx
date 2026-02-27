import { useEffect, useState } from "react";

export default function PercentageCircle({ percentage = 0, userName = "User", userEmail = "user@example.com" }) {
  const [displayPercentage, setDisplayPercentage] = useState(0);

  useEffect(() => {
    // Animate the percentage from 0 to target
    const duration = 2000; // 2 seconds
    const steps = 60;
    const stepValue = percentage / steps;
    const stepDuration = duration / steps;

    let currentStep = 0;
    const timer = setInterval(() => {
      currentStep++;
      if (currentStep <= steps) {
        const current = Math.min(stepValue * currentStep, percentage);
        setDisplayPercentage(current);
      } else {
        clearInterval(timer);
      }
    }, stepDuration);

    return () => clearInterval(timer);
  }, [percentage]);

  const radius = 120;
  const strokeWidth = 22;
  const normalizedRadius = radius - strokeWidth / 2;
  const circumference = 2 * Math.PI * normalizedRadius;
  const strokeDashoffset = circumference - (displayPercentage / 100) * circumference;

  const getColor = () => {
    if (percentage >= 70) return "text-green-500";
    if (percentage >= 40) return "text-yellow-500";
    return "text-red-500";
  };

  const getGradientId = () => {
    if (percentage >= 70) return "greenGradient";
    if (percentage >= 40) return "yellowGradient";
    return "redGradient";
  };

  const centerX = radius + strokeWidth / 2;
  const centerY = radius + strokeWidth / 2;
  const size = (radius + strokeWidth) * 2;

  return (
    <div className="flex flex-col items-center justify-center">
      {/* Section Title */}
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Visa Success Probability</h2>
      
      {/* Gauge */}
      <div className="flex-shrink-0">
        <div className="relative" style={{ width: size, height: size }}>
          <svg height={size} width={size} className="overflow-visible">
            {/* Define gradients */}
            <defs>
              <linearGradient id="greenGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#34d399" />
                <stop offset="100%" stopColor="#10b981" />
              </linearGradient>
              <linearGradient id="yellowGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#fbbf24" />
                <stop offset="100%" stopColor="#eab308" />
              </linearGradient>
              <linearGradient id="redGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#f87171" />
                <stop offset="100%" stopColor="#ef4444" />
              </linearGradient>
              
              <filter id="gaugeShadow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur in="SourceAlpha" stdDeviation="3"/>
                <feOffset dx="0" dy="2" result="offsetblur"/>
                <feComponentTransfer>
                  <feFuncA type="linear" slope="0.3"/>
                </feComponentTransfer>
                <feMerge>
                  <feMergeNode/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>

              <filter id="needleShadow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur in="SourceAlpha" stdDeviation="2"/>
                <feOffset dx="0" dy="1" result="offsetblur"/>
                <feComponentTransfer>
                  <feFuncA type="linear" slope="0.4"/>
                </feComponentTransfer>
                <feMerge>
                  <feMergeNode/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
            </defs>

            {/* Background circle */}
            <circle
              cx={centerX}
              cy={centerY}
              r={normalizedRadius}
              fill="none"
              stroke="currentColor"
              strokeWidth={strokeWidth}
              className="text-gray-200 dark:text-gray-700 opacity-40"
            />
            
            {/* Progress circle */}
            <circle
              cx={centerX}
              cy={centerY}
              r={normalizedRadius}
              fill="none"
              stroke={`url(#${getGradientId()})`}
              strokeWidth={strokeWidth}
              strokeDasharray={`${circumference} ${circumference}`}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              className="transition-all"
              style={{
                transformOrigin: `${centerX}px ${centerY}px`,
                transform: 'scaleY(-1)',
                filter: 'drop-shadow(0 4px 6px rgba(0, 0, 0, 0.1))',
                transition: 'stroke-dashoffset 2s cubic-bezier(0.4, 0, 0.2, 1)'
              }}
            />
            
            {/* Percentage text - larger on single line without gaps */}
            <text
              x={centerX}
              y={centerY}
              textAnchor="middle"
              dominantBaseline="middle"
              className={`font-bold fill-current`}
              style={{ 
                color: getColor() === "text-green-500" ? "#10b981" : getColor() === "text-yellow-500" ? "#eab308" : "#ef4444",
                fontSize: "72px"
              }}
            >
              {Math.round(displayPercentage)}<tspan
                className="font-semibold fill-gray-600 dark:fill-gray-400"
                style={{ fontSize: "28px" }}
              >%</tspan>
            </text>

            {/* Border circles for better definition */}
          </svg>
        </div>
      </div>
    </div>
  );
}
