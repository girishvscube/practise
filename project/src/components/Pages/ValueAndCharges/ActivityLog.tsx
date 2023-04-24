import { useState, useMemo } from 'react';
import axiosInstance from '../../../utils/axios';
import Pagination from '../../common/Pagination/Pagination';
import CircularProgress from '@mui/material/CircularProgress';
import Logs from '../../common/Logs';



export interface DialogTitleProps {
    children: any;
    onClose: () => void;
}

const ActivityLog = () => {
    const [list, setList] = useState([])
    const [meta, setMeta] = useState({
        total: 0
    })
    const [date, setDate] = useState({
        start_date: '',
        end_date: ''
    })
    const [currentPage, setCurrentPage] = useState(1);

    const [loading, setLoading] = useState(false)

    const getLogs = async () => {
        setLoading(true)
        await axiosInstance(`/admin/values-charges/logs?page=${currentPage}&start_date=${date.start_date}&end_date=${date.end_date}`)
            .then((response) => {
                console.log(response.data)
                setLoading(false)
                let list = response.data.data.data;
                setList(list);
                setMeta(response.data.data.meta);
            })
            .catch((error) => {
                setLoading(false)
            });
    };

    useMemo(() => {
        getLogs()
    }, [currentPage, date]);

    const onDateRangeSelection = (date: any) => {
        setDate(date)
    }

    return (
        <>

            <div className={`w-full h-80 flex justify-center items-center ${loading ? 'block' : 'hidden'}`}>
                <CircularProgress />
                <span className="text-3xl">Loading...</span>
            </div>
            <div className={`${!loading ? 'block' : 'hidden'}`}>


                <Logs logs={list} enable_date={true} onDateSelect={onDateRangeSelection} />


                <Pagination
                    className="pagination-bar"
                    currentPage={currentPage}
                    totalCount={meta.total}
                    pageSize={10}
                    onPageChange={(page) => setCurrentPage(page)}
                />
            </div>
        </>
    );
};
export default ActivityLog;
