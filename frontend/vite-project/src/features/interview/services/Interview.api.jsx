
import { axiosInstance } from "../../auth/services/axiosInstance";

async function createreport({ resume, sdec, jdec }) {
    try {
        const formData = new FormData();

        formData.append("resume", resume);
        formData.append("selfDes", sdec);
        formData.append("jobDes", jdec);

        const response = await axiosInstance.post(
            "/api/interview/report",
            formData
        );

        return response.data;
    } catch (err) {
        console.log(err);
        throw err;
    }
}

async function reportbyId(id) {
    try {
        const response = await axiosInstance.get(
            `/api/interview/report/${id}`
        );

        return response.data;
    } catch (err) {
        console.log(err);
        throw err;
    }
}

async function allreports() {
    try {
        const response = await axiosInstance.get(
            "/api/interview/allreport"
        );

        return response.data;
    } catch (err) {
        console.log(err);
        throw err;
    }
}

export { reportbyId, createreport, allreports };
