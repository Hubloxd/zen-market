import { useContext, useEffect, useState } from "react";

import { Link } from "react-router-dom";

import Navbar from "../Navbar";
import { APIProduct, API_URL } from "../../constants";
import { CartContext } from "../../contexts/cart";
import { useDocumentTitle } from "../../utils";

const Product = ({ product }: { product: APIProduct }) => {
  const { addItemToCart } = useContext(CartContext);

  return (
    <div
      tabIndex={0}
      className="flex flex-col items-center relative mx-10 my-5 transition-all duration-500 hover:scale-105 border"
    >
      <Link to={`/product/${product.id}/`} className=" top-0 ">
        <img
          src={product.image_src}
          alt={product.image_src}
          width={450}
          height={300}
          loading="lazy"
        />
        {product.sale ? (
          <span className="bg-black text-white absolute top-0 right-0 px-4 py-2">
            SALE
          </span>
        ) : null}
      </Link>
      <h1 className="capitalize font-bold text-2xl mt-4">{product.name}</h1>
      {product.discount_price ? (
        <span className="text-xl mt-2">
          <s className="font-light">${product.price.toFixed(2)}</s> $
          {product.discount_price}
        </span>
      ) : (
        <span className="text-xl mt-2">${product.price}</span>
      )}
      <button
        className="border rounded-lg border-black py-3 px-2 mt-16 mb-5 hover:bg-black hover:text-white transition-all duration-300"
        onClick={() =>
          addItemToCart({
            id: product.id,
            name: product.name,
            price: product.price,
            image_src: product.image_src,
          })
        }
      >
        Add to basket
      </button>
    </div>
  );
};

const ProductList = () => {
  const [data, setData] = useState<Array<APIProduct>>();
  const products: Array<JSX.Element> = [];

  useEffect(() => {
    const fetchData = () => {
      fetch(API_URL + "products/")
        .then((response) => response.json())
        .then((response) => setData(response))
        .catch((e) => console.error(e));
    };
    fetchData();
  }, []);

  data?.forEach((element) =>
    products.push(<Product product={element} key={element.id} />)
  );

  return (
    <>
      <div className="flex flex-row flex-wrap justify-center xl:justify-start items-stretch">
        {products}
      </div>
    </>
  );
};

export default function Home() {
  useDocumentTitle("Zen Market | Home Page");
  return (
    <>
      <Navbar />
      <section className="mt-10 pl-0 xl:pl-36">
        <ProductList />
      </section>
    </>
  );
}
