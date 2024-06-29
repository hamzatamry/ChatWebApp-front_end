import axios from "axios";

export default {
    async signup(context: any, payload: any) {
        const url = "/api/auth/register";

        return axios.post(url, {
            email: payload.email,
            password: payload.password
        }); 
    },
    async login(context: any, payload: any) {
        const url = "/api/auth/login";
    
        return axios.post(url, {
            email: payload.email,
            password: payload.password
        });
    },
}