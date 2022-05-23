import './App.css';
import Logo from './assets/logo';

import SearchAccount from './components/SearchAccount';
function App() {
  return (
    <div className="App">
      <header className="App-header">
        <Logo />
        <h1>
          Github counter extensions
        </h1>
      </header>
      <SearchAccount />
    </div>
  );
}

export default App;
