import axios from "axios";

export const clientServer = axios.create({
    baseURL: "http://localhost:3001",
})