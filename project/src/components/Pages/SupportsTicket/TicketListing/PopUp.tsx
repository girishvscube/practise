import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import IconButton from '@mui/material/IconButton';
import CloseSquareLight from '../../../../assets/icons/lightIcons/CloseSquareLight.svg';
import CustomButton from '../../../common/Button';
import { SelectInput } from '../../../common/input/Select';
import TextArea from '../../../common/input/TextArea';
import moment from 'moment';

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2),
    width: '100%',
    alignItems: 'center',
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
  dialogCustomizedWidth: {
    'max-width': '80%',
  },
}));
export interface DialogTitleProps {
  id: string;
  children: any;
  onClose: () => void;
  type: any
}
const BootstrapDialogTitle = (props: DialogTitleProps) => {
  const { children, onClose, type, ...other } = props;
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
interface PopUpProps {
  handleClose: any,
  open: any,
  title: any,
  type: string,
  name: string,
  roles: any,
  params: any,
  setParams: any,
  submit: any,
  isLoading: any,
  Buttonlabel: any,
  error: any,
  buttonDisable?: any,
  data?: any
}
const CustomizedDialogs = ({ open, roles, handleClose, title, type, name, submit, setParams, params, isLoading, Buttonlabel, error, buttonDisable, data }: PopUpProps) =>
(
  <div>
    <div>
      <BootstrapDialog sx={{
        '& .MuiBackdrop-root': {
          backgroundColor: 'rgba(0,0,0,0.8)',
          backdropFilter: 'blur(5px)',
        },
      }}
        // onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={open}
        PaperProps={{ sx: { width: '80%', m: 0, backgroundColor: 'arsenic', alignItems: 'center', borderColor: 'arsenic' } }}
      >
        <BootstrapDialogTitle id={name} onClose={handleClose} type={type}>
          <div className="flex justify-start">
            <p className="font-bold font-nunitoRegular flex justify-start text-white absolute top-2 left-6">
              {title}
            </p>
          </div>
        </BootstrapDialogTitle>
        <DialogContent>
          {
            type === 'reassign' ? (

              <div className='flex flex-col mt-6 gap-10  rounded-2'>
                <div className='w-full mt-2 bg-darkGray p-6 rounded-lg flex flex-col gap-6'>
                  <div className='flex gap-6'>
                    <div
                      className='m-1 mr-2 w-10 h-10 relative flex justify-center
                  items-center rounded-full bg-textgray text-xl text-white uppercase cursor-pointer'
                    >
                      {data?.user?.name?.charAt(0)}
                    </div>
                    <div>
                      <p className='text-white'>
                        {data?.user?.name}
                        <span className='text-textgray pl-4'>{data?.reassign_notes
                        }</span>
                      </p>
                      <p className='text-textgray'>
                        {moment(data?.re_assign_date).format('LT')};{' '}
                        {moment(data?.re_assign_date).format('YYYY/MM/DD')}
                      </p>
                    </div>
                  </div>
                </div>
                <div className='w-full  bg-darkGray p-6 rounded-lg flex flex-col gap-6'>
                  <SelectInput
                    width="100%"
                    options={roles}
                    handleChange={setParams}
                    value={params.sales_id}
                    label="Select Sales Executive"
                    name="sales_id"
                    error={error.sales_id}
                    helperText={error.sales_id}
                  />
                  <TextArea
                    placeholder="Additional Notes"
                    id="123456"
                    name="notes"
                    rows={5}
                    handleChange={setParams}
                    value={params.notes}
                    error={error.notes}
                    className="col-span-3"
                    helperText={error.notes}
                  />
                </div>
              </div>
            ) : type === 'reassign_req' ? (
              <div className="w-full mt-4 bg-darkGray p-6 rounded-lg flex flex-col gap-6">
                <TextArea
                  placeholder="Reason for re assign request"
                  id="123456"
                  name="notes"
                  rows={5}
                  handleChange={setParams}
                  value={params.notes}
                  error={error.notes}
                  className="col-span-3"
                  helperText={error.notes}
                />
              </div>
            ) : (
              <div className="w-full mt-10 bg-darkGray p-6 rounded-lg flex flex-col gap-6">
                <SelectInput
                  width="100%"
                  options={roles}
                  handleChange={setParams}
                  value={params.sales_id}
                  label="Select Sales Executive"
                  name="sales_id"
                  error={error.sales_id}
                  helperText={error.sales_id}
                />
                <TextArea
                  placeholder="Additional Notes"
                  id="123456"
                  name="notes"
                  rows={5}
                  className="col-span-3"
                  handleChange={setParams}
                  value={params.notes}
                  error={error.notes}
                  helperText={error.notes}
                />
              </div>
            )
          }
        </DialogContent>

        <div className="flex justify-center pt-2 pb-10 h-[72px]">
          <CustomButton
            onClick={submit}
            width="w-full"
            variant="contained"
            size="large"
            disabled={isLoading || buttonDisable}
          >
            {Buttonlabel}
          </CustomButton>
        </div>

      </BootstrapDialog>
    </div>
  </div>
);
export default CustomizedDialogs;
