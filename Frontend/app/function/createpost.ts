import {refreshAccessToken} from "@/app/function/refreshAccessToken";


export const createPost = async (title: string, content: string, category: string, image?: File | null, video?: File | null) => {
    try {

        if (image && !image.type.startsWith("image/")) {
            throw new Error("Selected file must be an image");
        }

        if (video && !video.type.startsWith("video/")) {
            throw new Error("Selected file must be a video");
        }

        let accessToken = localStorage.getItem("accessToken");

        const buildBody = () => {
            if (!image && !video) {
                return { body: JSON.stringify({ title, content, category }), contentType: "application/json" as const };
            }
            const formData = new FormData();
            formData.append("title", title);
            formData.append("content", content);
            formData.append("category", category);
            if (image) formData.append("image", image);
            if (video) formData.append("video", video);
            return { body: formData, contentType: null };
        };

        const { body, contentType } = buildBody();

        let response = await fetch("http://127.0.0.1:8000/create-post/", {
            method: "POST",
            headers: {
                ...(contentType ? { "Content-Type": contentType } : {}),
                "Authorization": `Bearer ${accessToken}`,
            },
            body,
        });

        if(response.status===401){
            await refreshAccessToken();
            accessToken = localStorage.getItem("accessToken");
            response = await fetch("http://127.0.0.1:8000/create-post/", {
                method: "POST",
                headers: {
                    ...(contentType ? { "Content-Type": contentType } : {}),
                    "Authorization": `Bearer ${accessToken}`,
                },
                body,
            });
        }
        if (!response.ok) {
            throw new Error("Failed to create post");
        }
        return await response.json();
    } 
    
    catch (error) {
        console.error(error);
        throw error;
        
    }
};