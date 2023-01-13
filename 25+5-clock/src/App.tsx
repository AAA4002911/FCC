import React, { useState, useRef } from "react";
import "./App.css";

function App() {
  const [timer, setTimer] = useState(0);
  const start_stop = useRef();
  const [bLen, setBLen] = useState(5);
  const [sLen, setSLen] = useState(25);
  const [mm, setMinute] = useState("25");
  const [ss, setSecond] = useState("00");
  const bool = useRef(false);

  const handleLength = (opr: String, type: String) => {
    if (type === "break") {
      if (opr === "+" && bLen < 60) {
        setBLen((prevState) => prevState + 1);
      } else if (opr === "-" && bLen > 1) {
        setBLen((prevState) => prevState - 1);
      }
    } else if (type === "session") {
      if (opr === "+" && sLen < 60) {
        setSLen((prevState) => prevState + 1);
        setMinute((prevState) => {
          let num = parseInt(prevState) + 1;
          if (num < 10) return "0" + num.toString();
          return num.toString();
        });
      } else if (opr === "-" && sLen > 1) {
        setSLen((prevState) => prevState - 1);
        if (mm == "00") return;
        setMinute((prevState) => {
          let num = parseInt(prevState) - 1;
          if (num < 10) return "0" + num.toString();
          return num.toString();
        });
      }
    }
  };

  const handleStart = () => {
    if (start_stop.current.innerText === "stop") {
      start_stop.current.innerText = "start";
      console.log("stop");
      clearInterval(timer);
    } else if (start_stop.current.innerText === "start") {
      start_stop.current.innerText = "stop";
      document.getElementById("timer-label").innerText = "Session";
      console.log("start");
      let id = setInterval(() => {
        setSecond((prevState) => {
          if (prevState === "00") {
            setMinute((prevStatemm) => {
              if (prevState === "60" && prevStatemm === "00") {
                setSecond("00");
                document.getElementById("timer-label").innerText =
                  "break has begun";
                if (!bool.current) {
                  setMinute(
                    bLen < 10 ? "0" + bLen.toString() : bLen.toString()
                  );
                  bool.current = true;
                } else {
                  clearInterval(id);
                  document.getElementById("beep").play();
                  return "00";
                }
              }
              if (prevStatemm === "00") return "00";
              let minute = parseInt(prevStatemm) - 1;
              if (minute < 10) return "0" + minute.toString();
              return minute.toString();
            });
          }
          if (prevState === "00") prevState = "60";
          let num = parseInt(prevState) - 1;
          if (num < 10) return "0" + num.toString();
          return num.toString();
        });
      }, 1);
      setTimer(id);
    }
  };

  const handleReset = () => {
    clearInterval(timer);
    document.getElementById("timer-label").innerText = "Session";
    setTimer(0);
    setBLen(5);
    setSLen(25);
    setMinute("25");
    setSecond("00");
    bool.current = false;
    document.getElementById("beep").pause();
    document.getElementById("beep").currentTime = 0;
    start_stop.current.innerText = "start";
  };

  return (
    <div className="App">
      <h1>25 + 5 Clock</h1>
      <div id="break-label">Break Length</div>
      <div className="controls">
        <div id="break-increment" onClick={() => handleLength("+", "break")}>
          ⬆
        </div>
        <div id="break-length">{bLen}</div>
        <div id="break-decrement" onClick={() => handleLength("-", "break")}>
          ⬇
        </div>
      </div>
      <div id="session-label">Session Length</div>
      <div className="controls">
        <div
          id="session-increment"
          onClick={() => handleLength("+", "session")}
        >
          ⬆
        </div>
        <div id="session-length">{sLen}</div>
        <div
          id="session-decrement"
          onClick={() => handleLength("-", "session")}
        >
          ⬇
        </div>
      </div>
      <div id="timer-label">Session</div>
      <div id="time-left">
        {mm}:{ss}
      </div>
      <div>
        <div id="start_stop" ref={start_stop} onClick={handleStart}>
          start
        </div>
        <div id="reset" onClick={handleReset}>
          reset
        </div>
      </div>
      <audio id="beep" preload="auto" src="emergency_alarm.mp3"></audio>
    </div>
  );
}

export default App;
