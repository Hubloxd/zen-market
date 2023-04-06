import { useParams } from "react-router-dom";
import Navbar from "../Navbar";
import { useEffect, useState, useContext } from "react";
import NoPage from "../NoPage";
import { APIProduct, API_URL } from "../../constants";

import { CartContext } from "../../cart";
import { useDocumentTitle } from "../../utils";

export default function Product() {
  const { productId } = useParams();
  const [product, setProduct] = useState<APIProduct>();
  const [is404, setIs404] = useState(false);
  const { addItemToCart } = useContext(CartContext);

  useDocumentTitle("Zen Market | " + product?.name);

  useEffect(() => {
    const fetchData = () => {
      fetch(API_URL + `products/${productId}/`)
        .then((response) => {
          if (!response.ok) {
            throw new Error(response.status as unknown as string);
          }
          return response.json();
        })
        .then((response) => setProduct(response))
        .catch((error) => {
          if (error.message === "404") {
            setIs404(true);
          } else {
            console.error(error);
          }
        });
    };

    fetchData();
  }, [productId]);

  if (!is404) {
    return (
      <>
        <Navbar />
        <section className="mt-10 px-14">
          <div className="flex flex-row items-stretch">
            <img className="h-[30em]" src={product?.image_src} alt="" />
            <div className="flex flex-col ml-5 border px-3">
              <span className=" text-5xl font-light capitalize ">
                {product?.name}
              </span>

              <p className="my-5">
                Reprehenderit tempor veniam ad aliquip. Nisi officia cillum
                deserunt proident est cillum ipsum velit laborum ipsum aliquip
                voluptate quis. Cupidatat ullamco dolor voluptate consequat
                tempor nulla est culpa mollit laboris ipsum. Id laborum labore
                ex duis do exercitation irure mollit non Lorem esse sint dolor
              </p>

              <p className="text-3xl my-5">${product?.price}</p>
              <button
                onClick={() => {
                  if (product) {
                    addItemToCart({
                      id: product.id,
                      name: product.name,
                      price: product.price,
                      image_src: product.image_src,
                    });
                  }
                }}
                className="mx-auto mt-60 bg-black text-white w-44 py-2 font-semibold flex flex-row items-center justify-center"
              >
                <svg
                  className="w-5 h-5 mr-2"
                  fill="#FFF"
                  version="1.1"
                  id="Capa_1"
                  xmlns="http://www.w3.org/2000/svg"
                  xmlnsXlink="http://www.w3.org/1999/xlink"
                  viewBox="0 0 483.1 483.1"
                  xmlSpace="preserve"
                  stroke="#FFF"
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
                      <path d="M434.55,418.7l-27.8-313.3c-0.5-6.2-5.7-10.9-12-10.9h-58.6c-0.1-52.1-42.5-94.5-94.6-94.5s-94.5,42.4-94.6,94.5h-58.6 c-6.2,0-11.4,4.7-12,10.9l-27.8,313.3c0,0.4,0,0.7,0,1.1c0,34.9,32.1,63.3,71.5,63.3h243c39.4,0,71.5-28.4,71.5-63.3 C434.55,419.4,434.55,419.1,434.55,418.7z M241.55,24c38.9,0,70.5,31.6,70.6,70.5h-141.2C171.05,55.6,202.65,24,241.55,24z M363.05,459h-243c-26,0-47.2-17.3-47.5-38.8l26.8-301.7h47.6v42.1c0,6.6,5.4,12,12,12s12-5.4,12-12v-42.1h141.2v42.1 c0,6.6,5.4,12,12,12s12-5.4,12-12v-42.1h47.6l26.8,301.8C410.25,441.7,389.05,459,363.05,459z"></path>{" "}
                    </g>{" "}
                  </g>
                </svg>{" "}
                Add to basket
              </button>
            </div>
          </div>
          <p>{/* {product?.description} */}</p>
        </section>
      </>
    );
  } else {
    return <NoPage />;
  }
}
