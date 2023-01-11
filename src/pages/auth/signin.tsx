import React, { useState } from "react";
import {
  getProviders,
  signIn,
  getSession,
  getCsrfToken,
} from "next-auth/react";

const SignIn = ({ csrfToken }) => {
  const [email, setEmail] = useState("laaufey@gmail.com");
  const [name, setName] = useState("Laufey");
  const emailSignin = () => {
    signIn("email", { email: email, name: name, csrfToken: csrfToken });
  };
  return (
    <div>
      <form
        method="post"
        action="/api/auth/signin/email"
        // onSubmit={() => emailSignin()}
      >
        <input name="csrfToken" type="hidden" defaultValue={csrfToken} />
        <label>
          Email address
          <input
            type="email"
            id="email"
            name="email"
            // onChange={(e) => setEmail(e.target.value)}
          />
        </label>
        <label>
          Name
          <input
            type="name"
            id="name"
            name="name"
            // onChange={(e) => setName(e.target.value)}
          />
        </label>
        <button type="submit">Sign in with Email</button>
      </form>
      <button onClick={emailSignin}>CLICK</button>
    </div>
  );
};
export default SignIn;
export async function getServerSideProps(context) {
  // const providers = await getProviders();
  const csrfToken = await getCsrfToken(context);
  return {
    props: {
      // providers,
      csrfToken,
    },
  };
}
