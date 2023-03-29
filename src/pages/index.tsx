import { type NextPage } from "next";
import dynamic from "next/dynamic";
import {
  type ChangeEvent,
  useState,
  type FormEvent,
  useEffect,
  useRef,
} from "react";

const DailyAverage = dynamic(import("~/components/Charts/DailyAverage"), {
  ssr: false,
});
const Days = dynamic(import("~/components/Charts/Days"), {
  ssr: false,
});
export type TimeLog = {
  mood: number;
  stressors: number;
  weather: number;
  energy: number;
};
export type Data = {
  [date: string]: Day;
};

export type Day = {
  [time: string]: TimeLog;
};
export const DURATION_24_HOURS_MS = 86_400_000;
export const CHECKPOINTS = ["10:00", "13:00", "16:00", "19:00", "22:00"];

const Home: NextPage = () => {
  const audio = useRef<HTMLAudioElement | undefined>(
    typeof Audio !== "undefined"
      ? new Audio(
          "https://assets.mixkit.co/active_storage/sfx/937/937-preview.mp3"
        )
      : undefined
  );

  function playNotification() {
    if (audio.current?.volume) {
      audio.current.volume = 0.05;
    }
    audio.current?.play().catch((e) => console.error(e));
    new Notification("Time to write about your mood!", {
      body: "If you don't want to, you can always change it later :)",
    });
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
  const [previousDay, setPreviousDay] = useState<Day | undefined | null>(null);
  const isProblemWithYesterday =
    previousDay === undefined ||
    (previousDay !== null &&
      Object.keys(previousDay).length !== CHECKPOINTS.length);
  // Notifications and initial local storage
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
  // Time check interval for audio and notification
  useEffect(() => {
    const timer = setInterval(() => {
      const currentHour = new Date().getHours();
      const currentMinute = new Date().getMinutes();
      const currentTime = `${currentHour}:${currentMinute}`;
      if (CHECKPOINTS.includes(currentTime)) {
        playNotification();
      }
    }, 60000);
    return () => clearInterval(timer);
  }, [audio]);

  useEffect(() => {
    if (!data) return;
    const todayMS = new Date().getTime();
    const yesterdayDate = new Date(
      todayMS - DURATION_24_HOURS_MS
    ).toDateString();
    const yesterdayData = data[yesterdayDate];
    setPreviousDay(yesterdayData);
  }, [data]);
  // form handling
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setForm({ ...form, [name]: type === "number" ? +value : value });
  };
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    console.log(form);
    e.preventDefault();
    if (!data) throw new Error("Something went wrong");
    let prevData, date;
    if (isProblemWithYesterday) {
      const todayMS = new Date().getTime();
      const yesterdayDate = new Date(
        todayMS - DURATION_24_HOURS_MS
      ).toDateString();
      const yesterdayData = data[yesterdayDate];
      prevData = yesterdayData;
      date = yesterdayDate;
    } else {
      const todayDate = new Date().toDateString();
      const todayData = data[todayDate];
      date = todayDate;
      prevData = todayData;
    }
    const newData = {
      ...data,
      [date]: {
        ...prevData,
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
      <div className="relative flex min-h-screen flex-col  items-center justify-evenly gap-4 overflow-hidden">
        <div className="mt-4 flex w-full max-md:flex-col ">
          <DailyAverage data={data} />
          <Days data={data} />
        </div>
        <form
          className="flex flex-col items-center justify-center gap-4"
          onSubmit={handleSubmit}
        >
          <h2 className="text-xl">
            Write these parameters on a ten-point scale
          </h2>
          {isProblemWithYesterday ? (
            <>
              <h2 className="text-xl">
                Yesterday wasn&apos;t filled fully, please fill it now:
              </h2>
              <ul className="list-disc">
                {CHECKPOINTS.map((time, i) => {
                  return !previousDay || !previousDay[time] ? (
                    <li key={i}>{time}</li>
                  ) : (
                    ""
                  );
                })}
              </ul>
            </>
          ) : (
            ""
          )}
          <label className="flex  gap-2">
            Mood:
            <input
              type="number"
              min={1}
              max={10}
              value={form.mood}
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
              value={form.energy}
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
              value={form.stressors}
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
              value={form.weather}
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
        <button
          onClick={() => playNotification()}
          className="fixed bottom-4 left-4 rounded-lg border bg-green-400 py-1 px-2 font-sans text-white"
        >
          Test notifications
        </button>
      </div>
    </>
  );
};

export default Home;
