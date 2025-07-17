import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast} from 'react-toastify';
import './ListFood';
import { deleteFood, getFoodList } from '../../services/foodServices';





const ListFood = () => {

const [list, setList]=useState([]);
const fetchList=async ()=>{
try {
  const data= await getFoodList();
  return setList(data);
  
  
} catch (error) {
  toast.error("Error while rading the foods."); 
}
}
const removeFood=async (foodId)=>{
  // console.log(foodId);
  try {

    const success=await deleteFood(foodId);
    if(success){
      toast.success('food removed..');
       await fetchList();
    }
    else{
      toast.error('Error occured while removing the food.');
    }
    
  } catch (error) {
    toast.error('Error occured while removing the food.')
    
  }
  

}



useEffect(()=> {
  fetchList();

},[])

  return (
    <div className="py-5 row justify-content-center"><dir className="col-11 card">
      <table className='table'><thead>
        <tr>
        <th>Image</th>
        <th>Name</th>
        <th>Price</th>
        <th>Category</th>
        <th>Action</th>
        </tr>
        </thead>
        <tbody>
          {
            list.map((item, index)=>{
              return(
              <tr>
                <td>
                  <img src={item.imageUrl} alt='' height={48} width={48}/>
                </td>
                <td>
                  {item.name}
                </td>
                   <td>
                  {item.category}
                </td>
                 <td>
                  {item.price}
                </td>
                <td className='text-danger'>
                  <i className='bi bi-x-circle-fill' onClick={()=> removeFood(item.id)}></i>
                  
                </td>
                
              </tr>)
            })
          
          }
        </tbody>
        </table></dir></div>
  )
}


export default ListFood