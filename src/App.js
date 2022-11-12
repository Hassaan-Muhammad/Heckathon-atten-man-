
import './App.css';
import { Routes, Route, Link, Navigate } from "react-router-dom";
import { useEffect, useState } from 'react';
import Home from "./componets/home/home";
import About from "./componets/about/about";
import Login from './componets/login/login';
import Signup from './componets/signup/signup';

import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";


function App() {

  const [isLogin, setisLogin] = useState(false)
  const [fullname, setfullname] = useState(false)


  useEffect(() => {

    const auth = getAuth();
    const unSubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/firebase.User
        const uid = user.uid;
        console.log("auth login:", uid)
        setisLogin(true)

        console.log("Auth username", auth.currentUser.displayName)
        setfullname(auth.currentUser.displayName)

        // ...
      } else {
        console.log("auth logout:")
        // User is signed out
        // ...
        setisLogin(false)
      }
    });

    return () => {
      console.log("Clean up function")
      unSubscribe();
    }
  }, [])

  const logoutHandler = () => {


    const auth = getAuth();
    signOut(auth).then(() => {
      console.log("Logout succcesfull")
      // Sign-out successful.
    }).catch((error) => {
      console.log("Logout failed")
      // An error happened.
    });
  }


  return (
    <div>

      {/* <button onClick={() => { (setisLogin(!isLogin)) }}>Toggle login test</button> */}

      {
        (isLogin) ?
          <ul className='navBar'>
            <li> <Link to={"/"} >Home</Link></li>
            <li> <Link to={"about"} >About</Link></li>
            <li> <button onClick={logoutHandler}> Logout</button></li>
            <li>{fullname}</li>
          </ul>
          :
          <ul className='navBar'>
            <li> <Link to={"login"} >Login</Link></li>
            <li> <Link to={"signup"} >signup</Link></li>
          </ul>
      }


      {(isLogin) ?
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="about" element={<About />} />
          <Route path="*" element={<Navigate to={"/"} replace={true} />} />
        </Routes>
        :
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="signup" element={<Signup />} />
          <Route path="*" element={<Navigate to={"/"} replace={true} />} />
        </Routes>
      }





    </div>
  );
}

export default App;
