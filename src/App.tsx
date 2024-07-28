import { useRef, useState } from 'react';
import { useInterval } from 'usehooks-ts';

const App = () => {
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [inputMinutes, setInputMinutes] = useState(0);
  const [inputSeconds, setInputSeconds] = useState(0);
  //timer status: "not started", "active", "paused", "finished"
  const [status, setStatus] = useState('not started');
  const timer = useRef(null);
  const sound = new Audio('/public/ding.mp3');

  const changeTimer = () => {
    if (status == 'active' && timer.current) {
      if (minutes == 0 && seconds == 1) {
        setStatus('finished');
        setSeconds(0);
        setMinutes(0);
        sound.play();
      } else if (seconds == 0) {
        setMinutes((prev) => prev - 1);
        setSeconds(59);
      } else {
        setSeconds((prev) => prev - 1);
      }
    }
  };

  useInterval(changeTimer, 1000);

  const resetInputs = () => {
    setInputMinutes(0);
    setInputSeconds(0);
  };

  const incrementMinutes = () => {
    setInputMinutes((prev) => prev + 1);
  };

  const decrementMinutes = () => {
    setInputMinutes((prev) => {
      if (prev < 1) {
        return 0;
      } else {
        return prev - 1;
      }
    });
  };

  const incrementSeconds = () => {
    setInputSeconds((prev) => {
      if (prev > 58) {
        return 59;
      } else {
        return prev + 1;
      }
    });
  };

  const decrementSeconds = () => {
    setInputSeconds((prev) => {
      if (prev < 1) {
        return 0;
      } else {
        return prev - 1;
      }
    });
  };

  const convertTime = (time: number) => {
    if (time == 0) {
      return '00';
    } else if (time < 10) {
      return `0${time}`;
    } else return time;
  };

  const controlTimer = () => {
    //if minute and second inputs are zero, do nothing
    if (inputMinutes == 0 && inputSeconds == 0) {
      setStatus('not started');
      return;
    }

    //if status is "not started" or "finished", set to "active"
    if (status == 'not started' || status == 'finished') {
      setStatus('active');
      setMinutes(inputMinutes);
      setSeconds(inputSeconds);
      return;
    }

    //if status is "active", set to "paused"
    if (status == 'active') {
      setStatus('paused');
      return;
    }

    //if status is "paused", set to "active"
    if (status == 'paused') {
      setStatus('active');
      return;
    }
  };

  const restartTimer = () => {
    setStatus('active');
    setMinutes(inputMinutes);
    setSeconds(inputSeconds);
  };

  return (
    <>
      <div className="timer-inputs">
        <div className="number-input-container">
          <button onClick={incrementMinutes}>+</button>
          <input
            type="number"
            value={inputMinutes}
            onChange={(e) => {
              setInputMinutes(parseInt(e.target.value));
            }}
          />
          <button onClick={decrementMinutes}>-</button>
        </div>

        <div className="number-input-container">
          <button onClick={incrementSeconds}>+</button>
          <input
            type="number"
            value={inputSeconds}
            onChange={(e) => {
              setInputSeconds(parseInt(e.target.value));
            }}
          />
          <button onClick={decrementSeconds}>-</button>
        </div>
        <button onClick={resetInputs} className="reset-inputs">
          Reset Inputs
        </button>
      </div>

      <h3
        ref={timer}
        className={
          status == 'active'
            ? 'green'
            : status == 'finished' || status == 'paused'
            ? 'red'
            : ''
        }
      >
        {status == 'not started'
          ? '-- : --'
          : `${convertTime(minutes)} :
        ${convertTime(seconds)}`}
      </h3>
      <div className="timer-controls">
        <button onClick={controlTimer}>
          {status == 'active' ? 'Pause' : 'Start'}
        </button>
        {(status == 'active' || status == 'paused') && (
          <button onClick={restartTimer}>Restart</button>
        )}
      </div>
    </>
  );
};

export default App;
