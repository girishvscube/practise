import CustomButton from '../../../common/Button';
import { makeStyles } from '@mui/styles';
import { Accordion, AccordionDetails, AccordionSummary, Typography } from '@mui/material';
import DownCircle from '../../../../assets/icons/lightArrows/DownCircleLight.svg';
import userDefault from '../../../../assets/icons/user/user_default.svg';
import Link from '../../../../assets/images/Link.svg';
import DownloadIcon from '../../../../assets/images/Download.svg';
import EditIcon from '../../../../assets/images/EditIcon.svg';
import { useNavigate } from 'react-router-dom';
import { encryptData } from '../../../../utils/encryption';
import { useState } from 'react';
import { uuid } from '../../../../utils/helpers';

interface Props {
  supplier: any
}

const useStyles = makeStyles(() => ({
  root: {
    backgroundColor: '#262938 !important',
  },
  details: {
    border: '1px solid red',
    margin: ' 24px',
    backgroundColor: '#151929',
    borderRadius: '1rem',
  },

  AccordionSummary: {
    borderRadius: '15px',
    margin: '0px',
    padding: '0px',
    maxHeight: '25px',
  },
}));

const SupplierDetails: React.FC<Props> = ({ supplier }) => {
  const classes = useStyles();
  const navigate = useNavigate();
  const [supplierInfo, setSupplierInfo] = useState([] as any)
  const basicinfo = [
    {
      name: 'supplier Type',
      value: supplier.type,
    },
    {
      name: 'supplier ID',
      value: supplier?.id,
    },
    {
      name: 'Phone Number',
      value: supplier.phone,
    },
    {
      name: 'Email ID',
      value: supplier.email,
    },
    {
      name: 'Location Link',
      value: supplier?.location,
    },

    {
      name: 'AddressLine',
      value: supplier?.address,
    },
  ];


  const bankinfo = [
    { name: 'Bank Name', value: supplier?.bank_name },
    { name: 'Account Number', value: supplier?.account_number },
    { name: 'IFSC Code', value: supplier?.ifsc_code },
    {
      name: 'Account Name',
      value: supplier?.account_name,
    },
    {
      name: 'Cancel Check',
      value: 'Download',
      downloadlink: supplier?.cancelled_cheque,
    },
  ];

  const gst = [
    {
      name: 'GST Number',
      value: supplier?.gst,
    },
    {
      name: 'State',
      value: supplier?.state,
    },
    {
      name: 'GST Certificate',
      value: supplier?.gst_certificate,
    },
  ];

  const handleClick = (id: any) => {
    navigate(`/suppliers/edit/${encryptData(id)}`);
  };



  return (
    <div className="flex flex-col divstyles bg-lightbg w-full ">
      <div className="flex justify-between lg:flex-col flex-row lg:gap-6 gap-8 lg:justify-center lg:items-center">
        <div className="rounded-lg lg:w-44 lg:h-44 lg:ml-auto lg:mr-auto w-32 h-32">
          <img src={supplier?.image
            ? supplier.image : userDefault} alt="" className="rounded-lg" />
        </div>
        <div className="lg:mt-0 mt-10 flex flex-col gap-2">
          <p className="text-center">{supplier?.name}</p>
          <CustomButton
            onClick={() => {
              handleClick(supplier?.id);
            }}
            borderRadius="1rem"
            width="w-fit "
            variant="outlined"
            size="medium"
            icon={<img src={EditIcon} alt="" />}
          >
            Edit Profile
          </CustomButton>
        </div>
      </div>
      {basicinfo.length ? (
        <Accordion elevation={0} className={classes.root} defaultExpanded>
          <AccordionSummary
            expandIcon={<img src={DownCircle} alt="icon" />}
            aria-controls="panel1a-content"
            id="panel1a-header"

          >
            <Typography>
              {' '}
              <p className=" font-nunitoRegular my-2 text-white">Supplier Details</p>
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>
              <div className="font-nunitoRegular bg-darkbg flex flex-col gap-y-6 rounded-lg p-[24px] ">
                {basicinfo.map((item: any) => (
                  <div key={uuid()} className="flex justify-between">
                    <p className=" text-xs text-textgray">{item.name}</p>

                    {item?.name?.includes('Link') ? (
                      <div className="flex">
                        <a
                          className="text-green  cursor-pointer"
                          target='_blank'
                          href={item?.value}
                        >
                          <div className="flex gap-2">
                            <p>Link</p>
                            <img src={Link} alt="" />
                          </div>
                        </a>
                      </div>
                    ) : (
                      <p className="text-sm text-white  text-right">
                        {item.value}

                        {item?.name === 'AddressLine' ? (
                          <div>
                            <p>
                              {supplier?.city}
                              <br />
                              {supplier?.state}
                              <br />
                              {supplier?.pincode}
                            </p>
                          </div>
                        ) : null}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </Typography>
          </AccordionDetails>
        </Accordion>
      ) : (
        ''
      )}

      {bankinfo.length ? (
        <Accordion elevation={0} className={classes.root}>
          <AccordionSummary
            expandIcon={<img src={DownCircle} alt="icon" />}
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            <Typography>
              {' '}
              <p className=" font-nunitoRegular my-2 text-white">Bank Details</p>
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>
              <div className="font-nunitoRegular bg-darkbg flex flex-col gap-y-6 rounded-lg p-[24px] ">
                {bankinfo.map((item: any) => (
                  <div key={uuid()} className="flex justify-between">
                    <p className=" text-xs text-textgray">{item.name}</p>
                    {item.name.includes('Check') ? (
                      <a
                        className="text-green cursor-pointer"
                        href={item.downloadlink}
                        download
                      >
                        <div className="flex gap-2">
                          <p>Download</p>
                          <img src={DownloadIcon} alt="" />
                        </div>
                      </a>
                    ) : (
                      <p className="text-sm text-white  text-right">
                        {item.value}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </Typography>
          </AccordionDetails>
        </Accordion>
      ) : (
        ''
      )}

      {gst?.length ? (
        <Accordion elevation={0} className={classes.root}>
          <AccordionSummary
            expandIcon={<img src={DownCircle} alt="icon" />}
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            <Typography>
              {' '}
              <p className=" font-nunitoRegular my-2 text-white">GST Details</p>
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>
              <div className="font-nunitoRegular bg-darkbg flex flex-col gap-y-6 rounded-lg p-[24px] ">
                {gst?.map((item: any) => (
                  <div key={uuid()} className="flex justify-between">
                    <p className=" text-xs text-textgray">{item.name}</p>
                    {item.name.includes('Certificate') ? (
                      <a
                        className="text-green cursor-pointer"
                        href={item?.value}
                        download
                      >
                        <div className="flex gap-2">
                          <p>Download</p>
                          <img src={DownloadIcon} alt="" />
                        </div>
                      </a>
                    ) : (
                      <p className="text-sm text-white  text-right">
                        {item.value}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </Typography>
          </AccordionDetails>
        </Accordion>
      ) : (
        ''
      )}
    </div>
  );
};

export default SupplierDetails;
