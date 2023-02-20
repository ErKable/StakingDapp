import React, { useState, useRef, useEffect } from "react";
import "../css/Countdown.css";
function Countdown({UNIX_timestamp}) {
  const [timerDays, setTimerDays] = useState("0");
  const [timerHours, setTimerHours] = useState("0");
  const [timerMinutes, setTimerMinutes] = useState("0");
  const [timerSeconds, setTimerSeconds] = useState("0");

  let interval = useRef();

  const startTimer = () => {
    const countDownDate = new Date(Number(UNIX_timestamp)* 1000).getTime();
    interval = setInterval(() => {
      const now = new Date().getTime();
      const distance = countDownDate - now;

      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      if (distance < 0) {
        //stop timer
        clearInterval(interval.current);
      } else {
        //update timer
        setTimerDays(days);
        setTimerHours(hours);
        setTimerMinutes(minutes);
        setTimerSeconds(seconds);
      }
    }, 1000);
  };

  useEffect(() => {
    startTimer();
    return () => {
      clearInterval(interval.current);
    };
  });
  return (
    <section className="timer-container">
      <section className="timer">
        
        <div id="countdown">
          <div className="decreasing">
            <p>Day {isNaN(timerDays) ? 0 : timerDays}</p>
          </div>
         
          <div className="decreasing">
            <p>Hour {isNaN(timerHours) ? 0 : timerHours}</p>
          </div>
          
          <div className="decreasing">
            <p>Minutes {isNaN(timerMinutes) ? 0 : timerMinutes}</p>
          </div>
          
          <div className="decreasing">
            <p>Seconds {isNaN(timerSeconds) ? 0 : timerSeconds}</p>
          </div>
        </div>
      </section>
    </section>
  );
}

export default Countdown;