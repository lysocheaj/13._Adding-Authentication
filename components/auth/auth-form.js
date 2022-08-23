import { useState, useRef } from "react";
import classes from "./auth-form.module.css";
import { signIn } from 'next-auth/react';

async function createUser(email, password) {
  const response = await fetch("/api/auth/signup", {
    method: "POST",
    body: JSON.stringify({ email, password }),
    headers: { "Content-Type": "application/json" },
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "Something went wrong!");
  }

  return data;
}

function AuthForm() {
  const [isLogin, setIsLogin] = useState(true);
  const enteredInputEmail = useRef();
  const enteredInputPassword = useRef();

  function switchAuthModeHandler() {
    setIsLogin((prevState) => !prevState);
  }

  async function submitHandler(event) {
    event.preventDefault();
    const emailInput = enteredInputEmail.current.value;
    const passwordInput = enteredInputPassword.current.value;

    // add validation

    if (isLogin) {
      // log user in
      const result = await signIn("credentials", {
        redirect: false,
        email: emailInput,
        password: passwordInput,
      });
      console.log("result :", result);
    } else {
      try {
        const result = await createUser(emailInput, passwordInput);
        console.log(result);
      } catch (err) {
        console.log(err.message);
      }
    }
  }

  return (
    <section className={classes.auth}>
      <h1>{isLogin ? "Login" : "Sign Up"}</h1>
      <form onSubmit={submitHandler}>
        <div className={classes.control}>
          <label htmlFor="email">Your Email</label>
          <input type="email" id="email" required ref={enteredInputEmail} />
        </div>
        <div className={classes.control}>
          <label htmlFor="password">Your Password</label>
          <input
            type="password"
            id="password"
            required
            ref={enteredInputPassword}
          />
        </div>
        <div className={classes.actions}>
          <button>{isLogin ? "Login" : "Create Account"}</button>
          <button
            type="button"
            className={classes.toggle}
            onClick={switchAuthModeHandler}
          >
            {isLogin ? "Create new account" : "Login with existing account"}
          </button>
        </div>
      </form>
    </section>
  );
}

export default AuthForm;
