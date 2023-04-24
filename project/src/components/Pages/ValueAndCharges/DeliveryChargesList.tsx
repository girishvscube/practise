import { useState, useEffect } from 'react';
import { styled } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import Validator from 'validatorjs';
import moment from 'moment';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';

import axiosInstance from '../../../utils/axios';
import Pagination from '../../common/Pagination/Pagination';
import CustomButton from '../../common/Button';
import Refresh from '../../../assets/icons/filledIcons/Refresh.svg';
import SellingPrice from '../../../assets/images/SellingPrice.svg';
import CloseSquareLight from '../../../assets/icons/lightIcons/CloseSquareLight.svg';
import { Input } from '../../common/input/Input';
import CircularProgress from '@mui/material/CircularProgress';
import { showToastMessage } from '../../../utils/helpers';

export interface DialogTitleProps {
    children: any;
    onClose: () => void;
}

const initialState = {
    open: false,
    charges: '',
    type: '',
    is_update: false,
    id: '',
    disable_button: false
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

const DeliveryChargesList = () => {
    const [list, setList] = useState([])
    const [meta, setMeta] = useState({
        total: 0
    })
    const [formErrors, setFormErrors] = useState({
        charges: '',
        type: ''
    });
    const [currentPage, setCurrentPage] = useState(1);

    const [dialogMeta, setDialogMeta] = useState(initialState);
    const [loading, setLoading] = useState(false)


    const handleCreate = () => {
        setDialogMeta({ ...dialogMeta, open: true });
    };

    const handleUpdate = (x) => {
        setDialogMeta({ ...dialogMeta, open: true, is_update: true, charges: x.charges, type: x.type, id: x.id });
    };

    const handleClose = () => {
        setDialogMeta({ ...dialogMeta, open: false });
    };
    const updateDeliveryCharges = async () => {
        const validation = new Validator(dialogMeta, {
            charges: 'required',
        });

        if (validation.fails()) {
            const fieldErrors: any = {};
            Object.keys(validation.errors.errors).forEach((key) => {
                fieldErrors[key] = validation.errors.errors[key][0];
            });

            setFormErrors(fieldErrors);
            return false;
        }
        let obj = {
            charges: parseFloat(dialogMeta.charges),
            type: dialogMeta.type
        }

        setDialogMeta({ ...dialogMeta, disable_button: true });
        if (!dialogMeta.is_update) {
            axiosInstance.post('/admin/values-charges/delivery-charges', obj).then((resp) => {
                showSuccessMessage(resp)
                getDeliveryChargesList()

            }).catch((error) => {
                setDialogMeta({ ...dialogMeta, disable_button: false });
                showToastMessage(error.message, 'error')

            });
        } else {
            axiosInstance.put('/admin/values-charges/delivery-charges/' + dialogMeta.id, obj).then((resp) => {
                showSuccessMessage(resp)
                getDeliveryChargesList()
            }).catch((error) => {
                setDialogMeta({ ...dialogMeta, disable_button: false });
                showToastMessage(error.message, 'error')

            });
        }
    };

    const showSuccessMessage = (resp) => {
        showToastMessage(resp.data.data.message, 'success')
        setDialogMeta({ ...dialogMeta, disable_button: false });
    }
    const getDeliveryChargesList = async () => {
        setDialogMeta(initialState);
        setLoading(true)
        await axiosInstance('/admin/values-charges/delivery-charges')
            .then((response) => {
                setList(response.data.data);
                setLoading(false)
            })
            .catch((error) => {
                console.log(error);
                setLoading(false)
            });
    };

    useEffect(() => {
        getDeliveryChargesList()
    }, []);


    const handleChange = (e: any) => {
        const { name, value } = e.target;
        if (name === 'charges') {
            const re = /^[0-9\b]+$/
            if (value && !re.test(value)) {
                return
            }
        }
        setDialogMeta({ ...dialogMeta, [name]: value });
        setFormErrors({ ...formErrors, [name]: '' });
    };

    return (
        <div className="w-full  bg-lightbg  rounded-lg mt-4">
            <div className='flex  p-3 items-center'>
                <p className="text-lg font-extrabold text-white font-nunitoRegular">
                    Delivery Charges
                </p>
            </div>

            {
                loading ?
                    <div className="w-full h-80 flex justify-center items-center">
                        <CircularProgress />
                        <span className="text-3xl">Loading...</span>
                    </div> :
                    <>

                        <div className="pb-6">
                            {
                                list?.map((x: any) =>
                                    <div className='rounded-lg  bg-darkGray flex justify-between mx-4 mb-2 p-5 items-center'>
                                        <div className='flex gap-4 text-left'>
                                            <img src={SellingPrice} />
                                            <div>
                                                <p><span className='text-sm'>{x.type} : </span>
                                                    <span className='text-lg font-bold'>  ₹ {x.charges}</span> </p>
                                                <p>
                                                    <span className="text-textgray text-xs">Updated on </span>
                                                    <span className="text-xs">
                                                        {moment(x?.updated_at).format('LT')},
                                                        {moment(x?.updated_at).format('DD/MM/YYYY')}
                                                    </span>
                                                </p>

                                            </div>
                                        </div>

                                        <CustomButton
                                            onClick={() => handleUpdate(x)}
                                            width="w-fit"
                                            variant="outlined"
                                            size="large"
                                            borderRadius="8px"
                                            icon={<img src={Refresh} alt="" />}
                                        >
                                            Update Charges
                                        </CustomButton>
                                    </div>)
                            }


                            <div className='dialog-wrapper'>
                                <BootstrapDialog
                                    sx={{
                                        '& .MuiBackdrop-root': {
                                            backgroundColor: 'rgba(0,0,0,0.8)',
                                            backdropFilter: 'blur(5px)',
                                        },
                                    }} aria-labelledby="customized-dialog-title"
                                    open={dialogMeta.open}
                                    PaperProps={{ sx: { width: '60%', m: 0, backgroundColor: 'arsenic', alignItems: 'center', borderColor: 'arsenic' } }}
                                >
                                    <BootstrapDialogTitle onClose={handleClose}>
                                        <div className="flex justify-start">
                                            <p className="font-bold font-nunitoRegular flex justify-start text-white absolute top-2 left-6">
                                                {dialogMeta.is_update ? 'Update' : 'Add'} Delivery Charges
                                            </p>
                                        </div>
                                    </BootstrapDialogTitle>
                                    <DialogContent>
                                        <div className="w-full mt-4 bg-darkGray p-6 rounded-lg flex flex-col gap-6">
                                            <Input
                                                rows={1}
                                                width="w-full"
                                                readOnly={dialogMeta.is_update}
                                                value={dialogMeta.type}
                                                handleChange={handleChange}
                                                label="Delivery Type"
                                                name="type"
                                            />

                                            <Input
                                                rows={1}
                                                width="w-full"
                                                error={!!formErrors.charges}
                                                value={dialogMeta.charges}
                                                handleChange={handleChange}
                                                helperText={formErrors.charges}
                                                label="Enter the Delivery Charge in Rupees"
                                                name="charges"
                                            />

                                        </div>
                                    </DialogContent>

                                    <div className="flex justify-center pt-2 pb-10 h-[72px]">
                                        <CustomButton
                                            disabled={dialogMeta.disable_button}
                                            onClick={updateDeliveryCharges}
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
export default DeliveryChargesList;
