export interface APIProduct {
  id: number;
  name: string;
  description: string;
  price: number;
  discount_price: number | null;
  image_src: string;
  sale: boolean;
}
export interface User {
  email: string;
  username: string;
  first_name: string;
  last_name: string;
  balance: number;
}

export const API_URL = "http://127.0.0.1:8000/api/v1/";

const foo = () => {};
export default foo;
