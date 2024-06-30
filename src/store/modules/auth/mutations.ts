export default {
    setUser(state: any, payload: any) {
       state.token = payload.token;
       state.userId = payload.userId;
       state.email = payload.email;
       //state.tokenExpiration = payload.tokeExpiration
    }
};