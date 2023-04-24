import { useEffect, useState } from 'react'
import { Input } from '../../../common/input/Input'
import { SelectInput } from '../../../common/input/Select'
import CustomButton from '../../../common/Button'
import HeadingTab from '../../../common/HeadingTab/HeadingTab'
import CustomCheckbox from '../../../common/input/Checkbox'
import axiosInstance from '../../../../utils/axios'
import { getpocDropdown } from '../../../../features/dropdowns/dropdownSlice'
import { useSelector, useDispatch } from 'react-redux'
interface Props {
  params?: any
  handleChange?: any
  SaveDeliveryDetails?: any
  errors?: any
  customerId?: any
  onCancel?: any
  handleBack: any
  handleStep: any
  disableButton: any
  setDisableButton: any
}

const DeliveryDetails: React.FC<Props> = ({
  handleChange,
  params,
  SaveDeliveryDetails,
  errors,
  customerId,
  onCancel,
  handleBack,
  handleStep,
  disableButton,
  setDisableButton,
}) => {
  const dispatch = useDispatch()
  const { states, pocDropdown } = useSelector((state: any) => state.dropdown)
  console.log('pocDropdown:', pocDropdown)
  const [pocList, setNetdues] = useState([])

  console.log('customerId:', customerId)

  return (
    <div>
      <HeadingTab title='Location Details' />
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-[24px]'>
        <Input
          rows={1}
          width='w-full'
          error={errors?.step_3?.address_1}
          value={params?.step_3?.address_1}
          handleChange={handleChange}
          helperText={errors?.step_3?.address_1}
          label='Address Line 1'
          name='address_1'
        />
        <SelectInput
          // width="100%"
          required
          options={[{ name: 'Home' }, { name: 'Work' }, { name: 'Company' }, { name: 'Other' }]}
          // options={addressTypeList}
          error={errors?.step_3?.address_type}
          helperText={errors?.step_3?.address_type}
          handleChange={handleChange}
          value={params.step_3.address_type}
          label='Addtess Type'
          name='address_type'
        />

        <Input
          rows={1}
          width='w-full'
          error={errors?.step_3?.address_2}
          value={params.step_3.address_2}
          handleChange={handleChange}
          helperText={errors?.step_3?.address_2}
          label='Address Line 2'
          name='address_2'
        />
        <Input
          rows={1}
          width='w-full'
          error={errors?.step_3?.city}
          value={params.step_3.city}
          handleChange={handleChange}
          helperText={errors?.step_3?.city}
          label='City'
          name='city'
        />
        <Input
          rows={1}
          width='w-full'
          error={errors?.step_3?.pincode}
          value={params.step_3.pincode}
          handleChange={handleChange}
          helperText={errors?.step_3?.pincode}
          label='Pin'
          name='pincode'
        />

        <SelectInput
          // width="100%"
          required
          options={states}
          error={errors?.step_3?.state}
          helperText={errors?.step_3?.state}
          handleChange={handleChange}
          value={params.step_3.state}
          label='State'
          name='state'
        />

        <Input
          rows={1}
          width='w-full'
          error={errors?.step_3?.phone}
          value={params.step_3.phone}
          handleChange={handleChange}
          helperText={errors?.step_3?.phone}
          label='Location Contact Number'
          name='phone'
        />
        <Input
          rows={1}
          width='w-full'
          error={errors?.step_3?.landmark}
          value={params.step_3.landmark}
          handleChange={handleChange}
          helperText={errors?.step_3?.landmark}
          label='Land Mark'
          name='landmark'
        />
        <Input
          rows={1}
          width='w-full'
          error={errors?.step_3?.location}
          value={params.step_3.location}
          handleChange={handleChange}
          helperText={errors?.step_3?.location}
          label='Add your location Link Here (Example: http://maps.google.com)'
          name='location'
        />

        <SelectInput
          // width="100%"
          required
          options={pocDropdown}
          error={errors?.step_3?.customer_poc_id}
          helperText={errors?.step_3?.customer_poc_id}
          handleChange={handleChange}
          value={params.step_3.customer_poc_id}
          label='Select POC'
          name='customer_poc_id'
        />
      </div>

      <br />

      {/* Location wise Price Diffetentiation */}
      <div>
        <HeadingTab title='Location wise Price Diffetentiation' />

        <CustomCheckbox
          handleCheck={handleChange}
          ischecked={params.step_3.is_fuel_price_checked}
          color='text-yellow'
          name='is_fuel_price_checked'
          Label='Increase from Standard Fuel Price (Per Liter)'
        />
        <br />
        {params.step_3.is_fuel_price_checked && (
          <Input
            rows={1}
            width='sm:w-1/2'
            error={errors?.step_3?.fuel_price}
            value={params.step_3.fuel_price}
            handleChange={handleChange}
            helperText={errors?.step_3?.fuel_price}
            label='Enter the Value'
            name='fuel_price'
          />
        )}
      </div>

      {/* NAavigation Buttons */}
      <br className='' />
      <div className='mt-4 sm:mt-0 grid sm:grid-cols-2 grid-cols-1 justify-center gap-2 sm:gap-6 '>
        <div className=' hidden sm:flex sm:justify-start justify-center'>
          <CustomButton
            borderRadius='8px'
            width='w-44'
            disabled={disableButton.delivery}
            onClick={() => {
              handleStep(2)
              handleBack()
              setDisableButton({ ...disableButton, poc: false })
            }}
            variant='outlined'
            size='large'
          >
            Go Back
          </CustomButton>
        </div>

        <div className=' gap-4 flex justify-between sm:justify-end    '>
          <CustomButton
            disabled={disableButton.delivery}
            borderRadius='8px'
            onClick={(e) => {
              e.preventDefault()
              onCancel('warning', true)
            }}
            width='w-44'
            variant='outlined'
            size='large'
          >
            Cancel
          </CustomButton>

          <CustomButton
            disabled={disableButton.delivery}
            borderRadius='8px'
            onClick={SaveDeliveryDetails}
            // width="w-[307px]"
            width='w-44'
            variant='contained'
            size='large'
          >
            Submit Details
          </CustomButton>
        </div>

        <div className='sm:hidden flex sm:justify-start justify-center'>
          <CustomButton
            borderRadius='8px'
            width='w-44'
            disabled={disableButton.delivery}
            onClick={() => {
              handleStep(2)
              handleBack()
              setDisableButton({ ...disableButton, poc: false })
            }}
            variant='outlined'
            size='large'
          >
            Go Back
          </CustomButton>
        </div>
      </div>
    </div>
  )
}

export default DeliveryDetails
