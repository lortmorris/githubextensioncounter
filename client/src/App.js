import './App.css';
import Logo from './assets/logo';

import AppProviderContext from './providers/AppProvider';

import SearchAccount from './components/SearchAccount';
function App() {
  return (
    <AppProviderContext>
      <div className="App">
        <header className="App-header">
          <Logo />
          <h1>
            Github counter extensions
          </h1>
        </header>
        <SearchAccount />
      </div>
    </AppProviderContext>
  );
}

export default App;
