import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";

import NoPage from "./pages/NoPage";
import Home from './pages/Home';
import Search from './pages/Search';
import Product from './pages/Product';
import Checkout from './pages/Checkout';

import { CartProvider } from './cart';
import Login from './pages/Account/Login';
import Register from './pages/Account/Register';

export default function App() {
  return (
    <CartProvider>
    <BrowserRouter>
        <Routes>
          <Route path="/"> 
            <Route path={''} element={<Home/>} />
            <Route path="account/">
              <Route path={''} element={<Login/>} />
              <Route path={'login/'} element={<Login/>} />
              <Route path={'register/'} element={<Register/>} />

            </Route>
            <Route path={'search'} element={<Search/>}/>
            <Route path={'checkout/'} element={<Checkout/>}/>
            <Route path={`product/:productId`} element={<Product/>} />          
          </Route>
          <Route path="/pl"> 

          </Route>
          <Route path={'*'} element={<NoPage/>} />
        </Routes>
    </BrowserRouter>
    </CartProvider>
  );
}