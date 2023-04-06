export interface APIProduct {
  id: number;
  name: string;
  description: string;
  price: number;
  discount_price: number | null;
  image_src: string;
  sale: boolean;
}

export const API_URL = "http://127.0.0.1:8000/api/v1/";

const foo = () => {};
export default foo;
