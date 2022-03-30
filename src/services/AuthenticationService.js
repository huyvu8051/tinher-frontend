import Api from "@/services/Api";

export default {

    login(data) {
        return Api().post("/authentication/google/login", data);
    },
}