import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import IconButton from '@mui/material/IconButton';
import CloseSquareLight from '../../../../../assets/icons/lightIcons/CloseSquareLight.svg';
import CustomButton from '../../../../common/Button';
import { Input } from '../../../../common/input/Input';
import Validator from 'validatorjs';
import FileUpload from '../../../../common/FileUpload';
import Profile from '../../../../../assets/icons/filledIcons/AddUser.svg';
import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  CreatePoc,
  EditPoc,
  EditPocSet,
  createPoSet,
} from '../../../../../features/suppliers/pocSlice';
import { fetchSupplier } from '../../../../../features/suppliers/supplierSlice';
import { showToastMessage } from '../../../../../utils/helpers';

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2),
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1),
  },
  '& .MuiPaper-root': {
    'border': '1px solid #404050 !important',
    'border-radius': '8px !important'
  },
  '& .css-1t1j96h-MuiPaper-root-MuiDialog-paper': {
    backgroundColor: '#404050',
  },
  '&::-webkit-scrollbar': { display: 'none' },
  dialogCustomizedWidth: {
    'max-width': '80%',
  },
}));
export interface DialogTitleProps {
  id: string
  children: any
  onClose: () => void
}
const BootstrapDialogTitle = (props: DialogTitleProps) => {
  const { children, onClose, ...other } = props;
  return (
    <DialogTitle sx={{ m: 0, p: 2 }} {...other}>
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
          {/* <CloseIcon /> */}
          <img src={CloseSquareLight} alt="" />
        </IconButton>
      ) : null}
    </DialogTitle>
  );
};
interface PopUpProps {
  handleClickOpen: any
  handleClose: any
  open: any
  params: any
  setFormParams: any
  formErrors: any
  setFormErrors: any
  supplier_id: any
  type: any
  pocId: any
  fetchPocs: any
}
const CustomizedDialogs = ({
  open,
  handleClickOpen,
  handleClose,
  params,
  setFormParams,
  formErrors,
  setFormErrors,
  supplier_id,
  type,
  pocId,
  fetchPocs,
}: PopUpProps) => {
  const dispatch = useDispatch();
  const { createSuccess, editSuccess, isLoading } = useSelector((state: any) => state.supplierPoc);

  const [imageFileEvent, setImageFileEvent] = useState('')
  const handleChange = (e: any) => {
    const { name, value } = e.target
    if (name === 'contact') {
      const re = /^[0-9\b]+$/
      if (value && !re.test(value)) {
        return
      }
    }
    setFormParams({ ...params, [e.target.name]: e.target.value });
    setFormErrors({ ...formErrors, [e.target.name]: '' });
  };

  useEffect(() => {
    handleClose();
    dispatch(fetchSupplier(supplier_id));
    dispatch(EditPocSet());
    dispatch(createPoSet());
  }, [createSuccess, editSuccess]);

  const handleSubmit = async () => {
    const postdata = {
      ...params,
      supplier_id,
    };

    const rules = {
      contact: 'string|required|max:10|min:10',
      designation: 'required|max:50',
      poc_name: 'required|max:20',
      email: 'required|email',
    }

    const validation = new Validator(params, rules);
    if (validation.fails()) {
      const fieldErrors: any = {};
      Object.keys(validation.errors.errors).forEach((key) => {
        fieldErrors[key] = validation.errors.errors[key][0];
      });
      setFormErrors(fieldErrors);
      showToastMessage('Please Fill All the fields', 'error')

      return false;
    }

    const formData = new FormData();

    for (let key in postdata) {

      if (key === 'image') {
        formData.append('image_file', imageFileEvent)
        continue
      }
      if (key === 'supplier_id') {
        continue
      }
      formData.append(key, params[key])
    }

    formData.append('supplier_id', supplier_id)

    if (type === 'update') {
      let image_file = formData.get('image_file')
      if (!image_file) {
        formData.append('image', postdata.image)
      }
      dispatch(EditPoc(formData, pocId));
    } else {
      dispatch(CreatePoc(formData));
    }
    return true;
  };
  const handleImage = (data: any) => {
    setImageFileEvent(data.file)
    setFormParams({ ...params, image: data.url });
    setFormErrors({ ...formErrors, image: '' });
  };

  const removeFile = () => {
    setImageFileEvent('')
    setFormParams({ ...params, image: '' });
    console.log(params)
  }
  return (
    <div className="flex justify-center">
      {type === 'update' ? null : (
        <CustomButton
          onClick={handleClickOpen}
          width="w-[140px]"
          variant="outlined"
          size="large"
          icon={<img src={Profile} alt="" />}
          borderRadius="20px"

        >
          Add POC
        </CustomButton>
      )}
      <div>
        <BootstrapDialog  sx={{
            '& .MuiBackdrop-root': {
              backgroundColor: 'rgba(0,0,0,0.8)',
              backdropFilter: 'blur(5px)',
            },
          }}
          // onClose={handleClose}
          aria-labelledby="customized-dialog-title"
          open={open}
          PaperProps={{
            sx: {
              m: 1,
              backgroundColor: '#404050',
              alignItems: 'center',
              borderColor: '#404050',
            },
          }}
        >
          <BootstrapDialogTitle id="customized-dialog-title" onClose={handleClose}>
            <div className="flex justify-start h-5">
              <p className="font-bold font-nunitoRegular absolute top-0 left-2 p-2 text-[18px] text-white">
                {type === 'update' ? 'Update Poc' : 'Add New Poc'}
              </p>
            </div>
          </BootstrapDialogTitle>
          <DialogContent>
            <div className="">
              <div className="w-[325px]  lg:w-[496px] mt-4 bg-[#151929] p-2 lg:p-6 rounded-lg flex flex-col gap-6">
                <Input
                  rows={1}
                  width="w-full"
                  disabled={false}
                  readOnly={false}
                  error={!!formErrors?.poc_name}
                  value={params?.poc_name}
                  handleChange={handleChange}
                  helperText={formErrors?.poc_name}
                  label="POC Name"
                  name="poc_name"
                />
                <Input
                  rows={1}
                  width="w-full"
                  disabled={false}
                  readOnly={false}
                  error={!!formErrors?.designation}
                  value={params?.designation}
                  handleChange={handleChange}
                  helperText={formErrors?.designation}
                  label="Designation"
                  name="designation"
                />
                <Input
                  rows={1}
                  width="w-full"
                  disabled={false}
                  readOnly={false}
                  error={!!formErrors?.contact}
                  value={params?.contact}
                  handleChange={handleChange}
                  helperText={formErrors?.contact}
                  label="Contact Number"
                  name="contact"
                />
                <Input
                  rows={1}
                  width="w-full"
                  disabled={false}
                  readOnly={false}
                  error={!!formErrors?.email}
                  value={params?.email}
                  handleChange={handleChange}
                  helperText={formErrors?.email}
                  label="Email ID"
                  name="email"
                />
                <div className="flex flex-col gap-1">
                  <p className="text-white">POC Image</p>
                  <FileUpload
                    styleType="md"
                    setImage={handleImage}
                    acceptMimeTypes={['image/jpeg']}
                    title="Drag and Drop PDF here"
                    label="File Format:.JPEG,PNG"
                    id="file1"
                    maxSize={5}
                    filename=""
                    imageUrl={params?.image}
                    removeImage={() => removeFile()}
                    error={formErrors?.image}
                  />
                  {formErrors?.image ? (
                    <p className="text-xs ml-4 text-red-600">{formErrors?.image}</p>
                  ) : null}
                </div>
              </div>
            </div>
          </DialogContent>
          <div className="flex justify-center pt-2 pb-10 h-[72px]">
            <CustomButton
              onClick={handleSubmit}
              width="w-full"
              variant="contained"
              size="large"
              borderRadius="0.5rem"
              disabled={isLoading}
            >
              {
                type === 'update' ? 'Update Poc' : 'Submit Details'
              }
            </CustomButton>
          </div>
        </BootstrapDialog>
      </div>
    </div>
  );
};
export default CustomizedDialogs;
