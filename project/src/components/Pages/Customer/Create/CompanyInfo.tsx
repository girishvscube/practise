import { useState, useEffect } from 'react'
import { Input } from '../../../common/input/Input'
import { useSelector, useDispatch } from 'react-redux'
import { SelectInput } from '../../../common/input/Select'
import { SelectWithName } from '../../../common/input/SelectWithName'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import FormHelperText from '@mui/material/FormHelperText'
import Select from '@mui/material/Select'
import { makeStyles } from '@mui/styles'
import { uuid } from './../../../../utils/helpers'
import CustomButton from '../../../common/Button'
import HeadingTab from '../../../common/HeadingTab/HeadingTab'
import FileUpload from '../../../common/FileUpload'
import CustomCheckbox from '../../../common/input/Checkbox'
import axiosInstance from '../../../../utils/axios'
import TextArea from '../../../common/input/TextArea'
import {
  getStateList,
  fetchCustomerTypeDropdown,
  getindustryList,
  getSaleExecutiveList,
  fetchNetDueList,
  fetchEqupiments,
} from '../../../../features/dropdowns/dropdownSlice'

interface Props {
  id?: any
  params: any
  handleChange: any
  SaveCompanyInfo: any
  errors: any
  onCancel?: any
  disableButton?: any
  setDisableButton: any
  removeFile: any
}

const useStyles = makeStyles({
  select: {
    '& ul': {
      backgroundColor: 'rgba(255, 255, 255, 0.1);',
    },
    '& li': {
      backgroundColor: '#2F3344',
    },
  },
  icon: {
    fill: 'white',
  },
  root: {
    '& .MuiOutlinedInput-input': {
      color: '#FFFF',
    },
    '& .MuiInputLabel-root': {
      color: '#6A6A78',
    },
    '& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline': {
      borderColor: '#404050',
      borderRadius: '8px',
    },
    '&:hover .MuiOutlinedInput-input': {
      color: '#FFFF',
    },
    '&:hover .MuiInputLabel-root': {
      color: '#6A6A78',
    },
    '&:hover .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline': {
      borderColor: '#FFFF',
    },
    '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-input': {
      color: '#FFFF',
    },
    '& .MuiInputLabel-root.Mui-focused': {
      color: '#FFCD2C',
    },
    '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
      borderColor: '#FFCD2C',
    },
  },
})

const CompanyInfo: React.FC<Props> = ({
  id,
  handleChange,
  params,
  SaveCompanyInfo,
  errors,
  onCancel,
  disableButton,
  setDisableButton,
  removeFile,
}) => {
  const classes = useStyles()
  const { states, customerTypeDropdown, industry, salesExecutives, equipments, netDueOptions } =
    useSelector((state: any) => state.dropdown)
  const [executive, setExecutive] = useState([])
  const [industrytypes, setIndustryTypes] = useState([])
  const [netdues, setNetdues] = useState([])
  // const [equipments, setEquipments] = useState([])
  // console.log(id, 'paraid');
  const dispatch = useDispatch()
  // console.log(params, 'params');

  useEffect(() => {
    dispatch(fetchEqupiments())
    dispatch(fetchNetDueList())
    dispatch(getSaleExecutiveList('customers'))
    dispatch(getindustryList())
    dispatch(getStateList())
    dispatch(fetchCustomerTypeDropdown())
  }, [])

  return (
    <form>
      {/* Company Details */}
      <div>
        <HeadingTab title='Company Info' />
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-[24px]'>
          <div className='flex flex-col gap-[24px]'>
            <Input
              rows={1}
              width='w-full'
              error={errors?.step_1?.company_name}
              helperText={errors?.step_1?.company_name}
              handleChange={handleChange}
              value={params.step_1.company_name}
              label='Company name'
              name='company_name'
            />
            <Input
              rows={1}
              width='w-full'
              error={errors?.step_1?.phone}
              helperText={errors?.step_1?.phone}
              handleChange={handleChange}
              value={params.step_1.phone}
              label='Phone Number'
              name='phone'
            />
            <Input
              rows={1}
              width='w-full'
              error={errors?.step_1?.email}
              helperText={errors?.step_1?.email}
              handleChange={handleChange}
              value={params.step_1.email}
              label='Email ID'
              name='email'
            />

            <FormControl
              className={`${classes.root}`}
              fullWidth
              error={errors?.step_1?.customer_type}
            >
              <InputLabel id='select-input-label'>Select Customer Type</InputLabel>
              <Select
                labelId='select-input-label'
                MenuProps={{
                  sx: {
                    '&& .MuiMenuItem-root': {
                      backgroundColor: '#2F3344',
                      border: '1px solid #404050 !important',
                      color: '#FFFFFF',
                      '&:hover': {
                        backgroundColor: '#444757 !important',
                      },
                    },
                    '&& .MuiMenu-list': {
                      padding: '0',
                    },

                    '&& .Mui-selected': {
                      color: '#FFCD2C !important',
                      backgroundColor: '#333748',
                    },
                  },
                }}
                sx={{
                  color: 'white',
                  '.MuiSvgIcon-root ': {
                    fill: 'white !important',
                  },
                }}
                required={true}
                value={params?.step_1?.customer_type}
                onChange={handleChange}
                label='Select Customer Type'
                name='customer_type'
                error={errors?.step_1?.customer_type}
                fullWidth
              >
                {customerTypeDropdown?.map((item: any) => (
                  <MenuItem key={uuid()} value={item.name}>
                    {item?.name}
                  </MenuItem>
                ))}
              </Select>

              <FormHelperText>{errors?.step_1?.customer_type}</FormHelperText>
            </FormControl>

            <SelectWithName
              // width="100%"
              options={equipments}
              error={errors?.step_1?.equipment}
              helperText={errors?.step_1?.equipment}
              handleChange={handleChange}
              value={params?.step_1?.equipment}
              label='Equipment Type'
              name='equipment'
            />
            <SelectWithName
              // width="100%"
              options={industry}
              error={errors?.step_1?.industry_type}
              helperText={errors?.step_1?.industry_type}
              handleChange={handleChange}
              value={params.step_1.industry_type}
              label='Industry Type'
              name='industry_type'
            />

            <TextArea
              placeholder='Address'
              value={params?.step_1?.address}
              name='address'
              rows={5}
              error={errors?.step_1?.address}
              helperText={errors?.step_1?.address}
              handleChange={handleChange}
            />

            <Input
              rows={1}
              width='w-full'
              error={errors?.step_1?.city}
              helperText={errors?.step_1?.city}
              handleChange={handleChange}
              value={params.step_1.city}
              label='City'
              name='city'
            />
            <div className='grid grid-cols-1 lg:grid-cols-2 gap-[24px]'>
              <Input
                rows={1}
                width='w-full'
                error={errors?.step_1?.pincode}
                helperText={errors?.step_1?.pincode}
                handleChange={handleChange}
                value={params.step_1.pincode}
                label='Pincode'
                name='pincode'
              />
              <SelectInput
                // width="100%"
                required
                options={states}
                error={errors?.step_1?.state}
                helperText={errors?.step_1?.state}
                handleChange={handleChange}
                value={params.step_1.state}
                label='State'
                name='state'
              />
            </div>
          </div>

          <div className='flex flex-col gap-10'>
            <div className=''>
              <p className='mb-2'>Upload Image/Logo</p>
              <FileUpload
                removeImage={() => removeFile('image')}
                filename='image'
                imageUrl={params?.step_1?.image}
                styleType={window.innerWidth < 768 ? 'md' : 'lg'}
                setImage={handleChange}
                acceptMimeTypes={['image/jpeg']}
                title='Drag and Drop PDF here'
                label='File Format: .jpeg/ .png'
                id='image'
                maxSize={5}
                error={errors?.step_1?.image}
              />
              {errors?.step_1?.image && (
                <p className='ml-4 text-errortext text-xs'>{`*${errors?.step_1?.image}`}</p>
              )}
            </div>
          </div>
        </div>
      </div>

      <br />

      {/* Bank Details */}
      <div>
        <HeadingTab title='Bank Account Details' />
        <div className='grid grid-cols-1 lg:grid-cols-2 mt-[24px] gap-[24px]'>
          <div className='flex flex-col gap-[24px]'>
            <Input
              rows={1}
              width='w-full'
              disabled={false}
              readOnly={false}
              error={errors?.step_1?.account_number}
              handleChange={handleChange}
              helperText={errors?.step_1?.account_number}
              value={params.step_1.account_number}
              label='Account Number'
              name='account_number'
            />
            <Input
              rows={1}
              width='w-full'
              disabled={false}
              readOnly={false}
              error={errors?.step_1?.account_name}
              handleChange={handleChange}
              helperText={errors?.step_1?.account_name}
              value={params.step_1.account_name}
              label='Account Name'
              name='account_name'
            />
            <Input
              rows={1}
              width='w-full'
              disabled={false}
              readOnly={false}
              error={errors?.step_1?.bank_name}
              handleChange={handleChange}
              helperText={errors?.step_1?.bank_name}
              value={params.step_1.bank_name}
              label='Bank Name'
              name='bank_name'
            />
            <Input
              rows={1}
              width='w-full'
              disabled={false}
              readOnly={false}
              error={errors?.step_1?.ifsc_code}
              handleChange={handleChange}
              helperText={errors?.step_1?.ifsc_code}
              value={params.step_1.ifsc_code}
              label='IFSC Code'
              name='ifsc_code'
            />
          </div>
          <div className='mb-6 sm:mb-0 h-20 flex flex-col gap-2'>
            <p>Cancelled Cheque</p>
            <FileUpload
              removeImage={() => removeFile('cancelled_cheque')}
              imageUrl={params?.step_1?.cancelled_cheque}
              filename='cancelled_cheque'
              styleType='md'
              setImage={handleChange}
              acceptMimeTypes={['application/pdf']}
              title='Drag and Drop PDF here'
              label='File Format:PDF Files'
              id='cancelled_cheque'
              maxSize={5}
              error={errors?.step_1?.cancelled_cheque}
            />
            {errors?.step_1?.cancelled_cheque && (
              <p className='ml-4 text-errortext text-xs'>{`*${errors?.step_1?.cancelled_cheque}`}</p>
            )}
          </div>
        </div>
      </div>

      <br className='sm:block hidden ' />
      <br className='sm:block hidden ' />

      {/* GST Details */}
      <div className='mt-6 sm:mt-0'>
        <HeadingTab title='GST Details' />
        <div className='grid grid-cols-1 lg:grid-cols-2 mt-[24px] gap-[24px]'>
          <Input
            rows={1}
            width='w-full'
            error={errors?.step_1?.gst_no}
            helperText={errors?.step_1?.gst_no}
            handleChange={handleChange}
            value={params.step_1.gst_no}
            label='GST Number'
            name='gst_no'
          />

          <div className='flex flex-col gap-2'>
            <p>GST Certificate</p>
            <FileUpload
              removeImage={() => removeFile('gst_certificate')}
              filename='gst_certificate'
              styleType='md'
              setImage={handleChange}
              acceptMimeTypes={['application/pdf']}
              title='Drag and Drop PDF here'
              label='File Format:PDF Files'
              id='gst_certificate'
              maxSize={5}
              imageUrl={params?.step_1?.gst_certificate}
              error={errors?.step_1?.gst_certificate}
            />
            {errors?.step_1?.gst_certificate && (
              <p className='ml-4 text-errortext text-xs'>{`*${errors?.step_1?.gst_certificate}`}</p>
            )}
          </div>
        </div>
      </div>

      <br />

      {/* Credit Option */}
      {params?.step_1?.customer_type?.toLowerCase() === 'company' && (
        <div>
          <HeadingTab title='Credit Option' />
          <div className='mt-[24px] gap-[24px]'>
            <div className='flex flex-col gap-[24px]'>
              <CustomCheckbox
                handleCheck={handleChange}
                ischecked={params?.step_1?.is_credit_availed}
                color='text-yellow'
                name='is_credit_availed'
                Label='Opt for Credit Option to this Customer.'
              />

              {params.step_1.is_credit_availed ? (
                <>
                  <Input
                    rows={1}
                    width='sm:w-1/2'
                    error={errors?.step_1?.credit_limit}
                    helperText={errors?.step_1?.credit_limit}
                    handleChange={handleChange}
                    value={params.step_1.credit_limit}
                    label='Enter Credit Limit'
                    name='credit_limit'
                  />
                  <Input
                    rows={1}
                    width='sm:w-1/2'
                    error={errors?.step_1?.outstanding_amount}
                    helperText={errors?.step_1?.outstanding_amount}
                    handleChange={handleChange}
                    value={params.step_1.outstanding_amount}
                    label='Enter Outstanding Amount'
                    name='outstanding_amount'
                  />

                  <div className=''>
                    <SelectInput
                      width={window.innerWidth < 768 ? '100%' : '50%'}
                      options={netDueOptions}
                      error={errors?.step_1?.credit_net_due_id}
                      helperText={errors?.step_1?.credit_net_due_id}
                      handleChange={handleChange}
                      value={params.step_1.credit_net_due_id}
                      label='Select Net D'
                      name='credit_net_due_id'
                    />
                  </div>
                </>
              ) : null}
            </div>

            <br />
            {params.step_1.is_credit_availed ? (
              <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                <div className=''>
                  <p className='pl-5'>Pan Card</p>
                  <div className=' mt-2'>
                    <FileUpload
                      removeImage={() => removeFile('credit_pan')}
                      filename='credit_pan'
                      styleType='md'
                      setImage={handleChange}
                      acceptMimeTypes={['application/pdf']}
                      title='Drag and Drop PDF here'
                      label='File Format: PDF Files'
                      id='credit_pan'
                      maxSize={5}
                      imageUrl={params?.step_1?.credit_pan}
                      error={errors?.step_1?.credit_pan}
                    />
                    {errors?.step_1?.credit_pan && (
                      <p className='ml-4 text-errortext text-xs'>{`*${errors?.step_1?.credit_pan}`}</p>
                    )}
                  </div>
                </div>
                <div className=''>
                  <p className='pl-5'>Bank Statement</p>
                  <div className=' mt-2'>
                    <FileUpload
                      removeImage={() => removeFile('credit_bank_statement')}
                      filename='credit_bank_statement'
                      styleType='md'
                      setImage={handleChange}
                      acceptMimeTypes={['application/pdf']}
                      title='Drag and Drop PDF here'
                      label='File Format: PDF Files'
                      id='credit_bank_statement'
                      maxSize={5}
                      imageUrl={params?.step_1?.credit_bank_statement}
                      error={errors?.step_1?.credit_bank_statement}
                    />
                    {errors?.step_1?.credit_bank_statement && (
                      <p className='ml-4 text-errortext text-xs'>{`*${errors?.step_1?.credit_bank_statement}`}</p>
                    )}
                  </div>
                </div>
                <div className=''>
                  <p className='pl-5'>Aadhar Card</p>
                  <div className=' mt-2'>
                    <FileUpload
                      removeImage={() => removeFile('credit_aadhaar')}
                      filename='credit_aadhaar'
                      styleType='md'
                      setImage={handleChange}
                      acceptMimeTypes={['application/pdf']}
                      title='Drag and Drop PDF here'
                      label='File Format: PDF Files'
                      id='credit_aadhaar'
                      maxSize={5}
                      imageUrl={params?.step_1?.credit_aadhaar}
                      error={errors?.step_1?.credit_aadhaar}
                    />
                    {errors?.step_1?.credit_aadhaar && (
                      <p className='ml-4 text-errortext text-xs'>{`*${errors?.step_1?.credit_aadhaar}`}</p>
                    )}
                  </div>
                </div>
                <div className=''>
                  <p className='pl-5'>Bank Cheque</p>
                  <div className=' mt-2'>
                    <FileUpload
                      removeImage={() => removeFile('credit_blank_cheque')}
                      filename='credit_blank_cheque'
                      styleType='md'
                      setImage={handleChange}
                      acceptMimeTypes={['application/pdf']}
                      title='Drag and Drop PDF here'
                      label='File Format: PDF Files'
                      id='credit_blank_cheque'
                      maxSize={5}
                      imageUrl={params?.step_1?.credit_blank_cheque}
                      error={errors?.step_1?.credit_blank_cheque}
                    />
                    {errors?.step_1?.credit_blank_cheque && (
                      <p className='ml-4 text-errortext text-xs'>{`*${errors?.step_1?.credit_blank_cheque}`}</p>
                    )}
                  </div>
                </div>
                <div className=''>
                  <p className='pl-5'>CIBIL Request Form</p>
                  <div className=' mt-2'>
                    <FileUpload
                      removeImage={() => removeFile('credit_cibil')}
                      filename='credit_cibil'
                      styleType='md'
                      setImage={handleChange}
                      acceptMimeTypes={['application/pdf']}
                      title='Drag and Drop PDF here'
                      label='File Format: PDF Files'
                      id='credit_cibil'
                      maxSize={5}
                      imageUrl={params?.step_1?.credit_cibil}
                      error={errors?.step_1?.credit_cibil}
                    />
                    {errors?.step_1?.credit_cibil && (
                      <p className='ml-4 text-errortext text-xs'>{`*${errors?.step_1?.credit_cibil}`}</p>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <></>
            )}
          </div>
        </div>
      )}

      <br />

      {/* Select Sales Executive */}
      <div>
        <HeadingTab title='Select Sales Executive' />
        <div className=''>
          <SelectInput
            required
            width={window.innerWidth < 768 ? '100%' : '50%'}
            options={salesExecutives}
            error={errors?.step_1?.sales_executive_id}
            helperText={errors?.step_1?.sales_executive_id}
            handleChange={handleChange}
            value={params.step_1.sales_executive_id}
            label='Assign Sales Executive'
            name='sales_executive_id'
          />
        </div>
      </div>

      <br />

      {/* NAavigation Buttons */}
      <div className='flex justify-between '>
        <div></div>
        <div className='flex w-full gap-2  justify-between '>
          <CustomButton
            disabled={disableButton.customer}
            borderRadius='0.5rem'
            onClick={(e) => {
              e.preventDefault()
              onCancel('warning', true)
            }}
            // width='w-44'
            variant='outlined'
            size='large'
          >
            Cancel
          </CustomButton>

          <CustomButton
            disabled={disableButton.customer}
            borderRadius='0.5rem'
            onClick={SaveCompanyInfo}
            // width='w-44'
            variant='contained'
            size='large'
          >
            {id ? 'Update Details' : 'Save and Next'}
          </CustomButton>
        </div>
      </div>
    </form>
  )
}

export default CompanyInfo
