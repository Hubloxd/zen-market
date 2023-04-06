import "./checkout.css";

import { useContext } from "react";
import { getUserInfo, useDocumentTitle } from "../../utils";

import { CartContext } from "../../cart";

import Navbar from "../Navbar";
import { Link } from "react-router-dom";

export default function Checkout() {
  useDocumentTitle("Zen Market | Checkout");
  const { cart, removeItemFromCart, resetCart } = useContext(CartContext);
  let sum = 0;
  cart.forEach((element) => {
    sum += element.price;
  });
  const Products = () => {
    const list: Array<JSX.Element> = [];

    cart.forEach((element) =>
      list.push(
        <tr key={element.name}>
          <td width={"128px"}>
            <Link to={`/product/${element.id}/`}>
              <img
                className="mx-auto"
                width={"128px"}
                src={element.image_src}
                alt=""
              />
            </Link>
          </td>
          <td className="px-3 capitalize">
            <Link to={`/product/${element.id}/`}>
              <p>{element.name}</p>
            </Link>
          </td>
          <td>{element.price}</td>

          <td className="w-1">
            <button
              onClick={() => {
                removeItemFromCart(element);
              }}
            >
              <svg
                fill="#ff0000"
                height="30px"
                width="24px"
                version="1.1"
                id="Capa_1"
                xmlns="http://www.w3.org/2000/svg"
                xmlnsXlink="http://www.w3.org/1999/xlink"
                viewBox="0 0 460.775 460.775"
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
                  <path d="M285.08,230.397L456.218,59.27c6.076-6.077,6.076-15.911,0-21.986L423.511,4.565c-2.913-2.911-6.866-4.55-10.992-4.55 c-4.127,0-8.08,1.639-10.993,4.55l-171.138,171.14L59.25,4.565c-2.913-2.911-6.866-4.55-10.993-4.55 c-4.126,0-8.08,1.639-10.992,4.55L4.558,37.284c-6.077,6.075-6.077,15.909,0,21.986l171.138,171.128L4.575,401.505 c-6.074,6.077-6.074,15.911,0,21.986l32.709,32.719c2.911,2.911,6.865,4.55,10.992,4.55c4.127,0,8.08-1.639,10.994-4.55 l171.117-171.12l171.118,171.12c2.913,2.911,6.866,4.55,10.993,4.55c4.128,0,8.081-1.639,10.992-4.55l32.709-32.719 c6.074-6.075,6.074-15.909,0-21.986L285.08,230.397z"></path>{" "}
                </g>
              </svg>
            </button>
          </td>
        </tr>
      )
    );

    return <>{list}</>;
  };

  return (
    <>
      <Navbar />
      <section className="mt-10 px-96">
        <button
          className="float-right bg-[#1A242F] hover:bg-[#304052] transition-colors text-white px-2 py-2 mb-2 h-full"
          onClick={() => resetCart()}
        >
          Clear Cart
        </button>

        <table className="table-auto w-full">
          <thead>
            <tr>
              <th></th>
              <th>Item Name</th>
              <th>Price</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <Products />
          </tbody>
          <tfoot>
            <tr>
              <td colSpan={120}>
                <div className="flex flex-col float-right px-64 text-right">
                  <div>Total Items: {cart.length}</div>
                  <div>Total: ${sum.toFixed(2)}</div>
                </div>
              </td>
            </tr>
          </tfoot>
        </table>
        <div className="mx-auto w-36 mt-10">
          <button
            className="bg-[#1A242F] hover:bg-[#304052] transition-colors text-white flex flex-row items-center justify-center pl-3 h-8 w-36 "
            onClick={() => resetCart()}
          >
            Checkout
            <svg
              className="max-h-full"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
              <g
                id="SVGRepo_tracerCarrier"
                stroke-linecap="round"
                stroke-linejoin="round"
              ></g>
              <g id="SVGRepo_iconCarrier">
                <path
                  d="M8.91003 19.9201L15.43 13.4001C16.2 12.6301 16.2 11.3701 15.43 10.6001L8.91003 4.08008"
                  stroke="#FFF"
                  stroke-width="1.5"
                  stroke-miterlimit="10"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                ></path>
              </g>
            </svg>
          </button>
        </div>
      </section>
    </>
  );
}
