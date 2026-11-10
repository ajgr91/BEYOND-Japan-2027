"use client";
import { useEffect, useState } from "react";
export default function Countdown() {
  const [remaining, setRemaining] = useState({days:0,hours:0,minutes:0,seconds:0});
  useEffect(() => {
    const target = new Date("2027-04-24T12:00:00+09:00").getTime();
    const update = () => {
      const diff = Math.max(0, target - Date.now());
      setRemaining({days:Math.floor(diff/86400000),hours:Math.floor(diff%86400000/3600000),minutes:Math.floor(diff%3600000/60000),seconds:Math.floor(diff%60000/1000)});
    };
    update(); const id = window.setInterval(update,1000); return () => window.clearInterval(id);
  },[]);
  return <div className="countdown">{Object.entries(remaining).map(([key,val])=><div className="count-unit" key={key}><strong>{String(val).padStart(2,"0")}</strong><span>{key === "days" ? "DÍAS" : key === "hours" ? "HORAS" : key === "minutes" ? "MIN" : "SEG"}</span></div>)}</div>;
}
