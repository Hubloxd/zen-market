import { useContext, useEffect, useState } from "react";
import Navbar from "../Navbar";
import { UserContext } from "../../contexts/user";
import { API_URL, TransactionInterface } from "../../constants";
import { getCookie } from "../../utils";

export default function Profile() {
  const { fetchUser } = useContext(UserContext);
  useEffect(() => {
    fetchUser();
  }, []);
  // const user: User = {
  //   email: "hubloxd@gmail.com",
  //   username: "hdsa",
  //   first_name: "John",
  //   last_name: "Doe",
  //   balance: 100,
  //   phone_number: 218329817,
  // };

  const [content, setContent] = useState(<Dashboard />);

  return (
    <>
      <Navbar />
      <Sidebar setter={setContent} />
      <section className="">
        <div className="float-left w-[85%]">{content}</div>
      </section>
    </>
  );
}

const Sidebar = ({
  setter,
}: {
  setter: React.Dispatch<React.SetStateAction<JSX.Element>>;
}) => {
  return (
    <div className="float-left flex flex-col w-64 bg-gray-900 h-[83.1vh]">
      <div className="flex items-center justify-center h-16 bg-gray-800 border-b border-gray-700">
        <span className="font-bold text-lg text-white">My App</span>
      </div>
      <nav className="flex-grow">
        <ul className="flex flex-col py-4">
          <button
            onClick={() => setter(<Dashboard />)}
            className="pl-4 py-2 text-gray-300 border-l-4 border-transparent hover:text-white hover:bg-gray-700 border-purple-600"
          >
            Dashboard
          </button>
          <button
            onClick={() => setter(<Orders />)}
            className="pl-4 py-2 text-gray-300 border-l-4 border-transparent hover:text-white hover:bg-gray-700 border-purple-600"
          >
            My Orders
          </button>
        </ul>
      </nav>
      <div className="flex items-center justify-center h-16 bg-gray-800 border-t border-gray-700">
        <a href="/account/logout/">
          <span className="font-bold text-lg text-white">Log Out</span>
        </a>
      </div>
    </div>
  );
};

const Dashboard = () => {
  const { user } = useContext(UserContext);

  const [email, setEmail] = useState(user.email);
  const [password, setPassword] = useState("");

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const csrftoken = getCookie("csrftoken");
    let body;

    if (password) {
      body = JSON.stringify({
        email,
        password,
      });
    } else {
      body = JSON.stringify({
        email,
      });
    }

    try {
      const res = await fetch(API_URL + "users/change/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": csrftoken as string,
        },
        body: JSON.stringify(body),
      });

      console.log(await res.json()); // Handle success response
    } catch (error) {
      console.error(error); // Handle error response
    }
  };

  return (
    <div className="px-10 container mx-auto">
      <header className="flex justify-between items-center py-4">
        <h1 className="text-5xl font-bold">
          <span className="text-xl font-light">Welcome</span>
          <br /> {user.first_name} {user.last_name}
        </h1>
      </header>
      <div>
        <p className="text-lg">Balance:</p>
        <p className="text-2xl font-bold">${user.balance}</p>
      </div>
      <div className="my-8">
        <form onSubmit={handleSubmit}>
          <div className="my-4">
            <label htmlFor="email" className="block mb-2">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              placeholder="New Email"
              onChange={handleEmailChange}
              className="w-full px-4 py-2 border border-gray-400 rounded-md focus:outline-none focus:border-blue-500"
            />
          </div>
          <div className="my-4">
            <label htmlFor="password" className="block mb-2">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              placeholder="New Password"
              onChange={handlePasswordChange}
              className="w-full px-4 py-2 border border-gray-400 rounded-md focus:outline-none focus:border-blue-500"
            />
          </div>
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

const Orders = () => {
  const OrderList = () => {
    const [data, setData] = useState<TransactionInterface[]>();

    useEffect(() => {
      fetch(API_URL + "transactions/?format=json", {
        method: "GET",
        headers: {
          Cookie: `csrftoken=${getCookie("csrftoken")};`,
        },
      })
        .then((response) => response.json())
        .then((response) => {
          console.log(response);
          setData(response);
        })
        .catch((err) => console.error(err));
    }, []);

    const orders = data?.map((transaction) => {
      const statuses = {
        processing: (
          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
            Processing
          </span>
        ),
        shipped: (
          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
            Shipped
          </span>
        ),
        canceled: (
          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
            Cancelled
          </span>
        ),
      };

      return (
        <tr>
          <td>ORD-{transaction.id}</td>
          <td>{transaction.name}</td>
          <td>{transaction.date.slice(0, 10)}</td>
          <td>${transaction.price}</td>
          <td>{transaction.payment_method}</td>
          <td>{statuses[transaction.status]}</td>
        </tr>
      );
    });

    return <>{orders}</>;
  };

  return (
    <>
      <div className="float-left overflow-x-auto w-full">
        <table className="table w-full border border-gray-200 divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Order Number
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Product Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Price
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Payment Method
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {<OrderList />}
          </tbody>
        </table>
      </div>
    </>
  );
};
