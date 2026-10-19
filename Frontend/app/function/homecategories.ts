



export const homeCategories = async () =>{

    try{
        const response = await fetch(` https://animehub-3-kbnb.onrender.com/home-categories/`,{


        method : "GET",

        headers : {
            "Content-Type": "application/json"
        }
    })
    if(response.ok){
        const data = await response.json();
        return data;
    }else{
        throw new Error("Failed to fetch home categories");
    }
    }   catch(error){
        console.error(error);
        throw new Error("Failed to fetch home categories");
    }
}