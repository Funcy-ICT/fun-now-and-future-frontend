
import "./BusInfo.css";
import BusStopStatus from "./BusStopStatus";
import NextBusInfo from "./NextBus";

type BusInfoProps = {
  status?: string;
  peopleCount?: number;
};

function BusInfo({
  status = "やや混雑",
  peopleCount = 12,
}: BusInfoProps) {
  return (
    <div className="bus-information">
      <section className="next-bus-frame">
        <NextBusInfo />
      </section>

      <section className="bus-status-frame">
        <BusStopStatus
          status={status}
          peopleCount={peopleCount}
        />
      </section>
    </div>
  );
}

export default BusInfo;
