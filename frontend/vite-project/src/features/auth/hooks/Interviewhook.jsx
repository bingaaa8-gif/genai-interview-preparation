
import { useContext } from "react";
import { authContext } from "../services/auth.context.jsx";
import {
    reportbyId,
    createreport,
    allreports
} from "../../interview/services/Interview.api.jsx";

export const Interviewhook = () => {
    const context = useContext(authContext);

    const {
        loading,
        setLoading,
        report,
        setReport,
        reports,
        setReports,accesstoken
    } = context;

    const handlereportbyid = async (id) => {
        try {
            const data = await reportbyId(id,accesstoken);
            setReport(data.report);
            return true;
        } catch (err) {
            console.log(err);
            return false;
        }
    };

    const handlecreatereport = async (resume, sdec, jdec) => {
        setLoading(true);

        try {
            const data = await createreport({ resume, sdec, jdec,accesstoken });
            setReport(data.report);
            return data.report._id;
        } catch (err) {
            console.log(err);
            return false;
        } finally {
            setLoading(false);
        }
    };

    const handleAllreports = async () => {
       

        try {
            const data = await allreports(accesstoken);
            setReports(data.reports);
            return data.reports;
        } catch (err) {
            console.log(err);
            return false;
        } 
    };

    return {
        report,
        reports,
        loading,
        handlereportbyid,
        handlecreatereport,
        handleAllreports
    };
};
