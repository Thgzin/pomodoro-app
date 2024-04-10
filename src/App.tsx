import React from 'react';
import './App.css';
import { PomodoroTimer } from './components/pomodoro-timer';
function App() {
  return (
    <div className="App">
      <PomodoroTimer PomodoroTime={1500} ShortRestTime={450} LongRestTime={900} cycles={4} />
    </div>
  );
}

export default App;
