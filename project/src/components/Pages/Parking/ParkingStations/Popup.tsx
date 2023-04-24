import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import IconButton from '@mui/material/IconButton';
import CloseSquareLight from '../../../../assets/icons/lightIcons/CloseSquareLight.svg';
import Square from '../../../../assets/images/Square.svg';
import CustomButton from '../../../common/Button';
import { SelectInput } from '../../../common/input/Select';
import TextArea from '../../../common/input/TextArea';

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2),
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
  roles: any
}
const CustomizedDialogs = ({ open, roles, handleClose, title, type, name }: PopUpProps) => (
  <div>
    {
      type === 'success' ? null : (
        null
      )
    }
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
        PaperProps={{ sx: { width: '100%', m: 1, backgroundColor: '#404050', alignItems: 'center', borderColor: '#404050' } }}
      >
        <BootstrapDialogTitle id={name} onClose={handleClose} type={type}>
          <div className="flex justify-start">
            <p className="font-bold font-nunitoRegular flex justify-start text-[18px] text-white absolute top-2 left-6">
              {title}
            </p>
          </div>
        </BootstrapDialogTitle>
        <DialogContent>
          {
            type === 'success' ? (
              <div className="w-[325px] lg:w-[565px] bg-[#151929] mt-6 p-2 lg:p-10 rounded-lg flex flex-col gap-10 items-center">
                <div className="flex flex-col gap-2 text-[#6A6A78] text-[16px] font-nunitoRegular justify-center items-center">
                  <div className="flex gap-4 justify-center items-center">
                    <img src={Square} alt="" />
                    <p className="text-[#57CD53] items-center">
                      Successfully Created
                    </p>
                  </div>
                  <div className="text-center">
                    User with Name
                    {' '}
                    {name}
                    {' '}
                    Created Successfully
                  </div>
                </div>
              </div>
            ) : (
              <div className="w-[325px]  lg:w-[565px] mt-6 bg-[#151929] p-6 rounded-lg flex flex-col gap-6">
                <SelectInput
                  width="100%"
                  options={roles}
                  // handleChange={handleSearch}
                  // value={params.salesExecutive}
                  label="Select Sales Executive"
                  name="salesExecutive"
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
        {
          type === 'success' ? (
            <div className="flex justify-center pt-2 pb-10 h-[72px]">
              <CustomButton
                onClick={handleClose}
                width="w-full"
                variant="contained"
                size="large"
              >
                Okay
              </CustomButton>
            </div>
          ) : (
            <div className="flex justify-center pt-2 pb-10 h-[72px]">
              <CustomButton
                //   onClick={handleDocument}
                width="w-full"
                variant="contained"
                size="large"
              >
                Assign Now
              </CustomButton>
            </div>
          )
        }
      </BootstrapDialog>
    </div>
  </div>
);
export default CustomizedDialogs;
