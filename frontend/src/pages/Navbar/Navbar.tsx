import "./navbar.css";

import { Link, useNavigate } from "react-router-dom";
import React, { useContext, useState } from "react";
import { CartContext } from "../../cart";

const SearchInput = () => {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      // 👇 Get input value
      var url = "/search?q=" + query;
      navigate(url, { replace: true });
    }
  };

  return (
    <input
      className="bg-inherit border-b border-r border-white outline-none w-28 h-6"
      type="search"
      id="search"
      name="search"
      value={query}
      onChange={handleChange}
      onKeyDown={handleKeyDown}
    />
  );
};

const Cart = () => {
  const { cart } = useContext(CartContext);

  return (
    <Link to={"/checkout"}>
      <div className="ml-2 flex flex-col relative cursor-pointer w-12">
        <svg
          fill="#FFF"
          version="1.1"
          id="Capa_1"
          xmlns="http://www.w3.org/2000/svg"
          xmlnsXlink="http://www.w3.org/1999/xlink"
          viewBox="0 0 902.86 902.86"
          xmlSpace="preserve"
        >
          <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
          <g
            id="SVGRepo_tracerCarrier"
            strokeLinecap="round"
            strokeLinejoin="round"
          ></g>
          <g id="SVGRepo_iconCarrier">
            <g>
              <g>
                <path d="M671.504,577.829l110.485-432.609H902.86v-68H729.174L703.128,179.2L0,178.697l74.753,399.129h596.751V577.829z M685.766,247.188l-67.077,262.64H131.199L81.928,246.756L685.766,247.188z"></path>
                <path d="M578.418,825.641c59.961,0,108.743-48.783,108.743-108.744s-48.782-108.742-108.743-108.742H168.717 c-59.961,0-108.744,48.781-108.744,108.742s48.782,108.744,108.744,108.744c59.962,0,108.743-48.783,108.743-108.744 c0-14.4-2.821-28.152-7.927-40.742h208.069c-5.107,12.59-7.928,26.342-7.928,40.742 C469.675,776.858,518.457,825.641,578.418,825.641z M209.46,716.897c0,22.467-18.277,40.744-40.743,40.744 c-22.466,0-40.744-18.277-40.744-40.744c0-22.465,18.277-40.742,40.744-40.742C191.183,676.155,209.46,694.432,209.46,716.897z M619.162,716.897c0,22.467-18.277,40.744-40.743,40.744s-40.743-18.277-40.743-40.744c0-22.465,18.277-40.742,40.743-40.742 S619.162,694.432,619.162,716.897z"></path>
              </g>
            </g>
          </g>
        </svg>
        Cart
        {cart.length !== 0 ? (
          <div className="absolute right-0 bottom-6 bg-slate-700 text-white w-6 text-center justify-center rounded-full">
            {cart.length}
          </div>
        ) : null}
        {/* <h2>Shopping Cart</h2> */}
        {/* {cart.length === 0 && <p>Your cart is empty</p>} */}
        {/* {cart.map((item) => (
            <div>{cart.length}</div>
            ))} */}
        {/* {cart.length} */}
      </div>
    </Link>
  );
};

export default function Navbar() {
  return (
    <>
      <header className="h-20 flex flex-row justify-between bg-black text-white px-10">
        <div className="w-96 ">languages</div>
        <div className="w-64">
          <Link
            to={"/"}
            className="flex flex-row items-center h-full text-center"
          >
            <img className=" h-5/6" src="/static/img/logo.webp" alt="logo" />
            <h1 className="w-full text-3xl">Zen Market</h1>
          </Link>
        </div>
        <div className="w-96 flex flex-row items-center justify-evenly">
          <svg
            className="w-5 mr-2"
            fill="#FFF"
            version="1.1"
            id="Capa_1"
            xmlns="http://www.w3.org/2000/svg"
            xmlnsXlink="http://www.w3.org/1999/xlink"
            viewBox="0 0 490.4 490.4"
            xmlSpace="preserve"
          >
            <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
            <g
              id="SVGRepo_tracerCarrier"
              strokeLinecap="round"
              strokeLinejoin="round"
            ></g>
            <g id="SVGRepo_iconCarrier">
              {" "}
              <g>
                {" "}
                <path d="M484.1,454.796l-110.5-110.6c29.8-36.3,47.6-82.8,47.6-133.4c0-116.3-94.3-210.6-210.6-210.6S0,94.496,0,210.796 s94.3,210.6,210.6,210.6c50.8,0,97.4-18,133.8-48l110.5,110.5c12.9,11.8,25,4.2,29.2,0C492.5,475.596,492.5,463.096,484.1,454.796z M41.1,210.796c0-93.6,75.9-169.5,169.5-169.5s169.6,75.9,169.6,169.5s-75.9,169.5-169.5,169.5S41.1,304.396,41.1,210.796z"></path>{" "}
              </g>{" "}
            </g>
          </svg>
          <SearchInput />
          <Link to={"/account"}>
            <div className="w-12 flex flex-col items-center">
              <svg
                className="max-h-full"
                fill="#FFF"
                viewBox="0 0 32 32"
                xmlns="http://www.w3.org/2000/svg"
                stroke="#FFF"
              >
                <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                <g
                  id="SVGRepo_tracerCarrier"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                ></g>
                <g id="SVGRepo_iconCarrier">
                  <path d="M16 15.503A5.041 5.041 0 1 0 16 5.42a5.041 5.041 0 0 0 0 10.083zm0 2.215c-6.703 0-11 3.699-11 5.5v3.363h22v-3.363c0-2.178-4.068-5.5-11-5.5z"></path>
                </g>
              </svg>
              Account
            </div>
          </Link>
          <Cart />
        </div>
      </header>
      <div id="navbar" className="flex flex-row justify-around py-4 text-white">
        <nav>
          <nav>
            <Link to={"/"}>Home</Link>
          </nav>
        </nav>
        <nav>
          <Link to={"/"}>Home</Link>
        </nav>
        <nav>
          <Link to={"/"}>Home</Link>
        </nav>
        <nav className=" bg-orange-500">
          <Link to={"/search?tag=sale"}>SALES</Link>
        </nav>
      </div>
    </>
  );
}
