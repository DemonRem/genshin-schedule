import React, { memo, useMemo } from "react";
import { useConfig } from "../../../utils/configs";
import { useServerDate } from "../../../utils/time";
import { getResinRecharge, ResinCap, ResinsPerMinute, roundResin } from "../../../db/resins";
import { formatDateSimple } from "./index";

const EstimatorByTime = () => {
  const [resin] = useConfig("resin");
  const date = useServerDate(60000);

  const values = useMemo(() => {
    const values: { time: string; value: number }[] = [];

    const addValue = (hours: number) => {
      const value = roundResin(resin.value + getResinRecharge(date.getTime() - resin.time + hours * 3600000));

      if (value && value < ResinCap) {
        values.push({ time: `${hours} hours`, value });
        return true;
      }
    };

    addValue(2);

    for (let i = 4; addValue(i); i += 4);

    const capDate = new Date(resin.time + ((ResinCap - resin.value) / ResinsPerMinute) * 60000);

    const capTime = capDate.getTime() - date.getTime();
    const capHours = Math.floor(capTime / 3600000);
    const capMinutes = Math.floor((capTime % 3600000) / 60000);
    const capHoursText = `${capHours} hour${capHours === 1 ? "" : "s"}`;
    const capMinutesText = `${capMinutes} minute${capMinutes === 1 ? "" : "s"}`;

    values.push({
      time: [capHours ? capHoursText : "", capMinutes ? capMinutesText : "", `(${formatDateSimple(capDate)})`].join(
        " "
      ),
      value: ResinCap,
    });

    return values;
  }, [resin, date]);

  return (
    <div>
      {values.map(({ time, value }) => (
        <div key={time}>
          {value} in {time}
        </div>
      ))}
    </div>
  );
};

export default memo(EstimatorByTime);
