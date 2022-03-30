import Api from "@/services/Api";

export default {

    getAllSettingConfig() {
        return Api().get("/setting");
    },
}