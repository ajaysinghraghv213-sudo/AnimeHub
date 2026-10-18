



export const getAllPosts = async () => {
    try {
        const response = await fetch("https://animehub-2-i11e.onrender.com/all-posts/",{


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