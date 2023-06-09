import { useContext, useEffect, useState } from "react";
import { APIProduct, API_URL } from "../../constants";
import { CartContext } from "../../contexts/cart";
import { useDocumentTitle } from "../../utils";
import Navbar from "../Navbar";
import { Link } from "react-router-dom";

const Product = ({ product }: { product: APIProduct }) => {
  const { addItemToCart } = useContext(CartContext);

  const handleAddToCart = () => {
    addItemToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      discount_price: product.discount_price,
      image_src: product.image_src,
    });
  };

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
          <s className="font-light">${Number(product.price).toFixed(2)}</s> $
          {product.discount_price}
        </span>
      ) : (
        <span className="text-xl mt-2">${product.price}</span>
      )}
      <button
        className="border rounded-lg border-black py-3 px-2 mt-16 mb-5 hover:bg-black hover:text-white transition-all duration-300"
        onClick={() => handleAddToCart()}
      >
        Add to basket
      </button>
    </div>
  );
};

export default function Search() {
  useDocumentTitle("Zen Market | Search");

  const [data, setData] = useState<APIProduct[] | undefined>();

  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const query = queryParams.get("q")?.trim() ?? "";
    const tag = queryParams.get("tag")?.trim() ?? "";

    const fetchData = async () => {
      try {
        const response = await fetch(
          `${API_URL}products/?name=${query}&tag=${tag}`
        );
        const data = await response.json();
        setData(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);

  const products = data?.map((product) => (
    <Product product={product} key={product.id} />
  ));

  return (
    <>
      <Navbar />
      <section className="mt-10 pl-0 xl:pl-36">
        <div className="flex flex-row flex-wrap justify-center xl:justify-start items-stretch">
          {products}
        </div>
      </section>
    </>
  );
}
