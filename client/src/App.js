import './App.css';
import logo from './assets/logo.svg';

import SearchAccount from './components/SearchAccount';
function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
      </header>
      <SearchAccount />
    </div>
  );
}

export default App;
