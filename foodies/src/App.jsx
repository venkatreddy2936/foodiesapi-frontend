import React from 'react';
import Menubar from './components/Menubar/Menubar';
import Home from './pages/Home/Home';
import Contact from './pages/Contact/Contact';
import ExploreFood from './pages/ExploreFood/ExploreFood';
import { Routes, Route } from 'react-router-dom';
import FoodDetails from './components/FoodDetails/FoodDetails';
import Cart from './pages/Cart/Cart';
import PlaceOrder from './components/PlaceOrder/PlaceOrder';
import Register from './components/Register/Register';
import Login from './components/Login/Login';
import { ToastContainer, toast } from "react-toastify";
import MyOrders from './components/MyOrders/MyOrders';
import { useContext } from 'react';
import { StoreContext } from './context/StoreContext';
import ForgotPassword from './components/ForgotPassword/ForgotPassword';



const App = () => {


  const {token} =useContext(StoreContext);
  return (
    <div>
     
    <Menubar/>
    <ToastContainer/>
    
    <Routes>
     <Route path='/' element={<Home/>}/>
      <Route path='/contact' element={<Contact/>}/>
       <Route path='/explore' element={<ExploreFood/>}/>
       <Route path='/food/:id' element={<FoodDetails/>}/>
       <Route path='/cart' element={<Cart/>}/>
        <Route path='/order' element={token ?<PlaceOrder/>: <Login/>}/>
       <Route path='/login' element={token ?<Home/> : <Login/>}/>
        <Route path='/register' element={token ?<Home/> : <Register/>}/>
        <Route path='/myorders' element={token ?<MyOrders/> :<Login/>}/>
         <Route path='/forgotpassword' element={<ForgotPassword/>}/>
    </Routes>
    </div>
  )
}

export default App;