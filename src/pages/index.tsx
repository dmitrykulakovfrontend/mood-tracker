import { type NextPage } from "next";
import dynamic from "next/dynamic";
import { type ChangeEvent, useState, type FormEvent, useEffect } from "react";
import DailyChart from "~/components/DailyChart";

const AreaChart = dynamic(import("../components/AreaChart"), { ssr: false });
export type TimeLog = {
  mood: number;
  stressors: number;
  weather: number;
  energy: number;
};
export type Data = {
  [date: string]: {
    "10:00": TimeLog;
    "13:00": TimeLog;
    "16:00": TimeLog;
    "19:00": TimeLog;
    "22:00": TimeLog;
  };
};

const Home: NextPage = () => {
  function showNotification() {
    new Notification("Hello World");
  }

  const [form, setForm] = useState<{
    time: string;
    mood: number;
    stressors: number;
    weather: number;
    energy: number;
  }>({
    time: "",
    mood: 0,
    stressors: 0,
    weather: 0,
    energy: 0,
  });
  const [data, setData] = useState<Data | null>(null);
  useEffect(() => {
    if (typeof window !== "undefined") {
      const data = localStorage.getItem("data");
      if (!data) {
        setData({});
        localStorage.setItem("data", JSON.stringify({}));
      } else {
        setData(JSON.parse(data) as Data);
      }

      if (!("Notification" in window)) {
        console.log("Browser does not support desktop notification");
      } else {
        Notification.requestPermission().catch((e) => console.error(e));
      }
    }
  }, []);
  useEffect(() => {
    const timer = setInterval(() => {
      const times = ["10:00", "13:00", "16:00", "19:00", "22:00", "20:27"];
      const currentHour = new Date().getHours();
      const currentMinute = new Date().getMinutes();
      const currentTime = `${currentHour}:${currentMinute}`;
      if (times.includes(currentTime)) {
        new Notification("Time to write about your mood!", {
          body: "If you don't want to, you can always change it later :)",
        });
      }
    }, 60000);
    return () => clearInterval(timer);
  }, []);
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setForm({ ...form, [name]: type === "number" ? +value : value });
  };
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const today = new Date().toDateString();
    if (!data) throw new Error("Something went wrong");
    const todayData = data[today] || {};
    const newData = {
      ...data,
      [today]: {
        ...todayData,
        [form.time]: {
          mood: form.mood,
          stressors: form.stressors,
          weather: form.weather,
          energy: form.energy,
        },
      },
    } as Data;
    localStorage.setItem("data", JSON.stringify(newData));
    setData(newData);
  };

  return (
    <>
      <div className="flex h-screen w-screen flex-col items-center justify-evenly gap-4">
        <div className="flex gap-2">
          <AreaChart data={data} />
          <DailyChart data={data} />
        </div>
        <form
          className="flex flex-col items-center justify-center gap-4"
          onSubmit={handleSubmit}
        >
          <h2 className="text-xl">
            Write these parameters on a ten-point scale
          </h2>
          <label className="flex  gap-2">
            Mood:
            <input
              type="number"
              min={1}
              max={10}
              className="rounded-lg border py-1 px-2 shadow-inner shadow-green-200"
              placeholder="10?"
              name="mood"
              required
              onChange={handleChange}
            />
          </label>
          <label className="flex gap-2">
            Energy:
            <input
              type="number"
              min={1}
              max={10}
              className="rounded-lg border py-1 px-2 shadow-inner shadow-yellow-200"
              placeholder="9?"
              name="energy"
              required
              onChange={handleChange}
            />
          </label>
          <label className="flex gap-2">
            Stressors:
            <input
              type="number"
              min={1}
              max={10}
              className="rounded-lg border py-1 px-2 shadow-inner shadow-red-200"
              placeholder="10?"
              name="stressors"
              required
              onChange={handleChange}
            />
          </label>
          <label className="flex gap-2">
            Weather:
            <input
              type="number"
              min={1}
              max={10}
              className="rounded-lg border py-1 px-2 shadow-inner shadow-blue-200"
              placeholder="6?"
              name="weather"
              required
              onChange={handleChange}
            />
          </label>
          <h2 className="text-xl">Select current time:</h2>
          <div className="flex gap-4">
            <label className="flex flex-col items-center justify-center">
              <input
                type="radio"
                value="10:00"
                name="time"
                className="border py-1 px-2 "
                onChange={handleChange}
                required
              />
              10:00
            </label>
            <label className="flex flex-col items-center justify-center">
              <input
                type="radio"
                value="13:00"
                name="time"
                className="border py-1 px-2 "
                onChange={handleChange}
                required
              />
              13:00
            </label>
            <label className="flex flex-col items-center justify-center">
              <input
                type="radio"
                value="16:00"
                name="time"
                className="border py-1 px-2 "
                onChange={handleChange}
                required
              />
              16:00
            </label>
            <label className="flex flex-col items-center justify-center">
              <input
                type="radio"
                value="19:00"
                name="time"
                className="border py-1 px-2 "
                onChange={handleChange}
                required
              />
              19:00
            </label>
            <label className="flex flex-col items-center justify-center">
              <input
                type="radio"
                value="22:00"
                name="time"
                className="border py-1 px-2 "
                onChange={handleChange}
                required
              />
              22:00
            </label>
          </div>
          <button
            className="rounded-lg border bg-green-400 py-1 px-2 font-sans text-white"
            type="submit"
          >
            Submit
          </button>
        </form>
      </div>
    </>
  );
};

export default Home;
