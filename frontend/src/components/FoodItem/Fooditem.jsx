import React, { useContext } from 'react'
import "./Fooditem.css"
import { assets } from '../../assets/assets'
import { StoreContext } from '../../Contextapi/StoreContext';


const Fooditem = ({ id, name, price, description, image }) => {

    const { CartItems, addTocart, removeFromCart, url } = useContext(StoreContext);

    return (
        <div className='fooditem'>
            <div className="food-item-image-container">
                <img className="food-item-image" src={url+"/images/"+image} alt="" />
                {!CartItems[id]
                    ? <img className="add" onClick={() => addTocart(id)} src={assets.add_icon_white} alt="" />
                    : <div className="food-item-counter">
                        <img onClick={() => removeFromCart(id)} src={assets.remove_icon_red} alt="" />
                        <p>{CartItems[id]}</p>
                        <img onClick={() => addTocart(id)} src={assets.add_icon_green} alt="" />
                    </div>
                }
            </div>
            <div className="food-item-info">
                <div className="food-item-name-rating">
                    <p>{name}</p>
                    <img src={assets.rating_starts} alt="" />
                </div>
                <p className="food-item-description">{description}</p>
                <p className="food-item-price">${price}</p>
            </div>
        </div>
    )
}

export default Fooditem
