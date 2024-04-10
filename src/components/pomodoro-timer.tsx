/* eslint-disable @typescript-eslint/no-var-requires */
import React, { useEffect, useState, useCallback } from 'react';
import { useInterval } from '../hooks/use-interval';
import { Button } from './button';
import { Timer } from './timer';
import { secondsToTime } from '../utils/seconds-to-time';

const bellStart = require('../sounds/bell-finish.mp3');
const bellFinish = require('../sounds/bell-start.mp3');

const audioStartWorking = new Audio(bellStart);
const audioStopWorking = new Audio(bellFinish);

interface Props {
  PomodoroTime: number;
  ShortRestTime: number;
  LongRestTime: number;
  cycles: number;
}

export function PomodoroTimer(props: Props) {
  const [mainTime, setMainTime] = React.useState(props.PomodoroTime);
  const [timeCounting, setTimeCounting] = React.useState(false);
  const [working, setWorking] = React.useState(false);
  const [resting, setResting] = React.useState(false);
  const [cycles, setCycles] = React.useState(new Array(props.cycles - 1).fill(true));
  const [completedCycles, setCompletedCycles] = React.useState(0);
  const [fullWorkingTime, setfullWorkingTime] = React.useState(0);
  const [numberOfPomodoros, setNumberOfPomodoros] = React.useState(0);

  useInterval(
    () => {
      setMainTime(mainTime - 1);
      if (working) setfullWorkingTime(fullWorkingTime + 1);
    },
    timeCounting ? 900 : null,
  );

  const configWork = useCallback(() => {
    setTimeCounting(true);
    setWorking(true);
    setResting(false);
    setMainTime(props.PomodoroTime);
    audioStartWorking.play();
  }, [setTimeCounting, setWorking, setResting, setMainTime, props.PomodoroTime]);

  const configRest = useCallback(
    (long: boolean) => {
      setTimeCounting(true);
      setWorking(false);
      setResting(true);
      if (long) {
        setMainTime(props.LongRestTime);
      } else {
        setMainTime(props.ShortRestTime);
      }
      audioStopWorking.play();
    },
    [setTimeCounting, setWorking, setResting, setMainTime, props.LongRestTime, props.ShortRestTime],
  );

  useEffect(() => {
    if (working) document.body.classList.add('working');
    if (resting) document.body.classList.remove('working');
    if (mainTime > 0) return;

    if (working && cycles.length > 0) {
      configRest(false);
      cycles.pop();
    } else if (working && cycles.length <= 0) {
      configRest(true);
      setCycles(new Array(props.cycles - 1).fill(true));
      setCompletedCycles(completedCycles + 1);
    }

    if (working) setNumberOfPomodoros(numberOfPomodoros + 1);
    if (resting) configWork();
  }, [
    working,
    resting,
    mainTime,
    configRest,
    setCycles,
    configWork,
    cycles,
    numberOfPomodoros,
    props.cycles,
    completedCycles,
  ]);

  return (
    <div className="pomodoro">
      <h2>You are: {working ? 'Working' : 'Resting'}</h2>
      <Timer mainTime={mainTime} />
      <div className="controls">
        <Button text="Work" onClick={() => configWork()}></Button>
        <Button className={!working && !resting ? 'hidden' : ''} text="Rest" onClick={() => configRest(false)}></Button>
        <Button
          className={!working && !resting ? 'hidden' : ''}
          text={timeCounting ? 'Pause' : 'Play'}
          onClick={() => setTimeCounting(!timeCounting)}
        ></Button>
      </div>
      <div className="details">
        <p>Cycles Completed: {completedCycles}</p>
        <p>Time working: {secondsToTime(fullWorkingTime)}</p>
        <p>Number of Pomodoros Completed: {numberOfPomodoros}</p>
      </div>
    </div>
  );
}
