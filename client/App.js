import Navbar from './components/Navbar';
import Instance from './components/Instance';
import Routes from './Routes';
import React from 'react';
import EveryoneDraws from './components/EveryoneDraws';



const App = () => {

  return (
    <div>
      <Navbar />
      <EveryoneDraws />
      <Instance />
      <Routes />
    </div>
  );
};



export default App;
