import { useState, useEffect } from 'react';
import { Input } from '../../../common/input/Input';
import { useSelector, useDispatch } from 'react-redux';
import { SelectInput } from '../../../common/input/Select';
import CustomButton from '../../../common/Button';
import HeadingTab from '../../../common/HeadingTab/HeadingTab';
import FileUpload from '../../../common/FileUpload';
import { getStateList } from '../../../../features/dropdowns/dropdownSlice';
import TextArea from '../../../common/input/TextArea';
import axiosInstance from '../../../../utils/axios';

interface Props {
  params: any
  handleChange: any
  SaveSupplier: any
  errors: any
  onCancel?: any
  supplierIdEdit: any
  buttonDisable: boolean,
  removeFile: any,
}

const SupplierInfo: React.FC<Props> = ({
  handleChange,
  params,
  SaveSupplier,
  errors,
  onCancel,
  supplierIdEdit,
  buttonDisable,
  removeFile
}) => {
  const { states } = useSelector((state: any) => state.dropdown);
  const [supplierTypedropdown, setsupplierTypedropdown] = useState([])
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getStateList());
    fetchSupplierTypeDropdown();
  }, []);

  const fetchSupplierTypeDropdown = () => {
    axiosInstance.get(`/admin/supplier/type/dropdown`).then((res) => {
      console.log(res?.data?.data);
      setsupplierTypedropdown(res?.data?.data)
    }).catch((err) => {

    })
  }

  return (
    <form>
      {/* Supplier Details */}
      <div>
        <HeadingTab title="Supplier Info" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-[24px]">
          <div className="flex flex-col gap-[24px]">
            <Input
              rows={1}
              width="w-full"
              error={errors?.step_1?.name}
              helperText={errors?.step_1?.name}
              handleChange={handleChange}
              value={params.step_1.name}
              label="Supplier Name"
              name="name"
            />

            <TextArea
              placeholder="Address"
              value={params?.step_1?.address}
              name="address"
              rows={5}
              error={errors?.step_1?.address}
              helperText={errors?.step_1?.address}
              handleChange={handleChange}
            />
            <Input
              rows={1}
              width="w-full"
              error={errors?.step_1?.city}
              helperText={errors?.step_1?.city}
              handleChange={handleChange}
              value={params.step_1.city}
              label="City"
              name="city"
            />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-[24px]">
              <Input
                rows={1}
                width="w-full"
                error={errors?.step_1?.pincode}
                helperText={errors?.step_1?.pincode?.replace('characters', 'numbers')}
                handleChange={handleChange}
                value={params.step_1.pincode}
                label="Pincode"
                name="pincode"
              />
              <SelectInput
                required
                options={states}
                error={!!errors?.step_1?.state}
                helperText={errors?.step_1?.state}
                handleChange={handleChange}
                value={params.step_1.state}
                label="State"
                name="state"
              />
            </div>
          </div>

          <div className="flex flex-col  gap-[24px]">
            <Input
              rows={1}
              width="w-full"
              error={errors?.step_1?.phone}
              helperText={errors?.step_1?.phone}
              handleChange={handleChange}
              value={params.step_1.phone}
              label="Phone Number"
              name="phone"
            />
            <SelectInput
              required
              options={supplierTypedropdown}
              error={!!errors?.step_1?.type}
              helperText={errors?.step_1?.type}
              handleChange={handleChange}
              value={params.step_1.type}
              label="Supplier Type"
              name="type"
            />

            <Input
              rows={1}
              width="w-full"
              readOnly={supplierIdEdit}
              error={errors?.step_1?.email}
              helperText={errors?.step_1?.email}
              handleChange={handleChange}
              value={params.step_1.email}
              label="Email ID"
              name="email"
            />

            <Input
              rows={1}
              width="w-full"
              error={errors?.step_1?.location}
              helperText={errors?.step_1?.location}
              handleChange={handleChange}
              value={params.step_1.location}
              label="Location Link"
              name="location"
            />

            <div className="h-20 flex flex-col gap-2 mb-4">
              <p>Image</p>
              <FileUpload
                filename="image"
                styleType="md"
                setImage={handleChange}
                acceptMimeTypes={['image/png', 'image/jpeg']}
                title="Drag and Drop jpg,png here"
                label="File Format:jpg,png"
                id="image"
                maxSize={5}
                error={errors?.step_1?.image}
                imageUrl={params?.step_1?.image}
                removeImage={() => removeFile('image')}

              />
              {errors?.step_1?.image && (
                <p className="ml-4 text-errortext text-xs">{`*${errors?.step_1?.image}`}</p>
              )}
            </div>
          </div>
        </div>
      </div>

      <br />

      {/* Bank Details */}
      <div>
        <HeadingTab title="Bank Account Details" />
        <div className="grid grid-cols-1 lg:grid-cols-2 mt-[24px] gap-[24px]">
          <div className="flex flex-col gap-[24px]">
            <Input
              rows={1}
              width="w-full"
              disabled={false}
              readOnly={false}
              error={errors?.step_1?.account_number}
              handleChange={handleChange}
              helperText={errors?.step_1?.account_number}
              value={params.step_1.account_number}
              label="Account Number"
              name="account_number"
            />
            <Input
              rows={1}
              width="w-full"
              disabled={false}
              readOnly={false}
              error={errors?.step_1?.account_name}
              handleChange={handleChange}
              helperText={errors?.step_1?.account_name}
              value={params.step_1.account_name}
              label="Account Name"
              name="account_name"
            />
            <Input
              rows={1}
              width="w-full"
              disabled={false}
              readOnly={false}
              error={errors?.step_1?.bank_name}
              handleChange={handleChange}
              helperText={errors?.step_1?.bank_name}
              value={params.step_1.bank_name}
              label="Bank Name"
              name="bank_name"
            />
            <Input
              rows={1}
              width="w-full"
              disabled={false}
              readOnly={false}
              error={errors?.step_1?.ifsc_code}
              handleChange={handleChange}
              helperText={errors?.step_1?.ifsc_code}
              value={params.step_1.ifsc_code}
              label="IFSC Code"
              name="ifsc_code"
            />
          </div>
          <div className="h-20 flex flex-col gap-[24px]">
            <p>Cancelled Cheque</p>
            <FileUpload
              filename="cancelled_cheque"
              styleType="md"
              setImage={handleChange}
              acceptMimeTypes={['application/pdf', 'image/png', 'image/jpeg']}
              title="Drag and Drop PDF here"
              label="File Format:PDF Files"
              id="cancelled_cheque"
              maxSize={5}
              error={errors?.step_1?.cancelled_cheque}
              imageUrl={params?.step_1?.cancelled_cheque}
              removeImage={() => removeFile('cancelled_cheque')}

            />
            {errors?.step_1?.cancelled_cheque && (
              <p className="ml-4 text-errortext text-xs">{`*${errors?.step_1?.cancelled_cheque}`}</p>
            )}
          </div>
        </div>
      </div>

      <br />

      {/* GST Details */}
      <div className="mt-6">
        <HeadingTab title="GST Details" />
        <div className="grid grid-cols-1 lg:grid-cols-2  gap-6">
          <Input
            rows={1}
            width="w-full"
            error={errors?.step_1?.gst}
            helperText={errors?.step_1?.gst}
            handleChange={handleChange}
            value={params.step_1.gst}
            label="GST Number"
            name="gst"
          />

          <div className="flex flex-col gap-2">
            <p>GST Certificate</p>
            <FileUpload
              filename="gst_certificate"
              styleType="md"
              setImage={handleChange}
              acceptMimeTypes={['application/pdf', 'image/png', 'image/jpeg']}
              title="Drag and Drop PDF here"
              label="File Format:PDF Files"
              id="gst_certificate"
              maxSize={5}
              error={errors?.step_1?.gst_certificate}
              imageUrl={params?.step_1?.gst_certificate}
              removeImage={() => removeFile('gst_certificate')}
            />
            {errors?.step_1?.gst_certificate && (
              <p className="ml-4 text-errortext text-xs">{`*${errors?.step_1?.gst_certificate}`}</p>
            )}
          </div>
        </div>
      </div>

      <br />

      {/* Navigation Buttons */}
      <div className="flex items-center justify-center lg:justify-end mt-20 lg:mt-10">
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
              onClick={SaveSupplier}
              disabled={buttonDisable}
              // width="w-[307px]"
              width="w-full"
              variant="contained"
              size="large"
              borderRadius="0.5rem"
            >
              {supplierIdEdit && supplierIdEdit.length > 0
                ? 'Update'
                : 'Save and Next'}
            </CustomButton>
          </div>
        </div>
      </div>
    </form>
  );
};

export default SupplierInfo;
