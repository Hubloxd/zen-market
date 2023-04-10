import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

import Navbar from "../Navbar";
import { getCookie, useDocumentTitle } from "../../utils";
import { API_URL } from "../../constants";

export function RegisterForm() {
  const [formData, setFormData] = useState({
    username: "",
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState<null | string>(null);
  const navigate = useNavigate();

  const handleChange = (
    key:
      | "username"
      | "password"
      | "email"
      | "confirmPassword"
      | "firstName"
      | "lastName",
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    formData[key] = event.target.value;
    setFormData(formData);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    setError(null);
    event.preventDefault();

    const { username, email, firstName, lastName, password, confirmPassword } =
      formData;
    const csrftoken = getCookie("csrftoken");

    const validateInputs = () => {
      let error = "";
      if (!username) {
        error += "Username must not be empty. ";
      }
      if (!firstName) {
        error += "First Name must not be empty. ";
      }
      if (!lastName) {
        error += "Last Name must not be empty. ";
      }
      if (!email) {
        error += "Email must not be empty. ";
      }
      if (!password) {
        error += "Password must not be empty. ";
      } else if (password !== confirmPassword) {
        error += "Passwords do not match. ";
      }
      return error;
    };

    const error = validateInputs();
    if (error) {
      setError(error.trim());
      return;
    }
    try {
      const response = await fetch(API_URL + "users/", {
        method: "POST",
        headers: {
          Cookie: `csrftoken=${csrftoken};`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          first_name: firstName,
          last_name: lastName,
          email,
          password,
        }),
      });
      const data = await response.json();
      console.log(data);
      navigate("/account/login/");
    } catch (error: any) {
      console.error(error);
      setError(error.message);
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
      <h1 className="text-center text-4xl my-10">Register</h1>
      <input
        onChange={(e) => handleChange("username", e)}
        type="text"
        name="username"
        id="username"
        placeholder="Username"
      />
      <input
        onChange={(e) => handleChange("firstName", e)}
        type="text"
        name="first_name"
        id="firstName"
        placeholder="First Name"
      />
      <input
        onChange={(e) => handleChange("lastName", e)}
        type="text"
        name="last_name"
        id="lastName"
        placeholder="Last Name"
      />
      <input
        onChange={(e) => handleChange("email", e)}
        type="email"
        name="email"
        id="email"
        placeholder="Email"
      />
      <input
        onChange={(e) => handleChange("password", e)}
        type="password"
        name="password"
        id="password"
        placeholder="Password"
      />
      <input
        onChange={(e) => handleChange("confirmPassword", e)}
        type="password"
        name="confirm-password"
        id="confirm-password"
        placeholder="Confirm Password"
      />

      {error ? (
        <div className="text-red-600 font-light w-64">{error}</div>
      ) : null}

      <div className="flex flex-row w-full justify-between mt-5 items-center">
        <button
          className="w-1/3 border rounded-lg py-2 transition-colors hover:bg-black hover:text-white"
          type="submit"
        >
          Submit
        </button>
        <div className="flex flex-col">
          <span className="font-extralight">already registered?</span>
          <Link to={"/account/login/"}>
            <button className="float-right">Log In</button>
          </Link>
        </div>
      </div>
    </form>
  );
}

export default function Register() {
  useDocumentTitle("Zen Market | Register");

  return (
    <>
      <div className="absolute w-full">
        <Navbar />
      </div>
      <section className="h-screen flex justify-center items-center">
        <RegisterForm />
      </section>
    </>
  );
}
