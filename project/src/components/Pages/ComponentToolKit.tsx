import React, { useState } from 'react'
// import { useSelector } from 'react-redux';
import FileUpload from '../common/FileUpload'
import { DateRangePicker } from '../common/input/DateRangePicker'
import { Input } from '../common/input/Input'
import CustomCheckbox from '../common/input/Checkbox'
import TextArea from '../common/input/TextArea'
import Toggle from '../common/input/Toggle'
import { SelectInput } from '../common/input/Select'
import { MultiSelectInput } from '../common/input/MultiSelect'
import { SelectChangeEvent } from '@mui/material/Select'
import { AutoCompleteSelect } from '../common/input/AutoCompleteSelect'
// import {InputAdornments} from './leads/LeadListing/SearchText';
// import TimeandDatePicker from '../common/DateTimePicker';

const ComponentToolKit = () => {
  // const { user } = useSelector((state: any) => state.auth);
  const [startDate, setStartDate] = useState()
  const [endDate, setEndDate] = useState(null)
  const email: any = ''

  const [multiSelect, setmultiSelect] = React.useState<string[]>([])
  console.log('multiSelect:', multiSelect)

  const handleMultiSelectChange = (event: SelectChangeEvent<typeof multiSelect>) => {
    const {
      target: { value },
    } = event
    setmultiSelect(typeof value === 'string' ? value.split(',') : value)
  }

  const setImage = () => {}
  const handleChange = () => {}
  const onChange = (dates: any) => {
    const [start, end] = dates
    setStartDate(start)
    setEndDate(end)
  }
  const options = [
    { id: 1, name: 'value1', label: 'test' },
    { id: 2, name: 'value2', label: 'test2' },
    { id: 3, name: 'value3', label: 'test3' },
  ]

  // const HEADERS = [{
  //   key: 'id',
  //   header: 'User Id',
  // },
  // {
  //   key: 'name',
  //   header: 'Name',
  // },
  // {
  //   key: 'phone',
  //   header: 'Phone',
  // },
  // {
  //   key: 'role',
  //   header: 'Role',
  // },
  // {
  //   key: 'access',
  //   header: 'Access',
  // },
  // {
  //   key: 'status',
  //   header: 'Status',
  // },
  // {
  //   key: 'action',
  //   header: 'Action',
  // },
  // ];

  // const getRows = (() => {
  //   const USERS:any = [{
  //     id: '123455',
  //     name: 'User1',
  //     phone: '+919876543212',
  //     role: 'Admin',
  //     status: true,
  //   },
  //   {
  //     id: '123456',
  //     name: 'User2',
  //     phone: '+919876543212',
  //     role: 'Driver',
  //     status: true,
  //   },
  //   {
  //     id: '123457',
  //     name: 'User3',
  //     phone: '+919876543212',
  //     role: 'Admin',
  //     status: true,
  //   },
  //   ];
  //   const users = USERS.map((x:any) => {
  //     Object.keys(x).map(key => HEADERS.map(y => {
  //       switch (y.key) {
  //         case 'access':
  //           x[key].value = <span><Toggle name="status" ischecked={x[y.key]} handleCheck={handleChange} /></span>;
  //           break;
  //         case 'action':
  //           x[key].value = <span>{x[y.key]}</span>;
  //           break;
  //         case 'status':
  //           x[key].value = <span>{x[y.key]}</span>;
  //           break;
  //         default:
  //           x[key].value = <span>{x[y.key]}</span>;
  //           break;
  //       }
  //     }));
  //     return x;
  //   });

  //   console.log(users);
  // });

  return (
    <div className='container mx-auto px-2'>
      <h1 className='text-lg py-2 text-white'>Common Components </h1>

      <div className='grid  gap-4'>
        <FileUpload
          styleType='lg'
          setImage={setImage}
          acceptMimeTypes={['image/png', 'image/jpeg']}
          title='Drag and Drop Image here'
          label='File Format:.png,.jpg'
          id='file1'
          maxSize={5}
          filename=''
        />
        <FileUpload
          styleType='md'
          setImage={setImage}
          acceptMimeTypes={['image/png', 'image/jpeg']}
          title='Drag and Drop PDF here'
          label='File Format:.png,.jpg'
          id='file2'
          maxSize={5}
          filename=''
        />
        <FileUpload
          styleType='md'
          setImage={setImage}
          acceptMimeTypes={['application/pdf']}
          title='Drag and Drop PDF here'
          label='File Format:.pdf'
          id='file3'
          maxSize={5}
          filename=''
        />
      </div>

      <h2 className='mt-4 underline'>Input Compoennts</h2>
      <div className='grid grid-cols-3 gap-4 pt-5 pb-10'>
        <Input
          rows={1}
          width='w-full'
          disabled={false}
          readOnly={false}
          label='Username/ Email Id'
          name='email'
          value={email}
          handleChange={handleChange}
          type='text'
        />

        <DateRangePicker startDate={startDate} endDate={endDate} onChange={onChange} />

        <div className='flex space-x-2'>
          <CustomCheckbox
            handleCheck={handleChange}
            Label='Remember me'
            ischecked={false}
            name='test'
            color='text-yellow'
            // labelcolor=""
          />
          <Toggle name='status' ischecked defaultChecked={false} handleCheck={handleChange} />
        </div>

        <TextArea
          placeholder='Enter notes here'
          id='123456'
          name='text_area'
          rows={5}
          className='col-span-3'
        />

        <SelectInput options={options} label='Select data' />

        <MultiSelectInput
          options={options}
          label='Multi Select data'
          value={multiSelect}
          handleChange={handleMultiSelectChange}
        />

        <AutoCompleteSelect options={options} label='Auto complete' />
      </div>
      {/* <div className="w-full"><InputAdornments handleChange={handleChange} label="Search" name="searchText" value="h" width="w-full" /></div> */}
    </div>
  )
}

export default ComponentToolKit
