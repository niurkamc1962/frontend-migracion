import { defineStore } from "pinia";

export const useIPStore = defineStore('ip', {
  // Definiendo estado inicial con la ip del servidor y la opcion seleccionada
  // localstore es para persistir los datos en el navegador para no perder si se recarga la pagina
  // actions son metodos para modificar el estado del store
  state: () => ({
    ip_server: localStorage.getItem('ip_server') || '' as string,
    db_name: localStorage.getItem('db_name') || '' as string,
    db_password: localStorage.getItem('db_password') || '' as string,
    selectedOption: localStorage.getItem('selectedOption') || null as string | null
  }),
  actions: {
    // Metodo paa actualizar la IP del servidor
    setIpServer(ip: string) {
      this.ip_server = ip
      localStorage.setItem('ip_server', ip)
    },
    // Método para actualizar el nombre de la base de datos
    setDbName(dbName: string) {
      this.db_name = dbName;
      localStorage.setItem('db_name', dbName);
    },
    // Método para actualizar password
    setDbPassword(dbPassword: string) {
      this.db_password = dbPassword;
      localStorage.setItem('db_password', dbPassword);
    },
    setSelectedOption(option: string | null) {
      this.selectedOption = option
      if (option === null) {
        localStorage.removeItem('selectedOption')
      } else {

        localStorage.setItem('selectedOption', option)
      }
    },
    resetIpServer() {
      this.ip_server = '';
      this.db_name = '';
      this.db_password = '';
      this.selectedOption = null;
      localStorage.removeItem('ip_server');
      localStorage.removeItem('db_name');
      localStorage.removeItem('db_password');
      localStorage.removeItem('selectedOption');
    }
  }
})
