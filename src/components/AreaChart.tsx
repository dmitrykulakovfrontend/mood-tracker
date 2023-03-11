import {
  Area,
  AreaChart,
  CartesianGrid,
  Legend,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { type Data } from "~/pages";
import { type TimeLog } from "../pages/index";

const Chart = (props: { data: Data | null }) => {
  // const example = {
  //   "Sat Mar 11 2023": {
  //     "10:00": { mood: 2, stressors: 2, weather: 2, energy: 2 },
  //     "13:00": { mood: 3, stressors: 3, weather: 3, energy: 3 },
  //     "16:00": { mood: 5, stressors: 5, weather: 5, energy: 5 },
  //     "19:00": { mood: 8, stressors: 8, weather: 8, energy: 8 },
  //     "22:00": { mood: 2, stressors: 2, weather: 2, energy: 2 },
  //   },
  //   "Sun Mar 12 2023": {
  //     "10:00": { mood: 4, stressors: 4, weather: 4, energy: 4 },
  //     "13:00": { mood: 6, stressors: 6, weather: 6, energy: 6 },
  //     "16:00": { mood: 5, stressors: 5, weather: 5, energy: 5 },
  //     "19:00": { mood: 9, stressors: 9, weather: 9, energy: 9 },
  //     "22:00": { mood: 2, stressors: 2, weather: 2, energy: 2 },
  //   },
  //   "Mon Mar 13 2023": {
  //     "10:00": { mood: 5, stressors: 5, weather: 5, energy: 5 },
  //     "13:00": { mood: 7, stressors: 7, weather: 7, energy: 7 },
  //     "16:00": { mood: 5, stressors: 5, weather: 5, energy: 5 },
  //     "19:00": { mood: 8, stressors: 8, weather: 8, energy: 8 },
  //     "22:00": { mood: 2, stressors: 2, weather: 2, energy: 2 },
  //   },
  // };
  let amountOfDays = 0;
  const average = {
    "10:00": { mood: 0, stressors: 0, weather: 0, energy: 0 },
    "13:00": { mood: 0, stressors: 0, weather: 0, energy: 0 },
    "16:00": { mood: 0, stressors: 0, weather: 0, energy: 0 },
    "19:00": { mood: 0, stressors: 0, weather: 0, energy: 0 },
    "22:00": { mood: 0, stressors: 0, weather: 0, energy: 0 },
  };
  for (const date in props.data) {
    const day = props.data[date];
    amountOfDays++;
    for (const time in day) {
      if (
        time !== "10:00" &&
        time !== "13:00" &&
        time !== "16:00" &&
        time !== "19:00" &&
        time !== "22:00"
      )
        throw new Error("Invalid time");
      const averageTime: TimeLog = average[time];
      averageTime.mood += day[time].mood;
      averageTime.energy += day[time].energy;
      averageTime.weather += day[time].weather;
      averageTime.stressors += day[time].stressors;
    }
  }
  for (const time in average) {
    if (
      time !== "10:00" &&
      time !== "13:00" &&
      time !== "16:00" &&
      time !== "19:00" &&
      time !== "22:00"
    )
      throw new Error("Invalid time");
    average[time].mood = +(average[time].mood /= amountOfDays).toFixed(2);
    average[time].energy = +(average[time].energy /= amountOfDays).toFixed(2);
    average[time].weather = +(average[time].weather /= amountOfDays).toFixed(2);
    average[time].stressors = +(average[time].stressors /=
      amountOfDays).toFixed(2);
  }
  const result = [];
  for (const [key, { mood, stressors, weather, energy }] of Object.entries(
    average
  )) {
    result.push({
      time: key,
      mood,
      stressors,
      weather,
      energy,
    });
  }

  return (
    <>
      <AreaChart
        width={730}
        height={250}
        data={result}
        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
      >
        <XAxis dataKey="time" />
        <YAxis />
        <CartesianGrid strokeDasharray="3 3" />
        <Tooltip />
        <Legend
          align="right"
          layout="vertical"
          verticalAlign="top"
          height={36}
        />
        <Area
          type="monotone"
          dataKey="weather"
          stroke="#10c3ff"
          fillOpacity={1}
          fill="url(#colorUv)"
        />
        <Area
          type="monotone"
          dataKey="stressors"
          stroke="#ff1064"
          fillOpacity={1}
          fill="url(#colorUv)"
        />
        <Area
          type="monotone"
          dataKey="energy"
          stroke="#ffbf00"
          fillOpacity={1}
          fill="url(#colorUv)"
        />
        <Area
          type="monotone"
          dataKey="mood"
          stroke="#82ca9d"
          fillOpacity={1}
          fill="url(#colorPv)"
        />
      </AreaChart>
    </>
  );
};

export default Chart;
