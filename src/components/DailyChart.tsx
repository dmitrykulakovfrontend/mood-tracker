/* eslint-disable @typescript-eslint/ban-ts-comment */
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

type DailyAverage = {
  time: string;
  mood?: number;
  stressors?: number;
  weather?: number;
  energy?: number;
};

const DailyChart = (props: { data: Data | null }) => {
  function getAverageSymptoms(data: Data | null) {
    if (!data) return;
    const result = [];

    for (const [date, values] of Object.entries(data)) {
      const average: DailyAverage = {
        time: date,
      };

      for (const symptoms of Object.values(values)) {
        for (const [key, value] of Object.entries(symptoms)) {
          // @ts-ignore
          if (!average[key]) {
            // @ts-ignore
            average[key] = value;
          } else {
            // @ts-ignore
            average[key] += value;
          }
        }
      }

      for (const key of Object.keys(average)) {
        if (key !== "time") {
          // @ts-ignore
          average[key] = (average[key] / Object.keys(values).length).toFixed(2);
        }
      }

      result.push(average);
    }

    return result;
  }

  return (
    <>
      <AreaChart
        width={730}
        height={250}
        data={getAverageSymptoms(props.data)}
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

export default DailyChart;
