import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [registerUsername, setRegisterUsername] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  const register = () => {
    axios({
      method: "POST",
      data: {
        username: registerUsername,
        email: registerEmail,
        password: registerPassword,
      },
      withCredentials: true,
      url: "http://localhost:3000/api/users/signup",
    }).then((res) => console.log(res));
  };

  const login = () => {
    axios({
      method: "POST",
      data: {
        email: loginEmail,
        password: loginPassword,
      },
      withCredentials: true,
      url: "http://localhost:3000/api/users/login",
    }).then((res) => console.log(res));
  };

  return (
    <div className="App">
      <div>
        <h1>Register</h1>
        <input placeholder="username" onChange={(e) => setRegisterUsername(e.target.value)} />
        <input placeholder="email" onChange={(e) => setRegisterEmail(e.target.value)} />
        <input placeholder="password" onChange={(e) => setRegisterPassword(e.target.value)} />
        <button onClick={register}>Submit</button>
      </div>
      <div>
        <h1>Login</h1>
        <input placeholder="email" onChange={(e) => setLoginEmail(e.target.value)} />
        <input placeholder="password" onChange={(e) => setLoginPassword(e.target.value)} />
        <button onClick={login}>Submit</button>
      </div>
    </div>
  );
}

export default App;