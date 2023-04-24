import { Input } from '../../../common/input/Input'
import CustomButton from '../../../common/Button'
import HeadingTab from '../../../common/HeadingTab/HeadingTab'
import FileUpload from '../../../common/FileUpload'

interface Props {
  params?: any
  handleChange?: any
  SavePocDetails?: any
  errors?: any
  onCancel?: any
  handleStep: any
  handleBack: any
  disableButton: any
  setDisableButton: any
  removeFile: any
}

const PocDetails: React.FC<Props> = ({
  handleChange,
  params,
  SavePocDetails,
  errors,
  onCancel,
  handleStep,
  handleBack,
  disableButton,
  setDisableButton,
  removeFile,
}) => {
  return (
    // console.log('params', params?.step_2?);
    // console.log('errors', errors);
    <form>
      <div>
        <HeadingTab title='POC Details' />

        <div className='grid grid-cols-1 lg:grid-cols-2 mt-[24px] gap-[24px]'>
          <div className='flex flex-col gap-[24px]'>
            <Input
              rows={1}
              width='w-full'
              error={errors?.step_2?.poc_name}
              value={params?.step_2?.poc_name}
              handleChange={handleChange}
              helperText={errors?.step_2?.poc_name}
              label='POC Name'
              name='poc_name'
            />

            {/* <Input
            rows={1}
            width='w-full'
            // error={formErrors.name}
            // helperText={formErrors.name}
            handleChange={handleChange}
            value={params.customer_id}
            label='Customer ID'
            name='customer_id'
          /> */}
            <Input
              rows={1}
              width='w-full'
              disabled={false}
              readOnly={false}
              error={errors?.step_2?.designation}
              value={params?.step_2?.designation}
              handleChange={handleChange}
              helperText={errors?.step_2?.designation}
              label='Designation'
              name='designation'
            />
            <Input
              rows={1}
              width='w-full'
              disabled={false}
              readOnly={false}
              error={errors?.step_2?.phone}
              value={params?.step_2?.phone}
              handleChange={handleChange}
              helperText={errors?.step_2?.phone}
              label='Contact Number'
              name='phone'
            />
            <Input
              rows={1}
              width='w-full'
              disabled={false}
              readOnly={false}
              error={errors?.step_2?.email}
              value={params?.step_2?.email}
              handleChange={handleChange}
              helperText={errors?.step_2?.email}
              label='Email ID'
              name='email'
            />
          </div>

          <div className='h-20 flex flex-col gap-2'>
            <p>Poc Image</p>
            <FileUpload
              styleType={window.innerWidth < 1024 ? 'md' : 'lg'}
              setImage={handleChange}
              acceptMimeTypes={['image/jpeg']}
              title='Drag and Drop Image here'
              label='File Format:.jpeg/.png'
              id='poc_image'
              filename='image'
              maxSize={5}
              error={errors?.step_2?.image}
              removeImage={() => removeFile('image')}
            />
            {errors?.step_2?.image && (
              <p className='ml-4 text-errortext text-xs'>{`*${errors?.step_2?.image}`}</p>
            )}
          </div>
        </div>
      </div>

      {/* NAavigation Buttons */}
      <br className='' />
      <div className='mt-8 grid sm:grid-cols-2 grid-cols-1 justify-center gap-2 sm:gap-6 '>
        <div className=' hidden sm:flex sm:justify-start justify-center'>
          <CustomButton
            disabled={disableButton.poc}
            width='w-44'
            borderRadius='0.5rem'
            onClick={() => {
              handleStep(1)
              handleBack()
              setDisableButton({ ...disableButton, customer: false })
            }}
            variant='outlined'
            size='large'
          >
            Go Back
          </CustomButton>
        </div>

        <div className=' gap-4 flex justify-between sm:justify-end    '>
          <CustomButton
            disabled={disableButton.poc}
            borderRadius='0.5rem'
            width='w-44'
            onClick={(e) => {
              e.preventDefault()
              onCancel('warning', true)
            }}
            variant='outlined'
            size='large'
          >
            Cancel
          </CustomButton>

          <CustomButton
            disabled={disableButton.poc}
            borderRadius='0.5rem'
            onClick={SavePocDetails}
            variant='contained'
            size='large'
            width='w-44'
          >
            Save and Next
          </CustomButton>
        </div>

        <div className='sm:hidden flex sm:justify-start justify-center'>
          <CustomButton
            disabled={disableButton.poc}
            borderRadius='0.5rem'
            width='w-44'
            onClick={() => {
              handleStep(1)
              handleBack()
              setDisableButton({ ...disableButton, customer: false })
            }}
            variant='outlined'
            size='large'
          >
            Go Back
          </CustomButton>
        </div>
      </div>
    </form>
  )
}
export default PocDetails
