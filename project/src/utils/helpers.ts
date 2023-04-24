import * as _ from 'lodash'
import moment from 'moment'
import { toast } from 'react-toastify'
import { makeStyles } from '@mui/styles'
import axiosInstance from './axios'

/* eslint-disable */
export const uuid = () => {
  let uuid = ''
  let i
  for (i = 0; i < 32; i += 1) {
    switch (i) {
      case 8:
      case 20:
        uuid += '-'
        uuid += (Math.random() * 16 || 0).toString(16)
        break
      case 12:
        uuid += '-'
        uuid += '4'
        break
      case 16:
        uuid += '-'
        uuid += (Math.random() * 4 || 8).toString(16)
        break
      default:
        uuid += (Math.random() * 16 || 0).toString(16)
    }
  }
  return uuid
}
/* eslint-enable */
export const capitalize = (string: string) => {
  if (!string) {
    return ''
  }

  return string.charAt(0).toUpperCase() + string.slice(1)
}

export const capitalizeUppertoLower = (string: string) => {
  if (!string) {
    return ''
  }

  return string.charAt(0).toUpperCase() + string.toLowerCase().slice(1)
}

export const getValueAsFloatWithNDecimalPlaces = (value: number, decimalPlaces: number) => {
  if (['0', 0].includes(value)) {
    return value
  }

  return Number(value).toFixed(decimalPlaces)
}

export const validateArray = (array: any[]) => {
  if (!array || !Array.isArray(array) || !array.length) {
    return []
  }

  return array
}

export const copyToClipboard = (value: any) => {
  navigator.clipboard.writeText(_.unescape(value))
}
/* eslint-disable */
export const CountItems = (data: any) => {
  let total = 0
  Object.values(data).forEach((val) => {
    if (val === null || val === undefined || val === '') {
      return true
    }
    total += 1
  })
  // console.log(total, 'tpta;')
  return total
}
/* eslint-enable */

export const defaultFiltersDropDown = [
  {
    id: 'ALL',
    name: 'All',
  },
  {
    id: '0',
    name: 'Today',
  },
  {
    id: '-1',
    name: 'Yesterday',
  },
  {
    id: '-7',
    name: 'Last 7 Days',
  },
  {
    id: '-30',
    name: 'Last 30 Days',
  },
  {
    id: 'TM',
    name: 'This Month',
  },
  {
    id: 'LM',
    name: 'Last Month',
  },
  {
    id: 'custom',
    name: 'Custom Date',
  },
]

export const dateRange = (type): any => {
  let range: any = []

  switch (type) {
    case '0':
      range = [
        moment().startOf('day').format('YYYY-MM-DD HH:mm:ss'),
        moment().endOf('day').format('YYYY-MM-DD HH:mm:ss'),
      ]
      break
    case '-1':
      range = [
        moment().subtract(1, 'days').startOf('day').format('YYYY-MM-DD HH:mm:ss'),
        moment().subtract(1, 'days').endOf('day').format('YYYY-MM-DD HH:mm:ss'),
      ]
      break
    case '-7':
      range = [
        moment().subtract(6, 'days').startOf('day').format('YYYY-MM-DD HH:mm:ss'),
        moment().endOf('day').format('YYYY-MM-DD HH:mm:ss'),
      ]
      break
    case '-30':
      range = [
        moment().subtract(29, 'days').startOf('day').format('YYYY-MM-DD HH:mm:ss'),
        moment().endOf('day').format('YYYY-MM-DD HH:mm:ss'),
      ]
      break
    case 'TM':
      range = [
        moment().startOf('month').format('YYYY-MM-DD HH:mm:ss'),
        moment().endOf('month').format('YYYY-MM-DD HH:mm:ss'),
      ]
      break
    case 'LM':
      range = [
        moment().subtract(1, 'month').startOf('month').format('YYYY-MM-DD HH:mm:ss'),
        moment().subtract(1, 'month').endOf('month').format('YYYY-MM-DD HH:mm:ss'),
      ]
      break
    default:
      range = []
  }
  return range
}

export const showToastMessage = (message: string, type: string) => {
  if (type === 'error') {
    toast.error(message, {
      position: toast.POSITION.TOP_RIGHT,
    })
  } else {
    toast.success(message, {
      position: toast.POSITION.TOP_RIGHT,
    })
  }
}

// export const useSelectStyles = makeStyles({
//     select: {
//         '& ul': {
//             backgroundColor: 'rgba(255, 255, 255, 0.1);',
//         },
//         '& li': {
//             backgroundColor: '#2F3344',
//         },
//     },
//     icon: {
//         fill: 'white',
//     },
//     root: {
//         '& .MuiOutlinedInput-input': {
//             color: '#FFFF',
//         },
//         '& .MuiInputLabel-root': {
//             color: '#6A6A78',
//         },
//         '& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline': {
//             borderColor: '#404050',
//             borderRadius: '8px',
//         },
//         '&:hover .MuiOutlinedInput-input': {
//             color: '#FFFF',
//         },
//         '&:hover .MuiInputLabel-root': {
//             color: '#6A6A78',
//         },
//         '&:hover .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline': {
//             borderColor: '#FFFF',
//         },
//         '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-input': {
//             color: '#FFFF',
//         },
//         '& .MuiInputLabel-root.Mui-focused': {
//             color: '#FFCD2C',
//         },
//         '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
//             borderColor: '#FFCD2C',
//         },
//     },
// })

export const useSelectStyles = makeStyles({
  error: {
    '& .MuiOutlinedInput-notchedOutline': {
      borderColor: 'red',
      borderRadius: '8px',
    },
  },
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

export const menuStyles = {
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
}

export function NumInWords(number: any) {
  const first = [
    '',
    'one ',
    'two ',
    'three ',
    'four ',
    'five ',
    'six ',
    'seven ',
    'eight ',
    'nine ',
    'ten ',
    'eleven ',
    'twelve ',
    'thirteen ',
    'fourteen ',
    'fifteen ',
    'sixteen ',
    'seventeen ',
    'eighteen ',
    'nineteen ',
  ]
  const tens = [
    '',
    '',
    'twenty',
    'thirty',
    'forty',
    'fifty',
    'sixty',
    'seventy',
    'eighty',
    'ninety',
  ]
  const mad = ['', 'thousand', 'million', 'billion', 'trillion']
  let word = ''

  for (let i = 0; i < mad.length; i++) {
    let tempNumber = number % (100 * Math.pow(1000, i))
    if (Math.floor(tempNumber / Math.pow(1000, i)) !== 0) {
      if (Math.floor(tempNumber / Math.pow(1000, i)) < 20) {
        word = first[Math.floor(tempNumber / Math.pow(1000, i))] + mad[i] + ' ' + word
      } else {
        word =
          tens[Math.floor(tempNumber / (10 * Math.pow(1000, i)))] +
          '-' +
          first[Math.floor(tempNumber / Math.pow(1000, i)) % 10] +
          mad[i] +
          ' ' +
          word
      }
    }

    tempNumber = number % Math.pow(1000, i + 1)
    if (Math.floor(tempNumber / (100 * Math.pow(1000, i))) !== 0)
      word = first[Math.floor(tempNumber / (100 * Math.pow(1000, i)))] + 'hunderd ' + word
  }
  return word.toUpperCase()
}

export const DownloadPOInvoice = (id: any) => {
  axiosInstance
    .get(`/admin/purchase-bill/download/${id}`)
    .then((response) => {
      console.log('response:', response)
      const linkSource = `data:application/pdf;base64,${response.data.data.base64String}`
      const downloadLink = document.createElement('a')
      const fileName = `PurchaseOrder${id}.pdf`
      downloadLink.href = linkSource
      downloadLink.download = fileName
      downloadLink.click()

      showToastMessage('Invoice Downloaded Successfully.', 'success')
    })
    .catch((error) => {
      showToastMessage(error?.response?.data?.errors?.message, 'success')
    })
}

export const DownloadSOInvoice = (id: any) => {
  axiosInstance
    .get(`/admin/orders/performa-invoice/${id}`)
    .then((response) => {
      console.log('response:', response)
      const linkSource = `data:application/pdf;base64,${response.data.data.base64String}`
      const downloadLink = document.createElement('a')
      const fileName = `Order${id}.pdf`
      downloadLink.href = linkSource
      downloadLink.download = fileName
      downloadLink.click()

      showToastMessage('Invoice Downloaded Successfully.', 'success')
    })
    .catch((error) => {
      showToastMessage(error?.response?.data?.errors?.message, 'success')
    })
}
