import { useState } from "react";
import { getAuth, createUserWithEmailAndPassword,updateProfile } from "firebase/auth";



function Signup() {

  const [Name, setName] = useState("")
  const [Email, setEmail] = useState("")
  const [Password, setPassword] = useState("")


  const SignupHandler = (e) => {
    e.preventDefault();

    const auth = getAuth();

    createUserWithEmailAndPassword(auth, Email, Password)
      .then((userCredential) => {
        // Signed in 
        const user = userCredential.user;
        console.log("user", user)


        updateProfile(auth.currentUser, {
          displayName: Name 
        }).then(() => {
          // Profile updated!
          // ...
        }).catch((error) => {
          // An error occurred
          // ...
        });
    



        // ...
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log("Firebase singup error", errorCode, errorMessage)
      });


  
  

    // e.reset();
  }


  return (
    <div>
      <p>This is Signup Page</p>

      <form onSubmit={SignupHandler}>
        <input type="text" autoComplete="on" name="name" placeholder="Name" onChange={(e) => { setName(e.target.value) }} />
        <br />
        <input type="email" name="email" placeholder="email" autoComplete="on" onChange={(e) => { setEmail(e.target.value) }} />
        <br />
        <input type="Password" name="new-password" autoComplete="new-password" placeholder="password" onChange={(e) => { setPassword(e.target.value) }} />
        <br />
        <input type="Password" name="new-password" autoComplete="new-password" placeholder="password" />
        <br />
        <button type="submit">Sign up</button>
      </form>
    </div>
  );
}

export default Signup;