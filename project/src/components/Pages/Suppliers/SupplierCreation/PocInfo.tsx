import { Input } from '../../../common/input/Input';
import CustomButton from '../../../common/Button';
import HeadingTab from '../../../common/HeadingTab/HeadingTab';
import FileUpload from '../../../common/FileUpload';

interface Props {
  handleStep?: any
  params?: any
  handleChange?: any
  SavePocDetails?: any
  errors?: any
  onCancel?: any
  handleBack: any
  buttonDisable: any,
  handleImage: any,
  removeImage: any,

}

const PocInfo: React.FC<Props> = ({
  handleStep,
  handleChange,
  params,
  SavePocDetails,
  errors,
  onCancel,
  handleBack,
  buttonDisable,
  handleImage,
  removeImage
}) => (
  <form>
    <div>
      <HeadingTab title="POC Details" />

      <div className="grid grid-cols-1 lg:grid-cols-2 mt-6 gap-6">
        <div className="flex flex-col gap-6">
          <Input
            rows={1}
            width="w-full"
            error={errors?.step_2?.poc_name}
            value={params?.step_2?.poc_name}
            handleChange={handleChange}
            helperText={errors?.step_2?.poc_name}
            label="POC Name"
            name="poc_name"
          />

          <Input
            rows={1}
            width="w-full"
            disabled={false}
            readOnly={false}
            error={errors?.step_2?.designation}
            value={params?.step_2?.designation}
            handleChange={handleChange}
            helperText={errors?.step_2?.designation}
            label="Designation"
            name="designation"
          />
          <Input
            rows={1}
            width="w-full"
            disabled={false}
            readOnly={false}
            error={errors?.step_2?.contact}
            value={params?.step_2?.contact}
            handleChange={handleChange}
            helperText={errors?.step_2?.contact}
            label="Contact Number"
            name="contact"
          />
          <Input
            rows={1}
            width="w-full"
            disabled={false}
            readOnly={false}
            error={errors?.step_2?.email}
            value={params?.step_2?.email}
            handleChange={handleChange}
            helperText={errors?.step_2?.email}
            label="Email ID"
            name="email"
          />
        </div>
        <div className="hidden lg:block">
          <div className="h-20 flex flex-col gap-2">
            <p>Image</p>
            <FileUpload
              styleType="lg"
              setImage={handleImage}
              acceptMimeTypes={['image/jpeg']}
              title="Drag and Drop Image here"
              label="File Format:.jpeg/.png"
              id="image"
              filename="image"
              maxSize={5}
              error={errors?.step_2?.image}
            />
            {errors?.step_2?.image && (
              <p className="ml-4 text-errortext text-xs">{`*${errors?.step_2?.image}`}</p>
            )}
          </div>
        </div>

        <div className="block lg:hidden">
          <div className="h-20 flex flex-col gap-2">
            <p>Image</p>
            <FileUpload
              styleType="md"
              setImage={handleImage}
              acceptMimeTypes={['image/jpeg']}
              title="Drag and Drop Image here"
              label="File Format:.jpeg/.png"
              id="image"
              filename="image"
              maxSize={5}
              error={errors?.step_2?.image}
              removeImage={removeImage}
            />
            {errors?.step_2?.image && (
              <p className="ml-4 text-errortext text-xs">{`*${errors?.step_2?.image}`}</p>
            )}
          </div>
        </div>
      </div>
    </div>

    {/* Navigation Buttons */}
    <div className="flex items-center justify-center lg:justify-between mt-20 lg:mt-10">
      <div className="hidden lg:block">
        <CustomButton
          onClick={() => {
            handleStep(1);
            handleBack();
          }}
          variant="outlined"
          size="large"
          borderRadius="0.5rem"
        >
          Go Back
        </CustomButton>
      </div>

      <div className="flex gap-8">
        <div className=" w-[150px] lg:w-[106px]">
          <CustomButton
            onClick={(e) => {
              e.preventDefault();
              onCancel('warning', true);
            }}
            width="w-full"
            variant="outlined"
            size="large"
            borderRadius="0.5rem"
            disabled={buttonDisable}
          >
            Cancel
          </CustomButton>
        </div>
        <div className="w-[150px] lg:w-[307px]">
          <CustomButton
            onClick={SavePocDetails}
            width="w-full"
            variant="contained"
            size="large"
            borderRadius="0.5rem"
            disabled={buttonDisable}
          >
            Submit Details
          </CustomButton>
        </div>
      </div>
    </div>
  </form>
);
export default PocInfo;
