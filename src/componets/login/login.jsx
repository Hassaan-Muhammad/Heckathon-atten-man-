import { useState } from "react";
import "./login.css"
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

function Login() {
 
  const [Email, setEmail] = useState("")
  const [Password, setPassword] = useState("")


  const LoginHandler = (e) => {
    e.preventDefault();


    const auth = getAuth();
    signInWithEmailAndPassword(auth, Email, Password)
      .then((userCredential) => {
        // Signed in 
        const user = userCredential.user;
        console.log("Login succesful",user)
        // ...
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log("Firebase login error",errorCode,errorMessage)
      });


    // e.reset();
  }


  return (
    <div className="loginMain">
      <form className="loginForm" onSubmit={LoginHandler}>
        <h1>ADMIN LOGIN</h1>
        <input className="input1" placeholder="Enter Email"  type="email" name="email" autoComplete="on" onChange={(e) => { setEmail(e.target.value) }} />
        <br />
        <input className="input1" placeholder="Enter Password" type="Password" name="current-password" autoComplete="current-password"  onChange={(e) => { setPassword(e.target.value) }} />
        <br />
        <button  className="loginButton" type="submit">LOGIN</button>
      </form>
    </div>
  );
}

export default Login;