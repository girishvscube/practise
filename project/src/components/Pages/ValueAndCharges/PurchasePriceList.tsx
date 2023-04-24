import { useState, useMemo } from 'react';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import IconButton from '@mui/material/IconButton';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { makeStyles } from '@mui/styles';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import InputAdornment from '@mui/material/InputAdornment';
import { TextField, Tooltip } from '@mui/material';
import axiosInstance from '../../../utils/axios';
import Pagination from '../../common/Pagination/Pagination';
import CustomButton from '../../common/Button';
import Refresh from '../../../assets/icons/filledIcons/Refresh.svg';
import CloseSquareLight from '../../../assets/icons/lightIcons/CloseSquareLight.svg';
import { Input } from '../../common/input/Input';
import Validator from 'validatorjs';
import moment from 'moment';
import SearchIcon from '../../../assets/images/SearchIcon.svg';
import CircularProgress from '@mui/material/CircularProgress';
import { DateFiter } from '../../common/DateFiter';
import { showToastMessage } from '../../../utils/helpers';


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

export interface DialogTitleProps {
    children: any;
    onClose: () => void;
}

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    '& .MuiDialogContent-root': {
        padding: theme.spacing(2),
        width: '100%',
        alignItems: 'center',
    },
    '& .MuiPaper-root': {
        'border': '1px solid #404050 !important',
        'border-radius': '8px !important'
    },
    '& .MuiDialogActions-root': {
        padding: theme.spacing(1),
    },
    '& .css-1t1j96h-MuiPaper-root-MuiDialog-paper': {
        backgroundColor: '#404050',
    },
    dialogCustomizedWidth: {
        'max-width': '80%',
    },
}));


const BootstrapDialogTitle = (props: DialogTitleProps) => {
    const { children, onClose, ...other } = props;
    return (
        <DialogTitle sx={{ m: 0, py: 3 }} {...other}>
            {children}
            {onClose ? (
                <IconButton
                    aria-label="close"
                    onClick={onClose}
                    sx={{
                        position: 'absolute',
                        right: 8,
                        top: 8,
                        color: (theme) => theme.palette.grey[600],
                    }}
                >

                    <img src={CloseSquareLight} alt="" />

                </IconButton>
            ) : null}
        </DialogTitle>
    );
};

const PurchasePriceList = () => {
    const classes = useStyles();
    const [list, setList] = useState([])
    const [params, setParams] = useState({
        search_key: '',
        start_date: '',
        end_date: ''
    })
    const [meta, setMeta] = useState({
        total: 0
    })
    const [formErrors, setFormErrors] = useState({
        price: ''
    });
    const [currentPage, setCurrentPage] = useState(1);

    const [dialogMeta, setDialogMeta] = useState({
        open: false,
        price: '',
        name: '',
        id: '',
        disable_button: false
    });

    const [loading, setLoading] = useState(false)
    const handleUpdate = (item:any) => {
        setDialogMeta({ ...dialogMeta, open: true, name: item.name, id: item.id });
    };
    const handleClose = () => {
        setDialogMeta({ ...dialogMeta, open: false ,disable_button:false});
    };
    const updatePurchasePrice = async () => {
        const validation = new Validator(dialogMeta, {
            price: 'required',
            name: 'required',
            id: 'required',
        });

        if (validation.fails()) {
            const fieldErrors: any = {};
            Object.keys(validation.errors.errors).forEach((key) => {
                fieldErrors[key] = validation.errors.errors[key][0];
            });
            setFormErrors(fieldErrors);
            return false;
        }
        setDialogMeta({ ...dialogMeta, disable_button: true });
        axiosInstance.put('/admin/values-charges/purchase-price/' + dialogMeta.id, { per_litre_price: parseFloat(dialogMeta.price) }).then((resp) => {
            setDialogMeta({ ...dialogMeta, open: false, name: "",price:'', disable_button: false });
            showToastMessage(resp.data.data.message, 'success')
            getPurchasePriceList()
        }).catch((error) => {
            setDialogMeta({ ...dialogMeta, disable_button: false });
            showToastMessage(error.message, 'error')

        });
    };

    const getPurchasePriceList = async () => {
        setLoading(true)
        await axiosInstance(`/admin/values-charges/purchase-price?page=${currentPage}&search_key=${params.search_key}&start_date=${params.start_date}&end_date=${params.end_date}`)
            .then((response) => {
                setLoading(false)
                let list = response.data.data.data;
                setList(list);
                setMeta(response.data.data.meta);
            })
            .catch((error) => {
                setLoading(false)
                console.log(error);
            });
    };

    useMemo(() => {
        getPurchasePriceList()
    }, [currentPage]);

    const onDateSelect = (event: any) => {
        setParams({ ...params, start_date: event.start_date, end_date: event.end_date });
    };
    const onSearchChange = (e) => {
        setParams({ ...params, 'search_key': e.target.value });

    }
    const handleSubmit = (e) => {
        getPurchasePriceList()
    }

    
    const handleChange = (e: any) => {
        const { name, value } = e.target;
        setDialogMeta({ ...dialogMeta, [name]: value });
        setFormErrors({ ...formErrors, [name]: '' });
    };

    return (
        <div className="w-full  bg-lightbg  rounded-lg mt-4">
            <div className='flex  justify-between p-4 items-center'>
                <p className="text-lg font-extrabold text-white font-nunitoRegular">
                    Purchasing Price Info
                </p>
                <div className='filters items-center flex space-x-4'>
                    <TextField
                        variant="outlined"
                        sx={{
                            '& .MuiInputBase-input': {
                                color: 'white',
                            },
                            '& .MuiOutlinedInput-notchedOutline': {
                                borderColor: '#404050',
                                borderRadius: '8px',
                            },
                            backgroundColor: 'transparent',
                            textarea: { color: '#FFFFFF' },
                            label: { color: '#6A6A78' },
                            '& .MuiFormLabel-root.Mui-hovered': {
                                color: '#FFCD2C',
                            },
                            '& .MuiFormLabel-root.Mui-focused': {
                                color: '#FFCD2C',
                            },
                            '& .MuiOutlinedInput-root:hover': {
                                '& > fieldset': {
                                    borderColor: '#FFFFFF',
                                },
                            },
                            '& .MuiOutlinedInput-root': {
                                '& > fieldset': {
                                    borderColor: '#404050',
                                },
                            },
                            '& .MuiOutlinedInput-root.Mui-focused': {
                                '& > fieldset': {
                                    borderColor: '#FFCD2C',
                                },
                            },
                        }}
                        fullWidth
                        label="Search"
                        name="searchText"
                        onChange={onSearchChange}
                        value={params.search_key}
                        autoComplete="off"
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <Tooltip title="demo">
                                        <img src={SearchIcon} alt="" />
                                    </Tooltip>
                                </InputAdornment>
                            ),
                        }}
                    />
                    <DateFiter onDateRangeSelect={onDateSelect} />

                    <CustomButton
                        onClick={handleSubmit}
                        width="w-[130px]"
                        variant="outlined"
                        size="large"
                        borderRadius="0.5rem"
                    >
                        Submit
                    </CustomButton>
                </div>

            </div>


            {
                loading ?
                    <div className="w-full h-80 flex justify-center items-center">
                        <CircularProgress />
                        <span className="text-3xl">Loading...</span>
                    </div> :
                    <>


                        <div className='px-4 pb-4'>
                            <TableContainer component={Paper} >
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
                                            <TableCell align="center" >
                                                <span>Updated Date and Time</span>
                                            </TableCell>
                                            <TableCell align="center">
                                                <span>Supplier Name</span>
                                            </TableCell>
                                            <TableCell align="center">
                                                <span>Purchasing Price of Fuel</span>
                                            </TableCell>
                                            <TableCell align="center">
                                                <span>Action</span>
                                            </TableCell>

                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {list?.length ?
                                            list?.map((row: any) => (
                                                <TableRow key={row?.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>

                                                    <TableCell align="center">
                                                        <div className="flex justify-center gap-6">
                                                            <p>
                                                                {moment(row?.updated_at).format('LT')}
                                                                ,
                                                                {moment(row?.updated_at).format('DD/MM/YYYY')}
                                                            </p>
                                                        </div>

                                                    </TableCell>

                                                    <TableCell align="center">
                                                        {row?.name}
                                                    </TableCell>


                                                    <TableCell align="center">
                                                        {
                                                            row?.per_litre_price ?
                                                                <p>₹ {row?.per_litre_price}</p>
                                                                : <>--</>
                                                        }
                                                    </TableCell>

                                                    <TableCell align="center">
                                                    <Tooltip title="Update Purchase Price">
                                                        <img className='m-auto cursor-pointer'
                                                            onClick={() => handleUpdate(row)}
                                                            src={Refresh} />
                                                     </Tooltip>
                                                    </TableCell>

                                                </TableRow>
                                            )) :
                                            <TableRow>
                                                <TableCell align="center" colSpan={4}>
                                                    No Results found !!
                                                </TableCell>
                                            </TableRow>
                                        }
                                    </TableBody>
                                </Table>

                            </TableContainer>

                            <div>
                                <div className='dialog-wrapper'>
                                    <BootstrapDialog
  sx={{
    '& .MuiBackdrop-root': {
      backgroundColor: 'rgba(0,0,0,0.8)',
      backdropFilter: 'blur(5px)',
    },
  }}                                        aria-labelledby="customized-dialog-title"
                                        open={dialogMeta.open}
                                        PaperProps={{ sx: { width: '60%', m: 0, backgroundColor: 'arsenic', alignItems: 'center', borderColor: 'arsenic' } }}
                                    >
                                        <BootstrapDialogTitle onClose={handleClose}>
                                            <div className="flex justify-start">
                                                <p className="font-bold font-nunitoRegular flex justify-start text-white absolute top-2 left-6">
                                                    Update Selling Price
                                                </p>
                                            </div>
                                        </BootstrapDialogTitle>
                                        <DialogContent>
                                            <div className="w-full mt-4 bg-darkGray p-6 rounded-lg flex flex-col gap-6">
                                                <Input
                                                    rows={1}
                                                    width="w-full"
                                                    disabled={false}
                                                    readOnly={true}
                                                    value={dialogMeta.name}
                                                    label="Supplier Name"
                                                    name="name"
                                                />

                                                <Input
                                                    rows={1}
                                                    width="w-full"
                                                    disabled={false}
                                                    readOnly={false}
                                                    error={!!formErrors.price}
                                                    value={dialogMeta.price}
                                                    handleChange={handleChange}
                                                    helperText={formErrors.price}
                                                    label="Enter the Purchasing Price in Rupees"
                                                    name="price"
                                                />

                                            </div>
                                        </DialogContent>

                                        <div className="flex justify-center pt-2 pb-10 h-[72px]">
                                            <CustomButton
                                               disabled={dialogMeta.disable_button}
                                                onClick={updatePurchasePrice}
                                                width="w-full"
                                                variant="contained"
                                                size="large"
                                            >
                                                Submit Details
                                            </CustomButton>
                                        </div>

                                    </BootstrapDialog>
                                </div>
                            </div>
                        </div>


                        <Pagination
                            className="pagination-bar"
                            currentPage={currentPage}
                            totalCount={meta.total}
                            pageSize={10}
                            onPageChange={(page) => setCurrentPage(page)}
                        />
                    </>
            }
        </div>
    );
};
export default PurchasePriceList;
