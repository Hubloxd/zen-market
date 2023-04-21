import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { Link, useNavigate } from "react-router-dom";

import { getCookie, useDocumentTitle } from "../../utils";
import { CartContext } from "../../contexts/cart";
import { UserContext } from "../../contexts/user";

import Navbar from "../Navbar";
import "./checkout.css";
import { API_URL } from "../../constants";

interface SummaryInterface {
  payment_method: "balance" | "credit_card";
  address: string;
  phone_number: string;
}

export default function Checkout() {
  const { isLogged } = useContext(UserContext);
  const navigate = useNavigate();

  const [stage, setStage] = useState(<Stage1 />);
  const [summary, setSummary] = useState<SummaryInterface>(
    {} as SummaryInterface
  );

  useEffect(() => {
    if (!isLogged()) {
      navigate("/account/");
    }
  }, []);

  useDocumentTitle("Zen Market | Checkout");

  const goToNextStage = useCallback(() => {
    setStage((currentStage) => {
      switch (currentStage.type) {
        case Stage1:
          return <Stage2 setter={setSummary} />;
        case Stage2:
          return <Stage3 summary={summary} />;
        default:
          return <Stage1 />;
      }
    });
  }, [summary]);

  return (
    <>
      <Navbar />
      {stage}
      {stage.type === Stage1 || stage.type === Stage2 ? (
        <button
          className="bg-[#1A242F] hover:bg-[#304052] transition-colors text-white flex flex-row items-center justify-center pl-3 h-8 w-36 mx-auto"
          onClick={goToNextStage}
        >
          Proceed
          <svg
            className="max-h-full"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
            <g
              id="SVGRepo_tracerCarrier"
              strokeLinecap="round"
              strokeLinejoin="round"
            ></g>
            <g id="SVGRepo_iconCarrier">
              <path
                d="M8.91003 19.9201L15.43 13.4001C16.2 12.6301 16.2 11.3701 15.43 10.6001L8.91003 4.08008"
                stroke="#FFF"
                strokeWidth="1.5"
                strokeMiterlimit="10"
                strokeLinecap="round"
                strokeLinejoin="round"
              ></path>
            </g>
          </svg>
        </button>
      ) : null}
    </>
  );
}

const Stage1 = () => {
  const { cart, removeItemFromCart, resetCart } = useContext(CartContext);

  const Products = React.memo(() => {
    return (
      <>
        {cart.map((item) => (
          <tr key={item.id}>
            <td width="128px">
              <Link to={`/product/${item.id}/`}>
                <img
                  className="mx-auto"
                  width="128px"
                  src={item.image_src}
                  alt=""
                />
              </Link>
            </td>
            <td className="px-3 capitalize">
              <Link to={`/product/${item.id}/`}>
                <p>{item.name}</p>
              </Link>
            </td>
            <td>${item.discount_price || item.price}</td>
            <td className="w-1">
              <button onClick={() => removeItemFromCart(item)}>
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
        ))}
      </>
    );
  });

  const totalPrice = useMemo(() => {
    return cart.reduce((acc, item) => {
      const price = Number(item.discount_price ?? item.price);
      return acc + price;
    }, 0);
  }, [cart]);

  return (
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
                <div>Total: ${totalPrice.toFixed(2)}</div>
              </div>
            </td>
          </tr>
        </tfoot>
      </table>
      <div className="mx-auto w-36 mt-10"></div>
    </section>
  );
};

const Stage2 = ({
  setter,
}: {
  setter: React.Dispatch<React.SetStateAction<SummaryInterface>>;
}) => {
  const [summary, setSummary] = useState({} as SummaryInterface);
  const [error, setError] = useState("");

  useEffect(() => {
    setter(summary);
  }, [setter, summary]);

  const handleOptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSummary({ ...summary, payment_method: event.target.value as any });
  };

  const handleAddressChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSummary({ ...summary, address: event.target.value });
  };

  const handlePhoneChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = event.target.value;
    const isValidPhone = /^\+?[1-9]\d{1,14}$/.test(inputValue);

    if (isValidPhone) {
      setSummary({ ...summary, phone_number: event.target.value });
      setError("");
    } else {
      setError("Invalid phone number");
    }
  };

  return (
    <div className="max-w-md mx-auto my-10 p-6 bg-white rounded-lg shadow-xl">
      <h2 className="text-2xl font-bold mb-4">Select Payment</h2>
      <div className="flex items-center mb-4">
        <input
          type="radio"
          id="balance"
          name="paymentOption"
          value="balance"
          checked={summary.payment_method === "balance"}
          onChange={handleOptionChange}
          className="h-6 w-6 text-indigo-600"
        />
        <label htmlFor="balance" className="ml-2">
          Balance
        </label>
      </div>
      <div className="flex items-center">
        <input
          type="radio"
          id="credit-card"
          name="paymentOption"
          value="credit_card"
          checked={summary.payment_method === "credit_card"}
          onChange={handleOptionChange}
          className="h-6 w-6 text-indigo-600"
        />
        <label htmlFor="credit-card" className="ml-2">
          Credit Card
        </label>
      </div>
      <h2 className="text-2xl font-bold my-4">Enter Address</h2>
      <div className="flex items-center mb-4">
        <label htmlFor="balance" className="ml-2">
          Address:
        </label>
        <input
          type="text"
          id="address"
          name="address"
          onChange={handleAddressChange}
          className="border rounded-md ml-4"
        />
      </div>
      <h2 className="text-2xl font-bold my-4">Phone Number</h2>
      <div className="flex items-center mb-4">
        <label htmlFor="balance" className="ml-2">
          Phone number:
        </label>
        <input
          type="text"
          id="phone-number"
          name="phoneNumber"
          onChange={handlePhoneChange}
          className="border rounded-md ml-4"
        />
      </div>
      {<div>{error}</div> || null}
    </div>
  );
};

const Stage3 = ({ summary }: { summary: SummaryInterface }) => {
  const [error, setError] = useState("");
  const { cart } = useContext(CartContext);
  const navigate = useNavigate();
  const { payment_method } = summary;

  const totalPrice = useMemo(() => {
    return cart.reduce((acc, item) => {
      const price = Number(item.discount_price ?? item.price);
      return acc + price;
    }, 0);
  }, [cart]);

  const handleSubmit = async () => {
    setError("");
    if (!payment_method) {
      throw new Error("Payment method must be set");
    }

    const csrftoken = getCookie("csrftoken");

    cart.forEach(async (item) => {
      try {
        const response = await fetch(API_URL + "transactions/", {
          method: "POST",
          headers: {
            "X-CSRFToken": csrftoken as string,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            payment_method: payment_method,
            product: item.id,
          }),
        });
        const data = await response.json();
        console.log(data);
        navigate("/account/profile/");
      } catch (error: any) {
        console.error(error);
        setError(error.message);
      }
    });
  };

  return (
    <div className="bg-white rounded-md shadow-md p-6 w-1/3 mt-10 mx-auto">
      <h2 className="text-xl font-bold mb-4">Order Summary</h2>
      <div className="float-left w-1/3 h-64 ">
        {cart.map((item) => (
          <div
            className="flex justify-between items-center mb-2"
            key={item.name}
          >
            <span>
              {item.name} | ${item.discount_price || item.price}
            </span>
          </div>
        ))}
      </div>
      <div className="float-left w-2/3 h-64  ">
        <h5 className="font-semibold">Payment method:</h5>
        <span className="capitalize">
          {summary.payment_method === "credit_card" ? "credit card" : "balance"}
        </span>
        <h5 className="font-semibold">Address:</h5>
        <span>{summary.address}</span>
        <h5 className="font-semibold">Phone number:</h5>
        <span>{summary.phone_number}</span>
      </div>
      {error ? (
        <div className="text-red-700">
          <h3>Error:</h3>
          {error}
        </div>
      ) : null}
      <hr className="my-4 w-full" />
      <div className="flex justify-between items-center">
        <span className="font-bold">Total:</span>
        <span className="text-lg">${totalPrice.toFixed(2)}</span>
      </div>
      <button
        onClick={handleSubmit}
        className="bg-blue-500 hover:bg-blue-600 text-white rounded-md py-2 mt-4 w-full"
      >
        Place Order
      </button>
    </div>
  );
};
