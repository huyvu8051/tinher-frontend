import Api from "@/services/Api";

export default {

    findAllSuitablePerson(data) {
        return Api().post("/user/match", data);
    },
   
}