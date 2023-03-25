/* eslint-disable @typescript-eslint/ban-ts-comment */
import { useState } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Label,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { type CategoricalChartState } from "recharts/types/chart/generateCategoricalChart";
import { date } from "zod";
import { type Day, type Data } from "~/pages";

type DailyAverage = {
  time: string;
  mood?: number;
  stressors?: number;
  weather?: number;
  energy?: number;
};

const DailyChart = ({ data }: { data: Data | null }) => {
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
  function formatDay(day: Day) {
    const result = [];
    for (const [key, value] of Object.entries(day)) {
      result.push({
        time: key,
        ...value,
      });
    }
    return result;
  }
  function handleClick(e: CategoricalChartState) {
    const date = e.activeLabel;
    if (!date || !data) return;
    const day = data[date];
    if (!day) return;
    const formattedDay = formatDay(day);
    setDayView(true);
    setDay(formattedDay);
  }
  const [day, setDay] = useState<
    | {
        mood: number;
        stressors: number;
        weather: number;
        energy: number;
        time: string;
      }[]
  >([]);
  const [isDayView, setDayView] = useState(false);
  return (
    <>
      {isDayView && (
        <button
          className="absolute top-4 left-20 z-10 bg-green-400 py-1 px-2"
          onClick={(e) => setDayView(false)}
        >
          Back
        </button>
      )}
      <ResponsiveContainer
        className="relative !w-1/2 max-md:!w-full"
        height={250}
      >
        <AreaChart
          data={isDayView ? day : getAverageSymptoms(data)}
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
          onClick={handleClick}
        >
          <XAxis dataKey="time" />
          <YAxis />
          <CartesianGrid strokeDasharray="3 3" />
          <Tooltip />
          {isDayView && <Label />}
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
      </ResponsiveContainer>
    </>
  );
};

export default DailyChart;
