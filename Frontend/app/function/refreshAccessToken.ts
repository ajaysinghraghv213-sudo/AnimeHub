


export const refreshAccessToken = async () => {

    const refresh = localStorage.getItem("refreshToken");

    // No refresh token
    if (!refresh) {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");

        throw new Error("Session expired. Please login again.");
    }


    try {

        const response = await fetch(
            "http://127.0.0.1:8000/token/refresh/",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    refresh: refresh,
                }),
            }
        );


        const data = await response.json();


        // Refresh token is expired/invalid
        if (!response.ok) {

            localStorage.removeItem("accessToken");
            localStorage.removeItem("refreshToken");

            throw new Error(
                "Session expired. Please login again."
            );
        }


        // Save new access token
        localStorage.setItem(
            "accessToken",
            data.access
        );

        // Backend rotates refresh tokens (and blacklists the old one),
        // so the new refresh token must be persisted or the next refresh will fail
        if (data.refresh) {
            localStorage.setItem("refreshToken", data.refresh);
        }

        return data.access;

    } catch (error) {

        // Remove invalid tokens
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");

        throw error;
    }
};
