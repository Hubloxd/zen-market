import { getCookie, getUserInfo } from "../../utils";
import Navbar from "../Navbar";

export default function Profile() {
  const csrftoken = getCookie("csrftoken");

  if (csrftoken) {
    getUserInfo(csrftoken);
  }

  return (
    <>
      <Navbar />
    </>
  );
}
