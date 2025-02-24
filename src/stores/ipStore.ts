import { defineStore } from "pinia";

export const useIPStore = defineStore('ip', {
    state: () => ({
        ip_server: localStorage.getItem('ip_server') || '' as string,
        selectedOption: localStorage.getItem('selectedOption') || null as string | null
    }),
    actions: {
        setIpServer(ip: string) {
            this.ip_server = ip
            localStorage.setItem('ip_servre', ip)
        },
        setSelectedOption(option: string | null) {
            this.selectedOption = option
            if (option === null) {
                localStorage.removeItem('selectedOption')
            } else {

                localStorage.setItem('selectedOption', option)
            }
        }
    }
})