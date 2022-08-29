import Navbar from './components/Navbar';
import Routes from './Routes';
import React from 'react';
import EveryoneDraws from './components/EveryoneDraws';



const App = () => {

  return (
    <div>
      <Navbar />
      <EveryoneDraws />
      <Routes />
    </div>
  );
};



export default App;
