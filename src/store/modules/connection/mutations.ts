export default {
    setConnection(state: any, payload: any) {
        state.connectionId = payload.connectionId;
        state.userId = payload.userId;
    }
};