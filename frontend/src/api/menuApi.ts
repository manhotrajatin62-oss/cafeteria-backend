import apiClient from "./apiClient"

export const getTodayMenu = () => {
    return apiClient.get("/menu/today")
}