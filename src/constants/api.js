import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:3000"
    // baseURL: "https://ac06-2804-7f5-9241-4a20-3905-44ec-14b7-a7a2.ngrok-free.app"
});

export default api;