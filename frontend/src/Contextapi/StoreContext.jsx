import { createContext, useEffect, useState } from "react";
import axios from "axios";

export const StoreContext = createContext(null);

const StoreContextProvider = (props) => {

    const [CartItems, setcartItems] = useState({});
    const url = "https://fooddel-backend-vfn0.onrender.com"
    const [token,setToken] = useState("");
    const [food_list,setFoodlist]=useState([]);

    
    const addTocart = async(itemId) => {
        if (!CartItems[itemId]) {
            setcartItems((prev) => ({ ...prev, [itemId]: 1 }))
        } else {
            setcartItems((prev) => ({ ...prev, [itemId]: prev[itemId] + 1 }))
        }
        if(token){
            await axios.post(url+"/api/cart/add",{itemId},{headers:{token}})
        }
    }

    const removeFromCart = async(itemId) => {
        setcartItems((prev) => ({ ...prev, [itemId]: prev[itemId] - 1 }))
        if(token){
            await axios.post(url+"/api/cart/remove",{itemId},{headers:{token}})
        }
    }

    const getTotalCartAmount = () => {
        let Totalamount = 0;
        for (const item in CartItems) {
            if (CartItems[item] > 0) {
                let itemInfo = food_list.find((product) => product._id === item)
                Totalamount += itemInfo.price * CartItems[item]
            }
        }
        return Totalamount;
    }

    const fetchFoodlist = async()=>{
        const response = await axios.get(url+"/api/food/list");
        setFoodlist(response.data.data)
    }

    const loadCartdata = async(token) =>{
        const response = await axios.post(url+"/api/cart/get",{},{headers:{token}});
        setcartItems(response.data.cartData)
    }

    useEffect(()=>{
        async function loadData(){
            await fetchFoodlist();
            if(localStorage.getItem("token")){
                setToken(localStorage.getItem("token"));
                await loadCartdata(localStorage.getItem("token"))
            }
        }
        loadData();
    },[]);

    const contextValue = {
        food_list,
        CartItems,
        setcartItems,
        addTocart,
        removeFromCart,
        getTotalCartAmount,
        url,
        token,
        setToken
    }
    
    return (
        <StoreContext.Provider value={contextValue} >
            {props.children}
        </StoreContext.Provider>
    )
}

export default StoreContextProvider;
