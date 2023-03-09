import React, {useState} from 'react'
import Header from './components/Header';
import App from './App';

function MainApp() {
    const [username, setUsername] = useState(localStorage.getItem('username'));
    const [password, setPassword] = useState(localStorage.getItem('password'));
    const [isLogin, setLogin] =  useState(localStorage.getItem('username') !== '');

  return (
    <div>
        <Header isLogin={isLogin} setLoginFlag={setLogin} setUsername={setUsername} setPassword={setPassword} />
        <App username={username} password ={password} isLoggedIn={isLogin} />
    </div>
  )
}

export default MainApp