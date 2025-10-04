import axios from "axios";

export const authorizationHeaders = () => {
    const token = localStorage.getItem("admin-G9-token");

    return {
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
        }
    }
}

export const authorizationHeadersImage = () => {
    const token = localStorage.getItem("admin-G9-token");

    return {
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data"
        }
    }
}

export const Axios = axios.create({
    baseURL: import.meta.env.VITE_APP_ADMIN_API,
})