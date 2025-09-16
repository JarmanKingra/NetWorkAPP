import axios from "axios";

export const BASE_URL = "https://network-app-ovd5.onrender.com/"

export const clientServer = axios.create({
    baseURL: BASE_URL
})
