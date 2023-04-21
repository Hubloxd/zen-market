export interface APIProduct {
  id: number;
  name: string;
  description: string;
  price: number;
  discount_price: number | null;
  image_src: string;
  sale: boolean;
}
export interface UserInterface {
  email: string;
  username: string;
  first_name: string;
  last_name: string;
  balance: number;
  phone_number: number;
}

export interface TransactionInterface {
  id: number,
  name: string;
  price: number;
  date: string;
  payment_method: "credit_card" | "balance";
  status: "processing" | "shipped" | "canceled";
}

export const API_URL = "http://127.0.0.1:8000/api/v1/";
