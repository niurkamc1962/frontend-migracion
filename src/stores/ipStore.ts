import { defineStore } from "pinia";

export const useIpStore = defineStore('ip', {
    state: () => ({
        ip_server: '' as string,
    }),
    actions: {
        setIpServer(ip: string) {
            this.ip_server = ip
        }
    }
})