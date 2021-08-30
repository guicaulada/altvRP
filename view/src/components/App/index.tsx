import React from 'react';
import proxy from '../../modules/proxy';
import './style.css';

function App() {
  const testEvents = React.useCallback(async () => {
    proxy.sayMyName = (name: string) => {
      console.log(name);
      return name.toUpperCase() + "!";
    }
    console.log((await proxy.helloDaddy('HI DAD!')));
  }, [])

  React.useEffect(() => {
    testEvents();
  })

  return (
    <div className="App">
      <header className="App-header">
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
