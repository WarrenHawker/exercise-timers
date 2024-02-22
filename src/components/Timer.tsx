import { useEffect, useState, useRef } from 'react';
import { useInterval } from 'usehooks-ts';

interface Props {
  id: number;
  time: number;
  startNextExercise: () => void;
}

export default function Timer({ id, time, startNextExercise }: Props) {
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [pause, setPause] = useState(false);
  const [finished, setFinished] = useState(false);
  const timer = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    setPause(false);
    setFinished(false);
    if (time < 60) {
      setMinutes(0);
      setSeconds(time);
    } else {
      setMinutes(Math.floor(time / 60));
      setSeconds(time % 60);
    }
  }, [id]);

  const changeTimer = () => {
    if (timer.current) {
      if (pause) {
        timer.current.classList.toggle('red');
      } else {
        if (minutes == 0 && seconds == 1) {
          setFinished(true);
          setPause(true);
          timer.current.classList.toggle('red');
          setSeconds(0);
        } else if (seconds == 0) {
          setMinutes((prevMinutes) => prevMinutes - 1);
          setSeconds(59);
        } else {
          setSeconds((prevSeconds) => prevSeconds - 1);
        }
      }
    }
  };

  useInterval(changeTimer, pause ? null : 1000);

  const convertTime = (time: number) => {
    if (time == 0) {
      return '00';
    } else if (time < 10) {
      return `0${time}`;
    } else return time;
  };

  const minutesDisplay = convertTime(minutes);
  const secondsDisplay = convertTime(seconds);

  return (
    <div className="timer">
      <h3 ref={timer}>
        {minutesDisplay} : {secondsDisplay}
      </h3>
      {finished ? (
        <button onClick={startNextExercise}>Next Exercise</button>
      ) : (
        <button onClick={() => setPause((prev) => !prev)}>
          {pause ? 'resume' : 'pause'}
        </button>
      )}
    </div>
  );
}
