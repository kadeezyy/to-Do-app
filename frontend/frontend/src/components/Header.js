import Popup from "./Popup";

import React, {useState} from 'react'

function Header({isLogin, setLoginFlag, setUsername, setPassword}) {
  const [buttonPopup, setButtonPopup] = useState(false);
  const [login, setLoginField] = useState('');
  const [password, setPasswordField] = useState('');

  const handleChange = (event) => {
    var id = event.target.id;
    var value = event.target.value;
    if (id === 'loginField') {
      setLoginField(value);
    } else {
      setPasswordField(value);
    } 
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log(login);
    console.log(password);
    setLoginFlag(true);
    setUsername(login);
    setPassword(password);
    localStorage.setItem('username', login);
    localStorage.setItem('password', password);
    window.location.reload();
    }

  const handleLogout = () => {
    setLoginField('')
    setPasswordField('')
    setUsername('');
    setPassword('');
    setLoginFlag(false)
    localStorage.setItem('username', '');
    localStorage.setItem('password', '');
    window.location.reload();
  }

  return (
    <div className="header">
      <nav className="navbar navbar-light bg-light">
                    <a className="navbar-brand c-white" >toDo App</a>
                    {!isLogin ? 
                    (<div>
                      <button onClick={() => {setButtonPopup(true)}} className="btn btn-outline-success my-2 my-sm-0" >Login</button>
                      <Popup trigger={buttonPopup} setTrigger={setButtonPopup}> 
                        <div>
                          <h2 className="fw-bold mb-2 text-center">Sign in</h2>
                          <p>Please enter your login and password</p>
                          <div>
                            <input type="text" onChange={handleChange} className="form-control form-control-lg" id="loginField" value={login}></input>
                            <label className="form-label" >Login</label>
                          </div>
                          <div>
                            <input type="password" onChange={handleChange} className="form-control form-control-lg" id="passwordField" value={password}/>
                            <label className="form-label" >Password</label>
                          </div>
                          <button onClick={handleSubmit} className="ripple ripple-surface btn btn-primary btn-lg" role="button">Login</button>
                        </div>
                      </Popup>
                    </div>) : (<button onClick={() => {handleLogout()}} className="btn btn-secondary" type="button">Logout</button>) }
                    
                    
                </nav>
    </div>
  )
}

export default Header