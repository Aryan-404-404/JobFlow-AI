import { useState, useContext, useEffect, createContext } from "react";
import api from "../config/axios";
import { useAuth } from "./AuthContext";

const JobContext = createContext()

const JobProvider = ({ children }) => {
    const { user } = useAuth()
    const [jobs, setJobs] = useState([])
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        const fetchJobs = async () => {
            setLoading(true)
            try {
                const res = await api.get('/job/allJobs');
                const data = res.data;
                setJobs(data.jobs || [])
            }
            catch (err) {
                return { success: false, err: err.response?.data?.message || err.message }
            }
            finally{
                setLoading(false)
            }
        }
        if(user){               //Only fetch when there is a user 
            fetchJobs()
        }
    }, [user])

    const createJob = async (form) => {
        try {
            const res = await api.post('/job/createJob', form);
            setJobs(prev => [res.data.job, ...prev]);
            return { success: true }
        }
        catch (err) {
            return { success: false, err: err.response?.data?.message || err.message }
        }
    }

    const updateJob = async (id, form) => {
        try {
            const res = await api.patch(`/job/updateJob/${id}`, form);
            setJobs(prev => prev.map(job => 
                job._id === id ? res.data.job : job
            ));
            return { success: true }
        }
        catch (err) {
            return { success: false, err: err.response?.data?.message || err.message }
        }
    }

    const deleteJob = async (id) => {
        try {
            const res = await api.delete(`/job/deleteJob/${id}`);
            if (res.status === 200) {
                setJobs((prevJobs) => prevJobs.filter((job) => job._id !== id));
            }
            return { success: true }
        }
        catch (err) {
            return { success: false, err: err.response?.data?.message || err.message }
        }
    }

    return (
        <JobContext.Provider value={{ jobs, setJobs, createJob, updateJob, deleteJob, loading}} >
            {children}
        </JobContext.Provider>
    )
}

const useJob = () => {
    return useContext(JobContext)
}

export { JobProvider, useJob }