import { styled } from '@mui/material/styles';
import { useState, useEffect } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import IconButton from '@mui/material/IconButton';
import CloseSquareLight from '../assets/icons/lightIcons/CloseSquareLight.svg';
import CustomButton from '../components/common/Button';
import { SelectInput } from '../components/common/input/Select';
import TextArea from '../components/common/input/TextArea';
import { Input } from '../components/common/input/Input';
import { ClassNames } from '@emotion/react';
import moment from 'moment';
import FileUpload from '../components/common/FileUpload';

// const useStyles = makeStyles(() => ({
//   root: {
    
//   },

// }));

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
  '& .MuiOutlinedInput-notchedOutline': {
    borderRadius: '10px !important',
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
  params: any,
  handleChange: any, 
  UpdateProfile: any,
  handleImage: any,
  removeImage: any,
  UpdatePassword: any,
}
const CustomizedDialogs = ({ open, handleClose, title, type, name, UpdateProfile, params, handleChange, removeImage, handleImage,
  UpdatePassword }: PopUpProps) => {

  const [meta, setMeta] = useState({
    tab:"BasicInfo",
  } as any);

  // console.log(params, 'par....')

  return (
    <div>
      <div>
        <BootstrapDialog
          onClose={handleClose}
          aria-labelledby="customized-dialog-title"
          open={open}
          PaperProps={{ sx: { m: 0, backgroundColor: 'arsenic', alignItems: 'center', borderColor: 'arsenic' } }}
        >
          <BootstrapDialogTitle id={name} onClose={handleClose} type={type}>
            <div className="flex justify-start mb-2">
              <p className="font-bold font-nunitoRegular flex justify-start text-white absolute top-3 left-6">
                {title}
              </p>
            </div>
          </BootstrapDialogTitle>
          <DialogContent>
            <div className="">
              <div className="border border-border  w-[325px] lg:w-[496px]  bg-[#151929]  rounded-lg flex flex-col">
                <div className=" flex justify-evenly bg-lightbg rounded-t-lg  ">
                  <div
                    className={`cursor-pointer border-border w-full ${meta.tab === 'BasicInfo' ? 'border-yellow border-b-2 ' : 'border-r'
                      }`}
                  >
                    <p
                      onClick={() => setMeta({tab: 'BasicInfo'})}
                      className={`py-2 text-center  ${ meta.tab === 'BasicInfo' ? 'text-yellow ' : 'text-white'
                        }`}
                    >
                      Basic Info
                    </p>
                  </div>
                  <div
                    className={` cursor-pointer border-border w-full  ${ meta.tab === 'ChangePwd' ? 'border-yellow border-b-2 ' : 'border-l'
                      }`}
                  >
                    <p
                      onClick={() => setMeta({tab: 'ChangePwd'})}
                      className={` py-2   text-center  ${meta.tab === 'ChangePwd' ? 'text-yellow ' : 'text-white'
                        } `}
                    >
                      Change Password
                    </p>
                  </div>
                </div>
                {
                  meta.tab === 'BasicInfo' &&
                  <>
                    <div className="p-4 rounded-lg mt-4">
                      <Input
                        rows={1}
                        bgcolor="#262938"
                        value={params?.name}
                        handleChange={handleChange}
                        label='Name'
                        name="name"
                      />
                    </div>
                    <div className="p-4 rounded-lg">
                      <Input
                        rows={1}
                        bgcolor="#262938"
                        value={params?.phone}
                        handleChange={handleChange}
                        label='Phone Number'
                        name="phone"
                      />
                    </div>
                    <div className="p-4 rounded-lg">
                      <p className="text-white mb-2">Display Image</p>
                      <FileUpload
                        filename="image"
                        styleType="md"
                        setImage={handleImage}
                        acceptMimeTypes={['image/jpeg']}
                        title="Drag and Drop Image here"
                        label="File Format: .jpeg/ .png"
                        id="image"
                        maxSize={5}
                        removeImage={removeImage}
                      />
                    </div>
                    <div className="flex justify-center pt-2 pb-10 h-[72px]">
                      <CustomButton
                        onClick={UpdateProfile}
                        width="w-full"
                        variant="contained"
                        size="large"
                      >
                        Update Details
                      </CustomButton>
                    </div>
                  </> 
                }
                {
                  meta.tab === 'ChangePwd' &&
                  <>
                    <div className="p-4 rounded-lg mt-4">
                      <p className="text-white mb-5">Change your Password Here:</p>
                      <Input
                        rows={1}
                        disabled={false}
                        readOnly={false}
                        bgcolor="#262938"
                        value={params?.old_pwd}
                        handleChange={handleChange}
                        label='Old Password'
                        name="old_pwd"
                      />
                    </div>
                    <div className="pl-4 pr-4 pt-2 mb-5 rounded-lg">
                      <Input
                        rows={1}
                        disabled={false}
                        readOnly={false}
                        bgcolor="#262938"
                        value={params?.new_pwd}
                        handleChange={handleChange}
                        label='New Password'
                        name="new_pwd"
                      />
                    </div>
                    <div className="flex justify-center pt-2 pb-10 h-[72px]">
                      <CustomButton
                        onClick={UpdatePassword}
                        width="w-full"
                        variant="contained"
                        size="large"
                      >
                        Update Details
                      </CustomButton>
                    </div>
                  </>
                }
              </div>
            </div>
          </DialogContent>
                    
          

        </BootstrapDialog>
      </div>
    </div>
  );
}
export default CustomizedDialogs;
