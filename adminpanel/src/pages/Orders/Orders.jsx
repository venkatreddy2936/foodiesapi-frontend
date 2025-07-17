
import axios from "axios";
import { assets } from "../../assets/assets";
import { StoreContext } from "../../../../foodies/src/context/StoreContext";
import React, { useEffect, useState, useContext } from "react";


const Orders = () => {
  const [data, setData]=useState([]);
//  const token="eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ2ZW5rYXRAZ21haWwuY29tIiwiaWF0IjoxNzUwOTM4MjIxLCJleHAiOjE3NTA5NzQyMjF9.kH0QiS6DtTt8JKEWyq3PYewCUk2ri6o5vfHrGYqh72M";

  // const fetchOrders =async () =>{
  //   const response= await axios.get("http://localhost:8080/api/orders/all");
  //   setData(response.data);
  // };

  const fetchOrders = async () => {
  try {
    const token = localStorage.getItem("token")
    const response = await axios.get("http://localhost:8080/api/orders/all", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    setData(response.data);
  } catch (error) {
    console.error("Error fetching admin orders:", error);
  }
};

  //  const updateStatus= async (event, orderId)=>{
  //  const response=await axios.patch(`http://localhost:8080/api/orders/status/${orderId}?status=${event.target.value}`);
  //    if(response.status ===200){
  //     await fetchOrders();
  //    }
  //  }
  const updateStatus = async (event, orderId) => {
  try {
    const token = localStorage.getItem("token")
    const response = await axios.patch(
      `http://localhost:8080/api/orders/status/${orderId}?status=${event.target.value}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (response.status === 200) {
      await fetchOrders();
    }
  } catch (error) {
    console.error("Error updating order status:", error);
  }
};

  

  useEffect(()=>{
    fetchOrders();
  },[]);

  return (
    <div className="container">
      <div className="py-5 row justify-content-center">
        <div className="col-11 card">
          <table className="table table-responsive">
            <tbody>
              {data.map((order, index) => {
                return (
                  <tr key={index}>
                    <td>
                      <img src={assets.parcel} alt="" height={48} width={48} />
                    </td>
                    <td>
                      <div>{(order.orderedItems || []).map((item, index) => {
                        if (index === order.orderedItems.length - 1) {
                          return item.name + " x " + item.quantity;
                        } else {
                          return item.name + " x " + item.quantity + " ";
                        }
                      })}</div>
                      <div>{order.userAddress}</div>
                    </td>
                    <td>&#x20B9;{order.amount.toFixed(2)}</td>
                    <td>items:{order.orderedItems?.length || 0}</td>
                    <td>
                      <select className="form-control" 
                      onChange={(event)=> updateStatus(event, order.id)} 
                      value={order.orderStatus}>
                        <option value="Food Preparing">Food Preparing</option>
                        <option value="Out For Delivery">Out For Delivery</option>
                        <option value="Delivered">Delivered</option>
                      </select>
                      
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Orders;