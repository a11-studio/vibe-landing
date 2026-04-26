interface ArrowIconProps {
  color?: string;
  size?: number;
  strokeWidth?: number;
}

/**
 * Arrow pointing top-right (↗) — the SVG itself draws top-left,
 * then the wrapper rotates it 135° to point top-right.
 */
export function ArrowIcon({ color = "#013439", size = 30, strokeWidth = 2.4 }: ArrowIconProps) {
  return (
    <div style={{ transform: "rotate(135deg)", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <svg width={size} height={size} viewBox="0 0 30 30" fill="none">
        <path
          d="M1.5 1.5L28.5 28.5"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M19.5 1.5H1.5V19.5"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}
