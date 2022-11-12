
import './App.css';
import { Routes, Route, Link, Navigate } from "react-router-dom";
import { useEffect, useState } from 'react';
import Home from "./componets/home/home";
import About from "./componets/about/about";
import Login from './componets/login/login';


import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";


function App() {

  const [isLogin, setisLogin] = useState(false)



  useEffect(() => {

    const auth = getAuth();
    const unSubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/firebase.User
        const uid = user.uid;
        console.log("auth login:", uid)
        setisLogin(true)

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


      {
        (isLogin) ?
          <ul className='navBar'>
            <li className='navComp'> <Link to={"/"} >CLASS ASSIGNING</Link></li>
            <li className='navComp'> <Link to={"about"} >STUDENT DATA </Link></li>
            <li > <button className='navButton' onClick={logoutHandler}> LOGOUT</button></li>
          </ul>
          :
          null
         
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
          {/* <Route path="signup" element={<Signup />} /> */}
          <Route path="*" element={<Navigate to={"/"} replace={true} />} />
        </Routes>
      }





    </div>
  );
}

export default App;
