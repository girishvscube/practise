import FileUpload from '../../../common/FileUpload'
import CustomCheckbox from '../../../common/input/Checkbox'
import CommonDatepicker from '../../../common/input/Datepicker'

interface FormProps {
  handleChange: any
  params: any
  errors: any
  setParams: any
}

const DocumentsForm = ({ params, setParams, errors, handleChange }: FormProps) => {
  const onDateChange = (event, name) => {
    setParams({ ...params, [name]: event })
  }

  return (
    <div>
      <div className='h-[54px] bg-darkbg flex items-center pl-[20px] rounded-lg mb-[24px] mt-[34px]'>
        <p className='text-[18px] font-bold font-nunitoRegular'>Bowser Documents</p>
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-2 gap-[24px]'>
        <div className=''>
          <div className='grid grid-cols-6 gap-4'>
            <div className='col-start-1 col-end-3 flex items-center'>
              <p className=''>Registration PDF</p>
            </div>
            <div className='col-end-7 col-span-2  flex justify-center  flex justify-center'>
              <CustomCheckbox
                handleCheck={handleChange}
                ischecked={params.registration_validity_check}
                color='text-yellow'
                name='registration_validity_check'
                Label='Validity'
              />
            </div>
          </div>

          <FileUpload
            styleType='md'
            setImage={handleChange}
            acceptMimeTypes={['application/pdf']}
            title='Drag and Drop PDF here'
            label='File Format:.pdf'
            id='registration'
            maxSize={5}
            filename='registration'
            error={errors?.registration}
          />
        </div>
        {params.registration_validity_check ? (
          <div className='flex items-center'>
            <div className='w-full'>
              <CommonDatepicker
                label='Select Validity  Date'
                onChange={(e: any) => onDateChange(e, 'registration_validity')}
                value={params.registration_validity}
              />
            </div>
          </div>
        ) : (
          ''
        )}
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-2 gap-[24px] mt-[15px]'>
        <div className=''>
          <div className='grid grid-cols-6 gap-4'>
            <div className='col-start-1 col-end-3 flex items-center flex items-center'>
              <p className=''>Pollution Certificate</p>
            </div>
            <div className='col-end-7 col-span-2  flex justify-center  flex justify-center'>
              <CustomCheckbox
                handleCheck={handleChange}
                ischecked={params.pollution_cert_validity_check}
                color='text-yellow'
                name='pollution_cert_validity_check'
                Label='Validity'
              />
            </div>
          </div>

          <FileUpload
            styleType='md'
            setImage={handleChange}
            acceptMimeTypes={['application/pdf']}
            title='Drag and Drop PDF here'
            label='File Format:.pdf'
            id='pollution_cert'
            maxSize={5}
            filename='pollution_cert'
            error={errors?.pollution_cert}
          />
        </div>
        {params.pollution_cert_validity_check ? (
          <div className='flex items-center'>
            <div className='w-full'>
              <CommonDatepicker
                label='Select Validity  Date'
                onChange={(e) => onDateChange(e, 'pollution_cert_validity')}
                value={params.pollution_cert_validity}
              />
            </div>
          </div>
        ) : (
          ''
        )}
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-2 gap-[24px] mt-[15px]'>
        <div className=''>
          <div className='grid grid-cols-6 gap-4'>
            <div className='col-start-1 col-end-3 flex items-center flex items-center'>
              <p className=''>Vehicle Fitness</p>
            </div>
            <div className='col-end-7 col-span-2  flex justify-center'>
              <CustomCheckbox
                handleCheck={handleChange}
                ischecked={params.vehicle_fitness_validity_check}
                color='text-yellow'
                name='vehicle_fitness_validity_check'
                Label='Validity'
              />
            </div>
          </div>

          <FileUpload
            styleType='md'
            setImage={handleChange}
            acceptMimeTypes={['application/pdf']}
            title='Drag and Drop PDF here'
            label='File Format:.pdf'
            id='vehicle_fitness'
            maxSize={5}
            filename='vehicle_fitness'
            error={errors?.vehicle_fitness}
          />
        </div>
        {params.vehicle_fitness_validity_check ? (
          <div className='flex items-center'>
            <div className='w-full'>
              <CommonDatepicker
                label='Select Validity  Date'
                onChange={(e) => onDateChange(e, 'vehicle_fitness_validity')}
                value={params.vehicle_fitness_validity}
              />
            </div>
          </div>
        ) : (
          ''
        )}
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-2 gap-[24px] mt-[15px]'>
        <div className=''>
          <div className='grid grid-cols-6 gap-4'>
            <div className='col-start-1 col-end-3 flex items-center'>
              <p className=''>Heavy Vehicle PDF</p>
            </div>
            <div className='col-end-7 col-span-2  flex justify-center'>
              <CustomCheckbox
                handleCheck={handleChange}
                ischecked={params.heavy_vehicle_validity_check}
                color='text-yellow'
                name='heavy_vehicle_validity_check'
                Label='Validity'
              />
            </div>
          </div>

          <FileUpload
            styleType='md'
            setImage={handleChange}
            acceptMimeTypes={['application/pdf']}
            title='Drag and Drop PDF here'
            label='File Format:.pdf'
            id='heavy_vehicle'
            maxSize={5}
            filename='heavy_vehicle'
            error={errors?.heavy_vehicle}
          />
        </div>
        {params.heavy_vehicle_validity_check ? (
          <div className='flex items-center'>
            <div className='w-full'>
              <CommonDatepicker
                label='Select Validity  Date'
                onChange={(e) => onDateChange(e, 'heavy_vehicle_validity')}
                value={params.heavy_vehicle_validity}
              />
            </div>
          </div>
        ) : (
          ''
        )}
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-2 gap-[24px] mt-[15px]'>
        <div className=''>
          <div className='grid grid-cols-6 gap-4'>
            <div className='col-start-1 col-end-3 flex items-center'>
              <p className=''>Other Documents</p>
            </div>
            <div className='col-end-7 col-span-2  flex justify-center'>
              <CustomCheckbox
                handleCheck={handleChange}
                ischecked={params.other_doc_validity_check}
                color='text-yellow'
                name='other_doc_validity_check'
                Label='Validity'
              />
            </div>
          </div>

          <FileUpload
            styleType='md'
            setImage={handleChange}
            acceptMimeTypes={['application/pdf']}
            title='Drag and Drop PDF here'
            label='File Format:.pdf'
            id='other_doc'
            maxSize={5}
            filename='other_doc'
            error={errors?.other_doc}
          />
        </div>
      </div>
    </div>
  )
}

export default DocumentsForm
