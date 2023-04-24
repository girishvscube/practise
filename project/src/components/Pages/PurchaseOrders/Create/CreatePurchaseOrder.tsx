import { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import moment from 'moment'
import { fetchPoById } from '../../../../features/PurchaseOrders/purchaseOrderSlice'
import { uuid } from './../../../../utils/helpers';
import { SelectInput } from '../../../common/input/Select'
import { Input } from '../../../common/input/Input'
import CustomButton from '../../../common/Button'
import HeadingTab from '../../../common/HeadingTab/HeadingTab'
import { TimeandDatePicker } from '../../../common/DateTimePicker'
import axiosInstance from './../../../../utils/axios'
import { showToastMessage } from '../../../../utils/helpers'
import { decryptData } from '../../../../utils/encryption'

interface Props {
  params: any
  Podata: any
  handleChange: any
  PreviewPO: any
  errors: any
  onCancel?: any
  handleSaveExit: any
  setParams: any
  updateParams: any
  PoId: any
  edit: any
  suppliersList: any
  setValue: any
  value: any
}

const CreatePurchaseOrder: React.FC<Props> = ({
  handleChange,
  params,
  Podata,
  PreviewPO,
  errors,
  onCancel,
  handleSaveExit,
  setParams,
  updateParams,
  PoId,
  edit,
  suppliersList,
  setValue,
  value,
}) => {
  const dispatch = useDispatch()
  const { bowserdropdown } = useSelector((state: any) => state.dropdown)
  const { PoById } = useSelector((state: any) => state.purchaseOrder)

  useEffect(() => {
    PoId && dispatch(fetchPoById(PoId))
  }, [PoId])

  const handleDate = (newValue: any) => {
    setValue(newValue)
    const newDate = moment(new Date(newValue)).format('YYYY-MM-DD HH:mm:ss')
    updateParams([{ name: 'purchase_date', value: newDate }])
  }

  const selectedsupplier = [
    { name: 'Supplier Name:', value: Podata?.supplier_info?.name },
    { name: 'Phone Number:', value: Podata?.supplier_info?.phone },
    { name: 'Email ID:', value: Podata?.supplier_info?.email },
    { name: 'Supplier ID:', value: Podata?.supplier_info?.id },
    { name: 'Address', value: Podata?.supplier_info?.address },
  ]

  const selectedbowser = [
    { name: 'Bowser Name:', value: Podata?.bowser_info?.name ?? '--' },
    { name: 'Registration Number:', value: Podata?.bowser_info?.registration_no ?? '--' },
    { name: ' Bowser Capacity:', value: Podata?.bowser_info?.fuel_capacity ?? '--' },
    { name: ' Fuel Left Over:', value: Podata?.bowser_info?.fuel_left ?? '--' },
    { name: 'Driver Name:', value: Podata?.bowser_info?.driver?.name ?? '--' },
    { name: 'Last Trip Booked time/ Date:', value: Podata?.bowser_info?.last_trip ?? '--' },
    { name: ' Parking Station: ', value: Podata?.bowser_info?.parkingstation?.name ?? '--' },
  ]

  return (
    <div className='divstyles bg-lightbg'>
      <div className='relative '>
        <HeadingTab title='Select Supplier' />
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-[24px]'>
          <div>
            <SelectInput
              width='100%'
              options={suppliersList}
              error={errors?.supplier_id}
              helperText={errors?.supplier_id}
              handleChange={handleChange}
              value={params?.step_1?.supplier_id}
              label='Select Supplier'
              name='supplier_id'
            />
          </div>

          {Podata?.supplier_info ? (
            <div className='po-selection-info p-4 '>
              <label>Selected Supplier Details</label>
              {selectedsupplier &&
                selectedsupplier.map((item) => {
                  return (
                    <div key={uuid()} className='flex gap-y-4'>
                      <p className=' text-xs text-textgray pt-1 w-44 '>{item?.name}</p>
                      <p className='text-sm text-white  text-right'>{item?.value}</p>
                    </div>
                  )
                })}
            </div>
          ) : (
            <></>
          )}
        </div>
      </div>

      <br />

      <div>
        <HeadingTab title='Bowser details' />
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-[24px]'>
          <div>
            <SelectInput
              width='100%'
              options={
                edit
                  ? [...bowserdropdown, ...[{ id: PoById?.bowser_id, name: PoById?.bowser?.name }]]
                  : [...bowserdropdown]
              }
              error={errors?.bowser_id}
              helperText={errors?.bowser_id}
              handleChange={handleChange}
              value={params?.step_1?.bowser_id}
              label='Select Bowser'
              name='bowser_id'
            />
          </div>

          {Podata?.bowser_info ? (
            <div className='po-selection-info p-4'>
              <label>Selected Bowser Details</label>
              {selectedbowser &&
                selectedbowser.map((item) => {
                  return (
                    <div key={uuid()} className='flex gap-y-4'>
                      <p className=' text-xs text-textgray pt-1 w-44 '>{item?.name}</p>
                      <p className='text-sm text-white  text-right'>{item?.value}</p>
                    </div>
                  )
                })}
            </div>
          ) : (
            <></>
          )}
        </div>

        <br />
      </div>

      <br />

      <div>
        <HeadingTab title='Order  Details' />
        <div className='grid grid-cols-1 lg:grid-cols-2 mt-[24px] gap-[24px]'>
          <Input
            rows={1}
            width='w-full'
            value={params?.step_1?.fuel_qty}
            error={errors?.fuel_qty}
            helperText={errors?.fuel_qty}
            handleChange={handleChange}
            label='Purchase fuel quantity in litre'
            name='fuel_qty'
          />
          <TimeandDatePicker
            handleChange={handleDate}
            label='Select Purchase date'
            value={value}
            error={errors?.purchase_date}
          />
        </div>
      </div>

      <br />

      {/* NAavigation Buttons  for desktop */}
      <div className='flex justify-between'>
        <CustomButton
          borderRadius='0.5rem'
          onClick={(e) => {
            e.preventDefault()
            onCancel('warning', true)
          }}
          width='w-fit'
          variant='outlined'
          size='large'
        >
          Cancel
        </CustomButton>
        <CustomButton
          borderRadius='0.5rem'
          onClick={PreviewPO}
          width='w-fit'
          variant='contained'
          size='large'
        >
          Preview PO
        </CustomButton>
      </div>
    </div>
  )
}

export default CreatePurchaseOrder
