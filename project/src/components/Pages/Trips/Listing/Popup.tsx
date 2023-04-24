import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import IconButton from '@mui/material/IconButton';
import CloseSquareLight from '../../../../assets/icons/lightIcons/CloseSquareLight.svg';
import CustomButton from '../../../common/Button';
import { SelectInput } from '../../../common/input/Select';
import TextArea from '../../../common/input/TextArea';

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
  submit: any
}
const CustomizedDialogs = ({ open, roles, handleClose, title, type, name, submit, setParams, params }: PopUpProps) =>
  (
    <div>
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

              <div className="flex flex-col mt-6 gap-10  rounded-2">
                <div className="w-full mt-10 bg-darkGray p-6 rounded-lg flex flex-col gap-6">
                  <div className="flex gap-6">
                    <div>
                      {' '}
                      <img src="https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8dXNlcnxlbnwwfHwwfHw%3D&w=1000&q=80" alt="" className="w-10 rounded-full" />
                    </div>
                    <div>
                      <p className="text-white">
                        Isac Newton
                        <span className="text-textgray">Can you reassign to some other executives?. I am feeling sick.</span>
                      </p>
                      <p className="text-textgray">11:59 PM, 26/09/2022</p>
                    </div>
                  </div>

                </div>
                <div className="w-full  bg-darkGray p-6 rounded-lg flex flex-col gap-6">
                  <SelectInput
                    width="100%"
                    options={roles}
                    handleChange={setParams}
                    value={params.assigned_to}
                    label="Select Sales Executive"
                    name="assigned_to"
                  />
                  <TextArea
                    placeholder="Additional Notes"
                    id="123456"
                    name="text_area"
                    rows={5}
                    className="col-span-3"
                  />
                </div>

              </div>
            ) : (
              <div className="w-full mt-10 bg-darkGray p-6 rounded-lg flex flex-col gap-6">
                <SelectInput
                  width="100%"
                  options={roles}
                  handleChange={setParams}
                  value={params.assigned_to}
                  label="Select Sales Executive"
                  name="assigned_to"
                />
                <TextArea
                  placeholder="Additional Notes"
                  id="123456"
                  name="text_area"
                  rows={5}
                  className="col-span-3"
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
            >
              Assign Now
            </CustomButton>
          </div>

        </BootstrapDialog>
      </div>
    </div>
  );
export default CustomizedDialogs;
