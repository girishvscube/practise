import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { makeStyles } from '@mui/styles';
import moment from 'moment';

const useStyles = makeStyles(() => ({
    root: {
        '& td ': {
            color: '#FFFFFF',
        },
        '& th ': {
            color: '#6A6A78',
        },
    },

    tr: {
        '& td:first-child ': {
            borderTopLeftRadius: '8px',
            borderBottomLeftRadius: '8px',
        },
        '& td:last-child ': {
            borderTopRightRadius: '8px',
            borderBottomRightRadius: '8px',
        },
    },
}));
const AccountsTable = ({
    rows,
}: any) => {
    const classes = useStyles();
    return (
        <TableContainer component={Paper}>
            <div className='flex flex-col gap-6'>
                <Table
                    aria-label="simple table"
                    sx={{
                        [`& .${tableCellClasses.root}`]: {
                            borderBottom: '1px solid #404050',
                        },
                        minWidth: 650,
                        background: '#151929',
                        borderRadius: '8px',
                        '& .css-zvlqj6-MuiTableCell-root': {
                            padding: 0,
                        },
                    }}
                    className={classes.root}
                >
                    <TableHead>
                        <TableRow>
                            <TableCell align="center" sx={{ borderRight: '1px solid #404050' }}>
                                <span>Date</span>
                            </TableCell>
                            <TableCell align="center" sx={{ borderRight: '1px solid #404050' }}>
                                <span>Total Payments-in</span>
                            </TableCell>
                            <TableCell align="center" sx={{ borderRight: '1px solid #404050' }}>
                                <span>Total Payments-out</span>
                            </TableCell>
                            <TableCell align="center">
                                <span>Expenses</span>
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rows?.length > 0
                            && rows?.map((row: any) => (
                                <TableRow key={row?.name} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                    <TableCell align="center">
                                        <div className="flex justify-center gap-6">

                                            <p>
                                                {moment(row?.date).format('YYYY-MM-DD')}
                                            </p>
                                        </div>

                                    </TableCell>

                                    <TableCell align="center">{row?.pay_in}</TableCell>
                                    <TableCell align="center">{row?.pay_out}</TableCell>
                                    <TableCell align="center">
                                        {row?.expense}
                                    </TableCell>
                                </TableRow>

                            ))}


                    </TableBody>

                </Table>



                <Table
                    aria-label="simple table"
                    sx={{
                        [`& .${tableCellClasses.root}`]: {
                            borderBottom: 0,
                        },
                        minWidth: 650,
                        background: '#151929',
                        borderRadius: '8px',
                        '& .css-zvlqj6-MuiTableCell-root': {
                            padding: 0,
                        },
                    }}
                    className={classes.root}
                >
                    <TableHead>
                        <TableRow>
                            <TableCell align="center">
                                <span className='text-[#FFCD2C] text-[16px] font-extrabold'>Total</span>
                            </TableCell>
                            <TableCell align="right" >
                                <span className='text-[#FFCD2C] text-[16px] font-extrabold'>1548</span>
                            </TableCell>
                            <TableCell align="right" >
                                <span className='text-[#FFCD2C] text-[16px] font-extrabold'>158787KM</span>
                            </TableCell>
                            <TableCell align="center">
                                <span className='text-[#FFCD2C] text-[16px] font-extrabold'>1447hrs 33 min</span>
                            </TableCell>
                        </TableRow>
                    </TableHead>
                </Table>
            </div>

        </TableContainer>


    );
};
export default AccountsTable;
