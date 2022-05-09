import Api from "@/services/Api";



export default {

    login(data) {
        return Api().post("/authentication/google/login", data);
    },
    getAllChatMessage(convId, page, size) {
        return Api().get("/chat/chatMessage", {
            params:
            {
                convId: convId,
                page: page,
                size: size
            }
        }
        );
    },
    getAllConversations() {
        return Api().get("/chat/conversations");
    },
    sendMessage(data) {
        return Api().post("/chat/chatMessage", data);
    },
  
}