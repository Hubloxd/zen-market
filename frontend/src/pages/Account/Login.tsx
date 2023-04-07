import "./account.css";

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { API_URL } from "../../constants";
import { useDocumentTitle } from "../../utils";

import Navbar from "../Navbar";

export const LoginForm = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [error, setError] = useState<null | string>(null);
  const navigate = useNavigate();

  const handleChange = (
    key: "username" | "password",
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    formData[key] = event.target.value;
    setFormData(formData);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      const response = await fetch(API_URL + "auth/login/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: formData.username,
          password: formData.password,
        }),
      });

      if (!response.ok) {
        throw response.status;
      }
      navigate("/account/profile/");
    } catch (error) {
      if (error === 401) {
        setError("Access denied: wrong username or password.");
      } else {
        setError("Unexpected error");
      }
    }
  };

  return (
    <form
      id="login-form"
      method="post"
      onSubmit={handleSubmit}
      className="flex flex-col border w-96"
    >
      <h1 className="text-center text-4xl font-light">Zen Market</h1>
      <h1 className="text-center text-4xl my-10">Log In</h1>
      <input
        onChange={(e) => handleChange("username", e)}
        type="text"
        name="username"
        id="username"
        placeholder="username"
      />
      <input
        onChange={(e) => handleChange("password", e)}
        type="password"
        name="password"
        id="password"
        placeholder="password"
      />

      {error ? <div className="text-red-600 font-light">{error}</div> : null}

      <div className="flex flex-row w-full justify-between mt-5 items-center">
        <button
          className="w-1/3 border rounded-lg py-2 transition-colors hover:bg-black hover:text-white"
          type="submit"
        >
          Log In
        </button>
        <div className="flex flex-col">
          <span className="font-extralight">not yet registered?</span>
          <Link to={"/account/register"}>
            <button className="float-right">Register</button>
          </Link>
        </div>
      </div>
    </form>
  );
};

export default function Login() {
  useDocumentTitle("Zen Market | Log In");
  return (
    <>
      <div className="absolute w-full">
        <Navbar />
      </div>
      <section className="h-screen flex justify-center items-center">
        <LoginForm />
      </section>
    </>
  );
}
