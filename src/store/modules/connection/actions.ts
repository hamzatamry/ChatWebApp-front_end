import axios from "axios";

export default {
    async connect(context: any, payload: any) {
        const url = "/api/connection/add";
        
        return axios.post(url, {
            connectionId: payload.connectionId,
            userId: payload.userId
        }); 
    },
    async disconnect(context: any, payload: any) {
        const url = "/api/connection/delete";
        
        return axios.post(url, {
            connectionId: payload.connectionId,
            userId: payload.userId
        }); 
    },
}