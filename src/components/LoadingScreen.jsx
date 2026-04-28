export default function LoadingScreen({ isLeaving }) {
  return (
    <div className={`loading-screen ${isLeaving ? 'is-leaving' : ''}`} role="status" aria-label="Loading Benkyo">
      <div className="loading-logo-wrap">
        <svg className="loading-logo-svg" viewBox="0 0 520 180" aria-hidden="true">
          <text className="loading-logo-stroke" x="50%" y="108" textAnchor="middle">
            Benkyo
          </text>
        </svg>
      </div>
    </div>
  );
}
