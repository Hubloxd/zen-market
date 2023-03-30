import { useContext, useEffect, useState } from "react";
import { APIProduct, API_URL} from "../../constants";
import { CartContext } from '../../cart';
import { useDocumentTitle } from "../../utils";

import Navbar from "../Navbar";
import { Link } from "react-router-dom";

const Product = ({product} : {product: APIProduct}) => {
    const { addItemToCart} = useContext(CartContext);

    return (
        <div tabIndex={0} className="bg-orange-500 border flex flex-col items-center relative mx-10 my-2">
            <Link to={`/product/${product.id}/`} className=" top-0">
                <img src={product.image_src} alt={product.image_src} width={450} height={300}/>
                <span className="bg-black text-white absolute top-0 right-0">SALE</span>
            </Link>
            <h1>{product.name}</h1>
            <p>{product.price}</p>
            <button onClick={() => addItemToCart({
                id: product.id,
                name: product.name,
                price: product.price,
                image_src: product.image_src,
            })}>
                Add to basket
            </button>
        </div>
    );
}

export default function Search(){
    useDocumentTitle('Zen Market | Search');
    const [data, setData] = useState<Array<APIProduct>>();
    const products: Array<JSX.Element> = []

    useEffect(() => {
        const queryParams = new URLSearchParams(window.location.search);
        const query = queryParams.get('q');
        if(query === ''){
            return
        }
        const fetchData = () => {
            fetch(API_URL+`products/?name=${query}`, )
            .then(response => response.json())
            .then(response => setData(response))
            .catch(err => console.error(err));
        };

        fetchData();
    }, [])

    data?.forEach(element => products.push(<Product product={element} key={element.id}/>));
    
    return (
        <>
        <Navbar />
        {products}
        </>
    
    );
}