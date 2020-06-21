import React, { useState, useEffect } from 'react';
import './App.css';

import { signup, login, api, Resource } from './apiLib';

interface AppProps {}
const randEmail = () => `${Date.now()}@gmail.com`;

const App = ({}: AppProps) => {
  let email = 'bob@gmail.com';
  email = randEmail();
  const password = '123';

  const [box, setBox] = useState();
  useEffect(() => {
    (async () => {
      try {
        // const box2 = await api.CREATE(Resource.box, { height: 4 });
        await signup('bob', email, password);
        await login(email, password);
        const box = await api.CREATE(Resource.box, { height: 4 });
        setBox(box);
      } catch (err) {
        console.log(err);
      }
    })();
  }, []);

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
