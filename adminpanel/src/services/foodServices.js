import axios from "axios";
import { toast } from "react-toastify";

const API_URL = "http://localhost:8080/api/foods";

export const addFood = async (foodData, image) => {
    const formData = new FormData();
    formData.append('food', JSON.stringify(foodData));
    formData.append('file', image);

    try {
        const response = await axios.post(API_URL, formData, {
            headers: { "Content-Type": "multipart/form-data" }
        });
        return response.data; // Let the component handle success
    } catch (error) {
        console.log('Error in foodService:', error);
        throw error; // Let the component catch and show toast
    }
}

export const getFoodList= async ()=>{
    try {
     const response =await axios.get(API_URL);
     return response.data;
      
    } catch (error) {
        console.log('error fetching  food list',error );
        throw error;   
    }
}

export const deleteFood= async(foodId)=> {

    try {
    const response=await axios.delete(API_URL +'/'+foodId);
    return response.status=== 204;
   
        
    } catch (error) {
        console.log('Error while deleting the food..', error);
        throw error;
        
    }


}