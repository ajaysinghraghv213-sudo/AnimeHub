

import { toast } from "sonner";

     
const logout = async (): Promise<Response | null> => {
    try {
    const access = localStorage.getItem("accessToken");
    const refresh = localStorage.getItem("refreshToken");

    const response = await fetch(" https://animehub-3-kbnb.onrender.com/logout/", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            ...(access ? { Authorization: `Bearer ${access}` } : {}),
        },
        body: JSON.stringify({ refresh }),
    });

    if (!response.ok) {
        throw new Error("Logout failed. Please try again.");
    }

    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");

    toast.success("Logged out successfully!");
    
   setTimeout(() => {
    window.location.href = "/";
}, 500);

    return response;
    } catch (error) {
        toast.error(error instanceof Error ? error.message : "Logout failed. Please try again.");
        return null;
    }
};

export default logout;