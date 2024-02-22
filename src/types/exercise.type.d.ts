type BreakOrExercise = 'rest' | 'exercise' | 'cooldown' | 'warmup';

type Entry = {
  id: number;
  type: BreakOrExercise;
  name: string;
  notes?: string;
  time?: number; //set time in seconds
  reps?: number;
  isCurrent: boolean;
  isNext: boolean;
};
