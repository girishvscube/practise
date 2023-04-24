import { Input } from '../../../common/input/Input';
import CustomButton from '../../../common/Button';
import Plus from '../../../../assets/icons/filledIcons/Plus.svg';

interface CommonProps {
  title: any,
  sub_title: any,
  handleChange: any,
  params: any,
  handleSubmit: any,
  name: any,
  loading?:any,
}
const HeaderCommon = ({ title, sub_title, handleChange, params, handleSubmit, name,loading }: CommonProps) => (
  <div>
    <div className="flex flex-col">
      <p className="subheading">{title}</p>
      <p className="text-xs font-nunitoRegular">{sub_title}</p>
    </div>
    <div className="mt-4 flex gap-4 filters">
      <Input
        rows={1}
        width="w-full"
        disabled={false}
        readOnly={false}
        // error={error}
        value={params?.name}
        handleChange={handleChange}
        // helperText={errorText}
        label="Enter the title"
        name={name}
      />
      <div className="mt-1 w-full">
        <CustomButton
          onClick={handleSubmit}
          width="w-fit"
          variant="outlined"
          size="large"
          borderRadius="8px"
          icon={<img src={Plus} alt="" />}
          disabled={params.name ? false : true || loading}
        >
          Add to List
        </CustomButton>
      </div>

    </div>
  </div>
);

export default HeaderCommon;
