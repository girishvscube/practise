import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import IconButton from '@mui/material/IconButton';
import CloseSquareLight from '../../../../../assets/icons/lightIcons/CloseSquareLight.svg';
import CustomButton from '../../../../common/Button';
import { Input } from '../../../../common/input/Input';
import RadioButton from '../../../../common/RadioButton';
import ModulesAccess from './ModulesAccess';

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

const items = [
  {
    value: 'Manager',
    label: 'Manager',
  },
  {
    value: 'Executive',
    label: 'Executive',
  },
];

const BootstrapDialogTitle = (props: DialogTitleProps) => {
  const { children, onClose, type, ...other } = props;

  const closeModel =() =>{
    onClose()
  }
  return (
    <DialogTitle sx={{ m: 0, p: 3 }} {...other}>
      {children}
        <IconButton
          aria-label="close"
          onClick={closeModel}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[600],
          }}
        >
          <img src={CloseSquareLight} alt="" />
        </IconButton>
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
  setParams: any
  submit: any
  handleRootChange:any
  handleChildChange:any
  handleChange:any
  formErrors:any
}
const CustomizedDialogs = ({
  open,
  handleClose,
  title,
  type,
  name,
  submit,
  setParams,
  params,
  handleRootChange,
  handleChildChange,
  handleChange,
  formErrors,
}: PopUpProps) => {
  return (
    <div>
      <BootstrapDialog  sx={{
            '& .MuiBackdrop-root': {
              backgroundColor: 'rgba(0,0,0,0.8)',
              backdropFilter: 'blur(5px)',
            },
          }}
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
          <div className="flex flex-col mt-2 gap-10  rounded-2">
            <div className="w-full  bg-darkGray p-6 rounded-lg flex flex-col gap-6">
              <Input
                rows={1}
                width="w-full"
                disabled={false}
                readOnly={false}
                error={!!formErrors.name}
                value={params?.name}
                handleChange={handleChange}
                helperText={formErrors.name}
                label="Enter the User Role"
                name="name"
              />

              <div className="divstyles">
                <div>
                  <p className="text-white text-s font-nunitoRegular mb-2">
                    <u>Select the level that user can Access:</u>
                  </p>
                  <RadioButton onChange={setParams} items={items} defaultValue={params.role} />
                </div>
              </div>

              <div className="divstyles">
                <div>
                  <p className="text-white text-s font-nunitoRegular mb-2">
                    <u>Select the Module that user can Access:</u>
                  </p>
                </div>

                <ModulesAccess params={params} handleRootChange={handleRootChange}  handleChildChange={handleChildChange}/>
              </div>
            </div>
          </div>

        </DialogContent>

        <div className="flex justify-center pt-2 pb-10 h-[72px]">
          <CustomButton
            onClick={submit}
            width="w-full"
            variant="contained"
            size="large"
          >
           {params.id ? ' Update ' :'Submit'}
          </CustomButton>
        </div>
      </BootstrapDialog>
    </div>
  );
};

export default CustomizedDialogs;
