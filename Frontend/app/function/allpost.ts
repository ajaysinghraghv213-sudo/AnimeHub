



export const getAllPosts = async () => {
    try {
        const response = await fetch("http://127.0.0.1:8000/all-posts/",{


            method : "GET",
            headers: {
                "Content-Type": "application/json"
            }
        });


        if (!response.ok) {
            throw new Error("Failed to fetch posts");
        }
        return await response.json();
    } catch (error) {
        console.error(error);
        return error
        
    }
};