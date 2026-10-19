

import { refreshAccessToken } from "./refreshAccessToken";

export const categories = async() =>{

   try {
     

    let response = await fetch(` https://animehub-3-kbnb.onrender.com/categories/`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            
        }
    });

    if(response.status === 401) {
        // Access token might be expired, try refreshing it
         await refreshAccessToken();
        

        response = await fetch(` https://animehub-3-kbnb.onrender.com/categories/`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                
            }
        });
    }
    const data = await response.json();
    if(!response.ok) {
        throw new Error("Failed to fetch categories");
    }
    return data;
   } catch {
       throw new Error("An error occurred while fetching categories");
   }
}