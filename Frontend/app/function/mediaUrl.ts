const MEDIA_BASE_URL = "https://animehub-3-kbnb.onrender.com";

// Absolute URLs (e.g. cloud storage) pass through; relative backend paths get the API host.
export const mediaUrl = (path?: string | null): string => {
    if (!path) return "";
    if (/^(https?:)?\/\//.test(path) || path.startsWith("data:") || path.startsWith("blob:")) {
        return path;
    }
    return `${MEDIA_BASE_URL}${path.startsWith("/") ? "" : "/"}${path}`;
};
