import React, {useContext, useState} from 'react'
import "./LoginPopup.css";
import { assets } from '../../assets/assets';
import { StoreContext } from '../../Contextapi/StoreContext';
import axios from "axios";



const LoginPopup = ({setShowLogin}) => {

    const {url,setToken} = useContext(StoreContext);

    const [currentState,setCurrentState] = useState("Sign up");
    const [data,setData]=useState({name:"",email:"",password:""});

    const onChangeHandler=(e)=>{
      const name = e.target.name;
      const value = e.target.value;
      setData({...data,[name]:value});
    }

      const onLogin=async(event)=>{
        event.preventDefault();
        let newUrl = url;
        if(currentState==="Login"){
          newUrl+="/api/user/login"
        }else{
          newUrl+="/api/user/register"
        }

      const response = await axios.post(newUrl,data)

      if(response.data.success){
        setToken(response.data.token);
        localStorage.setItem("token",response.data.token);
        setShowLogin(false);
      }else{
        alert(response.data.message)
      }
      }

  return (
    <div className='Login-popup'>
      <form onSubmit={onLogin} action="" className="login-popup-container">
        <div className="login-popup-title">
            <h2>{currentState}</h2>
            <img onClick={()=>setShowLogin(false)} src={assets.cross_icon} alt="" />
        </div>
        <div className="login-popup-input">
            {currentState==="Login"?<></>:<input name="name" onChange={onChangeHandler} value={data.name} type="text" placeholder="your name" required/>}
            <input type="email" name="email" onChange={onChangeHandler} value={data.email} placeholder="your email" required/>
            <input type="password" name="password" onChange={onChangeHandler} value={data.password} placeholder="your password" required/>
        </div>
        <button type="submit">{currentState==="Sign up"?"Create account":"Login"}</button>
        <div className="login-popup-condition">
            <input type="checkbox" required/>
            <p>By continuing, i agree to the terms of use & privacy policy.</p>
        </div>
        {currentState==="Login"?<p>Create a new account?<span onClick={()=>setCurrentState("Sign up")}>Click Here</span></p>:<p>Already have an account?<span onClick={()=>setCurrentState("Login")}>Login Here</span></p>}
     
      </form>
    </div>
  )
}

export default LoginPopup;
