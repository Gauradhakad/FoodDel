import React, { useEffect, useState } from 'react';
import "./List.css";
import axios from "axios";
import {toast} from "react-toastify";


const List = ({url}) => {


  const [list, setList] = useState([]);
  

  // fetching list of items
  const fetchList = async() => {
    const response = await axios.get(`${url}/api/food/list`);
    if(response.data.success){
      setList(response.data.data)
    }else{
      toast.error("error")
    }
  }
  

  // displaying list of items
  useEffect(()=>{
    fetchList();
  },[])


  // remove item function
  const removeFood=async(foodId)=>{
      const response = await axios.post(`${url}/api/food/remove`,{id:foodId});
      await fetchList();
      if(response.data.success){
        toast.success(response.data.message)
      }else{
        toast.error(response.data.message)
      }
  }


  return (
    <div className='list add flex-col'>
      <p>All Food list</p>
      <div className="list-table">
        <div className="list-table-format title">
          <h3>Image</h3>
          <h3>Name</h3>
          <h3>Cateogry</h3>
          <h3>Price</h3>
          <h3>Action</h3>
        </div>
        {list.map((item,index)=>{
          return (
            <div key={index} className='list-table-format'> 
              <img src={`${url}/images/`+item.image} alt="" />
              <p>{item.name}</p>
              <p>{item.category}</p>
              <p>${item.price}</p>
              <p onClick={()=>removeFood(item._id)} className='cursor'>x</p>
            </div>
          )
        })}
      </div>

    </div>
  )
}

export default List;
