import Api from "@/services/Api";

export default {

    getAllSettingConfig() {
        return Api().get("/setting");
    },
    save(data) {
        return Api().post("/setting", data);
    },
}