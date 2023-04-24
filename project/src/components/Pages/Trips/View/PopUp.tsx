import { styled } from '@mui/material/styles';
import { useState, useEffect } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import IconButton from '@mui/material/IconButton';
import CloseSquareLight from '../../../../assets/icons/lightIcons/CloseSquareLight.svg';
import CustomButton from '../../../common/Button';
import { SelectInput } from '../../../common/input/Select';
import TextArea from '../../../common/input/TextArea';
import { Input } from '../../../common/input/Input';
import { ClassNames } from '@emotion/react';
import moment from 'moment';

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
  setParams: any,
  submit: any
}
const CustomizedDialogs = ({ open, handleClose, title, type, name, submit, params, setParams }: PopUpProps) => {

  return (
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
              <p className="font-bold font-nunitoRegular flex justify-start text-white absolute top-3 left-6">
                {title}
              </p>
            </div>
          </BootstrapDialogTitle>
          <DialogContent>
              <div className="flex flex-col mt-3 gap-10  rounded-2">
                <div className="w-full bg-darkGray p-6 rounded-lg flex flex-col gap-6">
                  <div className="flex justify-between">
                    <div>
                      <p className="text-textgray">{!params.is_start ? 'Time of Ending' : 'Time of Starting'}</p>
                    </div>
                    <div>
                    <p className="text-white">{moment().format('HH:mm, DD/MM/YYYY')}</p>
                    </div>
                  </div>

                </div>
                <div className="w-full  bg-darkGray p-6 rounded-lg flex flex-col gap-6">
                  <p className="text-textgray">Enter Current Odometer Reading here:</p>
                  <div className="grid grid-cols-9 gap-[10px]">
                    <Input
                      rows={1}
                      width="w-full"
                      disabled={false}
                      readOnly={false}
                      error={false}
                      value={params.val1}
                      handleChange={setParams}
                      helperText=''
                      label=""
                      name="val1"
                    />
                    <Input
                      rows={1}
                      width="w-full"
                      disabled={false}
                      readOnly={false}
                      error={false}
                      value={params.val2}
                      handleChange={setParams}
                      helperText=''
                      label=""
                      name="val2"
                    />
                    <Input
                      rows={1}
                      width="w-full"
                      disabled={false}
                      readOnly={false}
                      error={false}
                      value={params.val3}
                      handleChange={setParams}
                      helperText=''
                      label=""
                      name="val3"
                    />
                    <Input
                      rows={1}
                      width="w-full"
                      disabled={false}
                      readOnly={false}
                      error={false}
                      value={params.val4}
                      handleChange={setParams}
                      helperText=''
                      label=""
                      name="val4"
                    />
                    <Input
                      rows={1}
                      width="w-full"
                      disabled={false}
                      readOnly={false}
                      error={false}
                      value={params.val5}
                      handleChange={setParams}
                      helperText=''
                      label=""
                      name="val5"
                    />
                    <Input
                      rows={1}
                      width="w-full"
                      disabled={false}
                      readOnly={false}
                      error={false}
                      value={params.val6}
                      handleChange={setParams}
                      helperText=''
                      label=""
                      name="val6"
                    />
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
              {!params.is_start ? 'End Now' : 'Start Now'}
            </CustomButton>
          </div>

        </BootstrapDialog>
      </div>
    </div>
  );
}
export default CustomizedDialogs;
