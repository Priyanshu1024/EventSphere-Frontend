import axios from "axios";

const api = axios.create({
     baseURL: "https://eventsphere-server-mfdb.onrender.com",
});

export default api