import { useEffect, useState } from 'react';
import Timer from './components/Timer';
import entries from './data';

const App = () => {
  const [warmup, setWarmup] = useState<Entry[]>(
    entries.filter((i) => i.type == 'warmup')
  );
  const [main, setMain] = useState<Entry[]>(
    entries.filter((i) => i.type == 'exercise' || i.type == 'rest')
  );
  const [cooldown, setCooldown] = useState<Entry[]>(
    entries.filter((i) => i.type == 'cooldown')
  );

  const [allEntries, setAllEntries] = useState<Entry[]>(entries);
  console.log(allEntries);

  const [currentEntry, setCurrentEntry] = useState<Entry>(entries[0]);
  console.log('current', currentEntry);
  const [nextEntry, setNextEntry] = useState<Entry>(entries[1]);

  const [currentCircuit, setCurrentCircuit] = useState(1);
  const [totalCurcuits, setTotalCurcuits] = useState(3);

  const [warmupFinished, setWarmupFinished] = useState(false);
  const [workoutFinished, setWorkoutFinished] = useState(false);

  useEffect(() => {
    //set "current entry" every time the entries array gets updated
    for (let i = 0; i < allEntries.length; i++) {
      const entry = allEntries[i];
      if (entry.isCurrent) {
        setCurrentEntry(entry);
        break;
      }
    }
    //set "next entry" every time the entries array gets updated
    for (let i = 0; i < allEntries.length; i++) {
      const entry = allEntries[i];
      if (entry.isNext) {
        setNextEntry(entry);
        break;
      }
    }
  }, [allEntries]);

  const startNextExercise = () => {
    const currentEntryIndex = allEntries.indexOf(currentEntry);
    //if at the end of the array, cycle back to the start of array again
    if (currentEntryIndex == allEntries.length - 1) {
      setAllEntries((prevEntries) => {
        return prevEntries.map((entry, index) => {
          if (index == 0) {
            return { ...entry, isCurrent: true, isNext: false };
          } else if (index == 1) {
            return { ...entry, isCurrent: false, isNext: true };
          } else {
            return { ...entry, isCurrent: false, isNext: false };
          }
        });
      });
      //if total number of circuits is reached, end the workout
      if (currentCircuit == totalCurcuits) {
        setWorkoutFinished(true);
        return;
      } else {
        setCurrentCircuit((prev) => prev + 1);
        return;
      }
      //if at penultimate entry in array, set next entry to the first index
    } else if (currentEntryIndex == allEntries.length - 2) {
      setAllEntries((prevEntries) => {
        return prevEntries.map((entry, index) => {
          if (index == allEntries.length - 1) {
            return { ...entry, isCurrent: true, isNext: false };
          } else if (index == 0) {
            return { ...entry, isCurrent: false, isNext: true };
          } else if (index == 1) {
            return { ...entry, isCurrent: false, isNext: false };
          } else {
            return { ...entry, isCurrent: false, isNext: false };
          }
        });
      });
      //else cycle through array as normal
    } else {
      setAllEntries((prevEntries) => {
        return prevEntries.map((entry, index) => {
          if (entry.isCurrent) {
            return { ...entry, isCurrent: false };
          } else if (index == currentEntryIndex + 1) {
            return { ...entry, isCurrent: true, isNext: false };
          } else if (index == currentEntryIndex + 2) {
            return { ...entry, isNext: true };
          } else return { ...entry };
        });
      });
    }
  };

  if (workoutFinished) {
    return (
      <>
        <h1>exercise timer app</h1>
        <h2>Workout Complete</h2>
      </>
    );
  }

  return (
    <>
      <h1>exercise timer app</h1>
      <p>
        Circuit: {currentCircuit} / {totalCurcuits}
      </p>
      <h2>Current Exercise: {currentEntry.name}</h2>
      {currentEntry.time ? (
        <Timer
          id={currentEntry.id}
          time={currentEntry.time}
          startNextExercise={startNextExercise}
        />
      ) : (
        <>
          <h2>Reps: {currentEntry.reps}</h2>
          <button onClick={startNextExercise}>Next Exercise</button>
        </>
      )}
      <h3>Next Exercise: {nextEntry.name}</h3>
    </>
  );
};

export default App;
