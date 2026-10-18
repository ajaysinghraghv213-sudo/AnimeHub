



export const homeCategories = async () =>{

    try{
        const response = await fetch(`http://127.0.0.1:8000/home-categories/`,{


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