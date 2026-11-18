



export const getAllPosts = async () => {
    try {
        const response = await fetch(" https://surrounded-ruby-worm-languages.trycloudflare.com/all-posts/",{


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