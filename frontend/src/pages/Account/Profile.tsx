import { useContext, useEffect } from "react";
import Navbar from "../Navbar";
import { UserContext } from "../../contexts/user";

export default function Profile() {
  const { user, fetchUser } = useContext(UserContext);
  
  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <>
      <Navbar />
      <h1>Pozdro {JSON.stringify(user)}</h1>
    </>
  );
}
