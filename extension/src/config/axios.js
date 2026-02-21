import axios from "axios"

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || "https://jobflow-ai-9xi5.onrender.com/",
    withCredentials: true,
    headers: {
        'Cache-Control': 'no-cache'
    }
})

export default api