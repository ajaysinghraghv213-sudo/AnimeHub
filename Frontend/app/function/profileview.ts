import {refreshAccessToken} from "./refreshAccessToken";


//self user profile view//


export const profileView = async() => {

    try {
        let access = localStorage.getItem("accessToken");

    let response = await fetch(` https://animehub-3-kbnb.onrender.com/profile/`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${access}`
        }
    });
    if(response.status === 401) {
        // Access token might be expired, try refreshing it
         await refreshAccessToken();
        access = localStorage.getItem("accessToken");

        response = await fetch(` https://animehub-3-kbnb.onrender.com/profile/`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${access}`
            }
        });
    }
    const data = await response.json();
    console.log(data);
    if(!response.ok) {
        throw new Error(data.detail || "Failed to fetch profile");

    }
    return data;
    } catch (error) {
        if (error instanceof Error) {
            throw error;
        }
        throw new Error("An error occurred while fetching profile");
    }
}
//other profile view//

export const otherProfileView = async(userId: string) => {

    try {
        let access = localStorage.getItem("accessToken");

    let response = await fetch(` https://animehub-3-kbnb.onrender.com/userprofile/${userId}/`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${access}`
        }
    });
    if(response.status === 401) {
        // Access token might be expired, try refreshing it
         await refreshAccessToken();
        access = localStorage.getItem("accessToken");

        response = await fetch(` https://animehub-3-kbnb.onrender.com/userprofile/${userId}/`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${access}`
            }
        });
    }
    const data = await response.json();
    console.log(data);
    if(!response.ok) {
        throw new Error(data.detail || "Failed to fetch profile");

    }
    return data;
    } catch (error) {
        if (error instanceof Error) {
            throw error;
        }
        throw new Error("An error occurred while fetching profile");
    }
}



export const updateProfile = async(profileData: any) => {

    try {
        let access = localStorage.getItem("accessToken");
        if (!access) {
            access = await refreshAccessToken();
        }
        const formData = new FormData();
        for (const key in profileData) {
           const value = profileData[key];
                    if (key === "profile_pic") {
                            if (value instanceof File) formData.append(key, value);
                    } else if(value!==undefined && value!==null){
              formData.append(key, value);
          }
        }

    let response = await fetch(` https://animehub-3-kbnb.onrender.com/profile/update/`, {
        method: "PATCH",
        headers: {
            "Authorization": `Bearer ${access}`
        },
        body: formData
    });
    if(response.status === 401) {
        // Access token might be expired, try refreshing it
         await refreshAccessToken();
        access = localStorage.getItem("accessToken");

        response = await fetch(` https://animehub-3-kbnb.onrender.com/profile/update/`, {
            method: "PATCH",
            headers: {
                "Authorization": `Bearer ${access}`
            },
            body: formData
        });
    }
    const data = await response.json();
    console.log(data);
    if(!response.ok) {
        const message = data.detail || data.error || Object.values(data).flat().find((value) => typeof value === "string");
        throw new Error(message || "Failed to update profile");

    }
    if(response.ok){
        console.log("Profile updated successfully:", data);
        return data;
    }
    } catch (error) {
        if (error instanceof Error) {
            throw error;
        }
        throw new Error("An error occurred while updating profile");
    }
}