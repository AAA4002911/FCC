import { useState, useEffect } from "react";
import "./App.css";
import Key from "./components/Key";

const drumpad = [
  {
    id: 1,
    key_name: "Q",
    source: "/audio/Heater-1.mp3",
  },
  {
    id: 2,
    key_name: "W",
    source: "/audio/Heater-2.mp3",
  },
  {
    id: 3,
    key_name: "E",
    source: "/audio/Heater-3.mp3",
  },
  {
    id: 4,
    key_name: "A",
    source: "/audio/Heater-4_1.mp3",
  },
  {
    id: 5,
    key_name: "S",
    source: "/audio/Heater-6.mp3",
  },
  {
    id: 6,
    key_name: "D",
    source: "/audio/Dsc_Oh.mp3",
  },
  {
    id: 7,
    key_name: "Z",
    source: "/audio/Cev_H2.mp3",
  },
  {
    id: 8,
    key_name: "X",
    source: "/audio/Kick_n_Hat.mp3",
  },
  {
    id: 9,
    key_name: "C",
    source: "/audio/RP4_KICK_1.mp3",
  },
];

function App() {
  const [display, setDisplay] = useState("");

  useEffect(() => {
    const handleKey = (e) => {
      e = e || window.event;
      // Only accepting the required key press
      let isAllowed = [81, 87, 69, 65, 83, 68, 90, 88, 67].includes(e.keyCode);
      if (!isAllowed) {
        return;
      }

      console.log(e.key);
      drumpad.forEach((obj) => {
        if (obj.key_name === e.key.toUpperCase()) {
          setDisplay(obj.source.split("/")[2]);
        }
      });
      let audio = document.getElementById(e.key.toUpperCase());
      audio.play();
    };
    document.addEventListener("keyup", (e) => handleKey(e));
    return () => {
      document.removeEventListener("keyup", handleKey);
    };
  }, []);

  return (
    <div className="App">
      <div id="drum-machine" className="inner-container">
        <div className="pad-bank">
          {drumpad.map((data) => (
            <Key key={data.key_name} data={data} setDisplay={setDisplay} />
          ))}
        </div>
        <div id="display">{display}</div>
      </div>
    </div>
  );
}

export default App;
