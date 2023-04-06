import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Navbar from "../Navbar";
import { useDocumentTitle } from "../../utils";

export function RegisterForm() {
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

  const handleSubmit = () => {};

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
        <Link to={"/account/register"}>
          <button className="">Register</button>
        </Link>
        <button
          className="w-1/3 border rounded-lg py-2 transition-colors hover:bg-black hover:text-white"
          type="submit"
        >
          Submit
        </button>
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
