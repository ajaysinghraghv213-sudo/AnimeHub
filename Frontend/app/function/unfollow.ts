import { refreshAccessToken } from "@/app/function/refreshAccessToken";



export const unfollowUser = async(userId: string) => {
    try {
        let access = localStorage.getItem("accessToken");
        let response = await fetch(`https://animehub-2-i11e.onrender.com/unfollow/${userId}/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${access}`
            }

        });
        if(response.status === 401) {
            // Access token might be expired, try refreshing it
            await refreshAccessToken();
            access = localStorage.getItem("accessToken");

            response = await fetch(`https://animehub-2-i11e.onrender.com/unfollow/${userId}/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${access}`
                }
            });
        }
        const data = await response.json();
        console.log(data);

        if(!response.ok) {
            throw new Error(data.detail || "Failed to unfollow the user");
        }
        return data;
    } catch (error) {
        if (error instanceof Error) {
            throw error;
        }
        throw new Error("An error occurred while unfollowing the user");
    }
}