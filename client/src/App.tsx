import React, { useState, useEffect } from 'react';
import './App.css';

import { signup, login, api, Resource } from './apiLib';

interface AppProps {}

const App = ({}: AppProps) => {
  const email = 'bob@gmail.com';
  const password = '123';

  const [box, setBox] = useState();
  useEffect(() => {
    (async () => {
      try {
        const res = await signup('bob', email, password);
        console.log('signed up', res);
        await login(email, password);
        console.log('logged in');
        const box = await api.CREATE(Resource.box, { height: 4 });
        setBox(box);
      } catch (err) {
        console.log(err);
      }
    })();
  });

  return (
    <div className="App">
      <header className="App-header">
        {/* <img src={logo} className="App-logo" alt="logo" /> */}
        <p>Box</p>
        <p>{JSON.stringify(box)}</p>
      </header>
    </div>
  );
};

export default App;
