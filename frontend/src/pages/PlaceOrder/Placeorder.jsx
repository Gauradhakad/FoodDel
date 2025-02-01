import React, { useContext, useEffect, useState } from 'react'
import "./Placeorder.css"
import { StoreContext } from '../../Contextapi/StoreContext';
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Placeorder = () => {
  const { getTotalCartAmount, token, food_list, CartItems, url } = useContext(StoreContext);
  const [data, setData] = useState({ firstName: "", lastName: "", email: "", street: "", city: "", state: "", zipcode: "", country: "", phone: "" })

  const onChangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;

    setData(data => ({ ...data, [name]: value }))
  }

  const placeorder = async (event) => {
    event.preventDefault();
    let orderItems = [];

    food_list.map((item) => {
      if (CartItems[item._id] > 0) {
        let itemInfo = item;
        itemInfo["quantity"] = CartItems[item._id];
        orderItems.push(itemInfo);
      }
    });
    let orderData = {
      address: data,
      items: orderItems,
      amount: getTotalCartAmount() + 2,
    }
    let response = await axios.post(url + '/api/order/place', orderData, { headers: { token } });
    console.log(response.data);
    if (response.data.success) {
      const { session_url } = response.data;
      window.location.replace(session_url)
    }
    else {
      alert("Error");
    }
  }

  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      alert("PLease Login to continue further")
      navigate("/cart")
    }else if(getTotalCartAmount()===0){
      alert("No items in the cart")
      navigate("/cart")
    }
  }, [token])

  return (
    <form onSubmit={placeorder} className='place-order'>
      <div className="place-order-left">
        <p className="title">Delivery Information</p>
        <div className="multi-fields">
          <input required name="firstName" onChange={onChangeHandler} value={data.firstName} type="text" placeholder="First name" />
          <input required name="lastName" onChange={onChangeHandler} value={data.lastName} type="text" placeholder='Last name' />
        </div>
        <input required type="email" name="email" onChange={onChangeHandler} value={data.email} placeholder='Email address' />
        <input required type="text" name="street" onChange={onChangeHandler} value={data.street} placeholder='Street' />
        <div className="multi-fields">
          <input required type="text" name="city" onChange={onChangeHandler} value={data.city} placeholder="City" />
          <input required type="text" name="state" onChange={onChangeHandler} value={data.state} placeholder='State' />
        </div>
        <div className="multi-fields">
          <input required type="text" name="zipcode" onChange={onChangeHandler} value={data.zipcode} placeholder="Zip code" />
          <input required type="text" name="country" onChange={onChangeHandler} value={data.country} placeholder='Country' />
        </div>
        <input required type="text" name="phone" onChange={onChangeHandler} value={data.phone} placeholder='phone' />
      </div>


      <div className="place-order-right">
        <div className="cart-total">
          <h2>Cart Total</h2>
          <div className="cart-total-details">
            <p>SubTotal</p>
            <p>${getTotalCartAmount()}</p>
          </div>
          <hr />
          <div className="cart-total-details">
            <p>Delivery fee</p>
            <p>${getTotalCartAmount() === 0 ? 0 : 2}</p>
          </div>
          <hr />
          <div className="cart-total-details">
            <b>Total</b>
            <b>${getTotalCartAmount() === 0 ? 0 : getTotalCartAmount() + 2}</b>
          </div>
        </div>
        <button type='submit'>PROCEED TO PAYMENT</button>
      </div>
    </form >
  )
}

export default Placeorder
