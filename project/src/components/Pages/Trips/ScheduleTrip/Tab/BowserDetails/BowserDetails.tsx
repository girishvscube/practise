
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles(() => ({
  root: {
    paddingY: '30px',
    '&:before': {
      backgroundColor: 'transparent',
    },
  },
  newTabBg:{
    borderTopLeftRadius: '0px',
    borderTopRightRadius: '0px',
    borderBottomLeftRadius: '8px',
    borderBottomRightRadius: '8px',
    padding: '24px',
    backgroundColor: 'rgb(38 41 56/var(--tw-bg-opacity))',
    border: '1px solid #404050',
    borderTop: '0px'
  },
}));

interface BowserDetailsProps {
  data: any
}
const BowserDetails = ({ data }: BowserDetailsProps) => {
  const classes = useStyles();

  return (
    <>
        
        <div className={classes.newTabBg}>
          <div className="childstyles ">
            <div className="gap-6 lg:justify-between grid lg:grid-cols-4">
              <div className="flex justify-between lg:flex-col lg:gap-4">
                <p className="text-xs text-textgray">Bowser Name:</p>
                <p className="text-sm text-white break-all">
                  {data?.bowser?.name}
                </p>
              </div>
              <div className="flex justify-between lg:flex-col lg:gap-4">
                <p className="text-xs text-textgray">Registration Number:</p>
                <p className="text-sm text-white">
                  {data?.bowser?.registration_no}
                </p>
              </div>
              <div className="flex justify-between lg:flex-col lg:gap-4">
                <p className="text-xs text-textgray">Driver Name:</p>
                <p className="text-sm text-white">
                {data?.bowser?.driver?.name || "--"}
                </p>
              </div>
              <div className="flex justify-between lg:flex-col lg:gap-4">
                <p className="text-xs text-textgray">Last Trip End time/ Date:</p>
                <p className="text-sm text-white">
                  --
                </p>
              </div>
              <div className="flex justify-between lg:flex-col lg:gap-4">
                <p className="text-xs text-textgray">Parking Station:</p>
                <p className="text-sm text-white">
                  {data?.bowser?.parkingstation?.station_name}
                </p>
              </div>
            </div>
          </div> 
      </div>
    </>
  );
};
export default BowserDetails;
