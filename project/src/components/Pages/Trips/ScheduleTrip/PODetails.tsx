import { makeStyles } from '@mui/styles';
import InfoSquare from '../../../../assets/images/InfoSquare.svg';
import Tooltip, { TooltipProps, tooltipClasses } from '@mui/material/Tooltip';
import { styled } from '@mui/material/styles';
import moment from 'moment';

const useStyles = makeStyles(() => ({
  root: {
    // backgroundColor: '#151929',
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
  tooltip: {
    padding: '8px',
    backgroundColor: '#fff',
  },
}));

interface PODetailsProps {
  data: any,
}
const PODetails = ({ data }: PODetailsProps) => {
  const classes = useStyles();

  const LightTooltip = styled(({ className, ...props }: TooltipProps) => (
    <Tooltip {...props} classes={{ popper: className }} />
  ))(({ theme }) => ({
    [`& .${tooltipClasses.tooltip}`]: {
      backgroundColor: theme.palette.common.white,
      color: 'rgba(21, 25, 41, 1)',
      boxShadow: theme.shadows[1],
      fontSize: 14,
      background: '#ffffff',
    },
  }));

  return (
    <>
      <div className={classes.newTabBg}>
        <div className="childstyles ">
          <div className="f gap-6 lg:justify-between grid lg:grid-cols-4">
            <div className="flex justify-between lg:flex-col lg:gap-4">
              <p className="text-xs text-textgray">PO No</p>
              <p className="text-sm text-white break-all">
                {data?.po_id}
              </p>
            </div>
            <div className="flex justify-between lg:flex-col lg:gap-4">
              <p className="text-xs text-textgray">PO Created Date</p>
              <p className="text-sm text-white">
                {`${moment((data?.purchase_order?.created_at)).format('LT')} ${moment((data?.purchase_order?.created_at)).format('DD/MM/YYYY')}`}
              </p>
            </div>
            <div className="flex justify-between lg:flex-col lg:gap-4">
              <p className="text-xs text-textgray">Purchase Time & Date</p>
              <p className="text-sm text-white">
                {`${moment((data?.purchase_order?.purchase_date)).format('LT')} ${moment((data?.purchase_order?.purchase_date)).format('DD/MM/YYYY')}`}
              </p>
            </div>
            <div className="flex justify-between lg:flex-col lg:gap-4">
              <p className="text-xs text-textgray">Purchase Fuel Qty</p>
              <p className="text-sm text-white">
                {data?.purchase_order?.fuel_qty}
              </p>
            </div>
            <div className="flex justify-between lg:flex-col lg:gap-4">
              <p className="text-xs text-textgray">Supplier Name</p>
              <p className="text-sm text-white">
                <div className='flex'>
                  <div className=''>
                    {data?.purchase_order?.supplier?.name}
                  </div> 
                </div>
              </p>
            </div>
            <div className="flex justify-between lg:flex-col lg:gap-4">
              <p className="text-xs text-textgray">Download PO</p>
              <p className="text-sm text-white">
                <a className="text-green">
                  Download
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default PODetails;
