
import "./BusStopStatus.css";

type PersonIconProps = {
  active: boolean;
};

type BusStopStatusProps = {
  status?: string;
  peopleCount?: number;
  maxIcons?: number;
};

function PersonIcon({ active }: PersonIconProps) {
  return (
    <svg
      className={`bus-status-person ${active ? "active" : ""}`}
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
    </svg>
  );
}

function BusStopStatus({
  status = "やや混雑",
  peopleCount = 12,
  maxIcons = 10,
}: BusStopStatusProps) {
  const activeIconCount = Math.min(
    Math.ceil(peopleCount / 1.5),
    maxIcons
  );

  return (
    <div className="bus-status-card">
      <div className="bus-status-header">
        <svg
          className="bus-status-header-icon"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5s-3 1.34-3 3 1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5C15 14.17 10.33 13 8 13zm8 0c-.29 0-.62.02-.97.05C16.19 13.89 17 15.02 17 16.5V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" />
        </svg>

        <h2>バス停の混雑状況</h2>
      </div>

      <div className="bus-status-body">
        <div className="bus-status-label">{status}</div>
        <div className="bus-status-count">
          現在{peopleCount}人待ち
        </div>
      </div>

      <div className="bus-status-icons">
        {Array.from({ length: maxIcons }).map((_, index) => (
          <PersonIcon
            key={index}
            active={index < activeIconCount}
          />
        ))}
      </div>
    </div>
  );
}

export default BusStopStatus;
