import { refreshAccessToken } from "./refreshAccessToken";




export const likedPosts = async () => {
    try {
        let access = localStorage.getItem("accessToken");

        let response = await fetch(`http://127.0.0.1:8000/liked-posts/`,{

            method : "GET",

            headers : {
                "Authorization": `Bearer ${access}`,
                "Content-Type": "application/json"
            }
        })
        if (response.status===401){
            await refreshAccessToken();
            access = localStorage.getItem("accessToken");
            response = await fetch(`http://127.0.0.1:8000/liked-posts/`,{

                method : "GET",

                headers : {
                    "Authorization": `Bearer ${access}`,
                    "Content-Type": "application/json"
                }
            });
        }
      const data = await response.json();
      if(response.ok){
          return data;
      } else {
          throw new Error("Failed to fetch liked posts");
      }
    } catch (error) {
        console.error(error);
        throw error;
    }
};