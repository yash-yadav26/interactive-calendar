import React, { useState, useEffect } from "react";
import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  format,
  isSameMonth,
  isSameDay
} from "date-fns";
import "./Calendar.css";

const Calendar = () => {
  const [today] = useState(new Date());
  const [start, setStart] = useState(null);
  const [end, setEnd] = useState(null);
  const [note, setNote] = useState("");

  // load notes
  useEffect(() => {
    const saved = localStorage.getItem("my-note");
    if (saved) setNote(saved);
  }, []);

  // save notes
  useEffect(() => {
    localStorage.setItem("my-note", note);
  }, [note]);

  const handleClick = (day) => {
    if (!start || (start && end)) {
      setStart(day);
      setEnd(null);
    } else {
      if (day < start) {
        setStart(day);
      } else {
        setEnd(day);
      }
    }
  };

  const checkInRange = (day) => {
    return start && end && day > start && day < end;
  };

  const renderDays = () => {
    const monthStart = startOfMonth(today);
    const monthEnd = endOfMonth(monthStart);

    let startDay = startOfWeek(monthStart);
    let endDay = endOfWeek(monthEnd);

    let rows = [];
    let day = startDay;

    while (day <= endDay) {
      let cells = [];

      for (let i = 0; i < 7; i++) {
        let clone = day;

        cells.push(
          <div
            key={day}
            className={`cell
              ${!isSameMonth(day, monthStart) ? "disabled" : ""}
              ${isSameDay(day, start) ? "start" : ""}
              ${isSameDay(day, end) ? "end" : ""}
              ${checkInRange(day) ? "range" : ""}
            `}
            onClick={() => handleClick(clone)}
          >
            {format(day, "d")}
          </div>
        );

        day = addDays(day, 1);
      }

      rows.push(
        <div className="row" key={day}>
          {cells}
        </div>
      );
    }

    return rows;
  };

  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <div className="container">
      
      <div className="left">
<img 
  src="https://images.unsplash.com/photo-1500530855697-b586d89ba3ee" 
  alt="calendar" 
/>
        <h2>{format(today, "MMMM yyyy")}</h2>
      </div>

      
      <div className="right">
        <div className="header">
          {weekDays.map((d) => (
            <div key={d}>{d}</div>
          ))}
        </div>

        <div className="calendar">{renderDays()}</div>

        <div className="notes">
          <h3>Notes</h3>
          <textarea
            value={note}
            placeholder="write something..."
            onChange={(e) => setNote(e.target.value)}
          />
        </div>
      </div>
    </div>
  );
};

export default Calendar;