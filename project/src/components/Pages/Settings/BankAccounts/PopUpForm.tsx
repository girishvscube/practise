import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import IconButton from '@mui/material/IconButton';
import CloseSquareLight from '../../../../assets/icons/lightIcons/CloseSquareLight.svg';
import CustomButton from '../../../common/Button';
import { Input } from '../../../common/input/Input';
import { SelectInput } from '../../../common/input/Select';
import CustomCheckbox from '../../../../components/common/input/Checkbox';
import FileUpload from '../../../../components/common/FileUpload';
import moment from 'moment';
import CommonDatepicker from '../../../../components/common/input/Datepicker';

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2),
    width: '100%',
    alignItems: 'center',
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
export interface DialogTitleProps {
  id: string
  children: any
  onClose: () => void
  type: any
}


const BootstrapDialogTitle = (props: DialogTitleProps) => {
  const { children, onClose, type, ...other } = props;

  return (
    <DialogTitle sx={{ m: 0, p: 3 }} {...other}>
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
interface PopUpProps {
  handleClose: any
  open: any
  title: any
  type: string
  name: string
  params: any
  handleChange: any
  submit: any,
  errors: any,
  handleImage: any,
  removeImage: any,
  bankList: any,
  loading: any,
  handleDate: any
}
const CustomizedDialogs = ({
  open,
  handleClose,
  title,
  type,
  name,
  submit,
  handleChange,
  params,
  errors,
  handleImage,
  removeImage,
  bankList,
  loading,
  handleDate
}: PopUpProps) => {

  console.log(params, "params")


  return (
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
            width: '80%',
            m: 0,
            backgroundColor: 'arsenic',
            alignItems: 'center',
            borderColor: 'arsenic',
          },
        }}
      >
        <BootstrapDialogTitle id={name} onClose={handleClose} type={type}>
          <div className="flex justify-start">
            <p className="font-bold font-nunitoRegular flex justify-start text-white absolute top-2 left-6">
              {title}
            </p>
          </div>
        </BootstrapDialogTitle>
        <DialogContent>
          <div className=" mt-6  w-full  bg-darkGray p-6 rounded-lg flex flex-col gap-6 rounded-2">

            <Input
              rows={1}
              width="w-full"
              disabled={false}
              readOnly={false}
              error={!!errors?.account_name}
              value={params?.account_name}
              handleChange={handleChange}
              helperText={errors.account_name}
              label="Enter Account Name"
              name="account_name"
            />

            <SelectInput options={bankList} label="Select Bank" value={params?.bank_name} handleChange={handleChange} name="bank_name"
              error={!!errors?.bank_name} helperText={errors.bank_name} />

            <Input
              rows={1}
              width="w-full"
              disabled={false}
              readOnly={false}
              value={params?.account_number}
              handleChange={handleChange}
              helperText={errors?.account_number}
              label="Account Number"
              name="account_number"
              error={!!errors?.account_number}
            />

            <Input
              rows={1}
              width="w-full"
              disabled={false}
              readOnly={false}
              error={!!errors.ifsc_code}
              value={params?.ifsc_code}
              handleChange={handleChange}
              helperText={errors.ifsc_code}
              label="IFSC Code"
              name="ifsc_code"
            />

            <Input
              rows={1}
              width="w-full"
              disabled={false}
              readOnly={false}
              error={!!errors.opening_balance}
              value={params?.opening_balance}
              handleChange={handleChange}
              helperText={errors.opening_balance}
              label="Opening Balance"
              name="opening_balance"
            />
            <div>
              <CommonDatepicker label="As of date" value={params?.as_of_date ? moment(params.as_of_date).format('YYYY-MM-DD') : null} onChange={handleDate} />
              {errors?.as_of_date ? <p className='text-red-600 text-xs ml-4'>*required</p> : null}
            </div>

            <CustomCheckbox
              handleCheck={handleChange}
              ischecked={params?.print_ac_number}
              color="text-white"
              name="print_ac_number"
              Label="Print A/c Number and ifsc code on Invoice"
            />
            <CustomCheckbox
              handleCheck={handleChange}
              ischecked={params?.print_upi_qr}
              color="text-white"
              name="print_upi_qr"
              Label="Print UPI QR code on Invoice"
            />

            {
              params?.print_upi_qr ? <>
                <Input
                  rows={1}
                  width="w-full"
                  disabled={false}
                  readOnly={false}
                  error={!!errors.upi_id}
                  value={params?.upi_id}
                  handleChange={handleChange}
                  helperText={errors.upi_id}
                  label="Enter UPI ID"
                  name="upi_id"
                />
                <div className="">
                  <p className="pl-2 text-white">QR Code</p>
                  <div className=" mt-2">
                    <FileUpload
                      styleType="md"
                      setImage={handleImage}
                      removeImage={removeImage}
                      acceptMimeTypes={['image/jpeg']}
                      title="Drag and Drop PDF here"
                      label="File Format:.JPEG,PNG"
                      id="file1"
                      maxSize={5}
                      imageUrl={params.qr_code}
                      filename="image"
                      error={errors?.qr_code}
                    />
                    {errors?.qr_code && (
                      <p className="ml-4 text-errortext text-xs">{`*${errors?.qr_code}`}</p>
                    )}

                  </div>
                </div>
              </> : null
            }



          </div>

        </DialogContent>

        <div className="flex justify-center pt-2 pb-10 h-[72px]">
          <CustomButton
            onClick={submit}
            width="w-full"
            variant="contained"
            size="large"
            disabled={loading}
          >
            {
              type === "edit" ? 'Update Details' : ' Submit Details'
            }

          </CustomButton>
        </div>
      </BootstrapDialog>
    </div>
  );
};

export default CustomizedDialogs;
