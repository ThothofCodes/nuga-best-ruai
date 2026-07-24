export default function Mark({ size = 44 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g transform="translate(60,60)">
        <circle r="48" fill="none" stroke="#8B9A7E" strokeWidth="3" opacity="0.5" />
        <circle r="34" fill="none" stroke="#2C4438" strokeWidth="3.5" opacity="0.8" />
        <circle r="20" fill="none" stroke="#BE6A34" strokeWidth="4" className="arc-pulse" opacity="0.95" />
        <circle r="7" fill="#BE6A34" />
      </g>
    </svg>
  );
}
