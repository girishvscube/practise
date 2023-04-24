import { useState, useMemo } from 'react'
import { styled } from '@mui/material/styles'
import Table from '@mui/material/Table'
import IconButton from '@mui/material/IconButton'
import TableBody from '@mui/material/TableBody'
import TableCell, { tableCellClasses } from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Paper from '@mui/material/Paper'
import { makeStyles } from '@mui/styles'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import Validator from 'validatorjs'
import moment from 'moment'
import CircularProgress from '@mui/material/CircularProgress'
import Tooltip from '@mui/material/Tooltip'

import axiosInstance from '../../../utils/axios'
import Pagination from '../../common/Pagination/Pagination'
import { showToastMessage } from '../../../utils/helpers'
import CustomButton from '../../common/Button'
import Refresh from '../../../assets/icons/filledIcons/Refresh.svg'
import SellingPrice from '../../../assets/images/SellingPrice.svg'
import CloseSquareLight from '../../../assets/icons/lightIcons/CloseSquareLight.svg'
import { Input } from '../../common/input/Input'
import { DateFiter } from '../../common/DateFiter'

const useStyles = makeStyles(() => ({
  root: {
    '& td ': {
      color: '#FFFFFF',
    },
    '& th ': {
      color: '#6A6A78',
    },
  },

  tr: {
    '& td:first-child ': {
      borderTopLeftRadius: '8px',
      borderBottomLeftRadius: '8px',
    },
    '& td:last-child ': {
      borderTopRightRadius: '8px',
      borderBottomRightRadius: '8px',
    },
  },
}))

export interface DialogTitleProps {
  children: any
  onClose: () => void
}

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2),
    width: '100%',
    alignItems: 'center',
  },
  '& .MuiPaper-root': {
    border: '1px solid #404050 !important',
    'border-radius': '8px !important',
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1),
  },
  '& .css-1t1j96h-MuiPaper-root-MuiDialog-paper': {
    backgroundColor: '#404050',
  },
  dialogCustomizedWidth: {
    'max-width': '80%',
  },
}))

const BootstrapDialogTitle = (props: DialogTitleProps) => {
  const { children, onClose, ...other } = props
  return (
    <DialogTitle sx={{ m: 0, py: 3 }} {...other}>
      {children}
      {onClose ? (
        <IconButton
          aria-label='close'
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[600],
          }}
        >
          <img src={CloseSquareLight} alt='' />
        </IconButton>
      ) : null}
    </DialogTitle>
  )
}

const SellingPriceList = () => {
  const classes = useStyles()
  const [list, setList] = useState([])
  const [loading, setLoading] = useState(false)
  const [meta, setMeta] = useState({
    total: 0,
  })
  const [formErrors, setFormErrors] = useState({
    price: '',
  })
  const [currentPage, setCurrentPage] = useState(1)

  const [dialogMeta, setDialogMeta] = useState({
    open: false,
    price: '',
    disable_button: false,
  })

  const [defaultValue, setDefaultValue] = useState({
    price: '',
    updated_at: '',
  })

  const [date, setDate] = useState({
    start_date: '',
    end_date: '',
  })

  const handleCreate = () => {
    setDialogMeta({ ...dialogMeta, open: true })
  }
  const handleClose = () => {
    setDialogMeta({ ...dialogMeta, open: false })
  }
  const updateSellingPrice = async () => {
    const validation = new Validator(
      { price: dialogMeta.price },
      {
        price: 'required|numeric|max:500',
      },
    )

    if (validation.fails()) {
      const fieldErrors: any = {}
      Object.keys(validation.errors.errors).forEach((key) => {
        fieldErrors[key] = validation.errors.errors[key][0]
      })

      setFormErrors(fieldErrors)
      return false
    }
    setDialogMeta({ ...dialogMeta, disable_button: true })
    axiosInstance
      .post('/admin/values-charges/selling-price', { price: parseFloat(dialogMeta.price) })
      .then((resp) => {
        setDialogMeta({ ...dialogMeta, open: false, disable_button: false })
        showToastMessage(resp.data.data.message, 'success')
        getSellingPriceList()
      })
      .catch((error) => {
        setDialogMeta({ ...dialogMeta, disable_button: false })
        showToastMessage(error.message, 'error')
      })
  }

  const getSellingPriceList = async () => {
    setLoading(true)
    await axiosInstance(
      `/admin/values-charges/selling-price?page=${currentPage}&start_date=${date.start_date}&end_date=${date.end_date}`,
    )
      .then((response) => {
        setLoading(false)
        console.log(response.data)
        let list = response.data.data
        let activeValue = list.find((x) => x.is_active)
        if (activeValue) setDefaultValue(activeValue)
        setList(list)
        setMeta(response.data.meta)
      })
      .catch((error) => {
        setLoading(false)
        console.log(error)
      })
  }

  useMemo(() => {
    getSellingPriceList()
  }, [currentPage, date])

  const onDateSelect = (date: any) => {
    setDate(date)
  }

  const handleChange = (e: any) => {
    const { name, value } = e.target
    const re = /^[0-9\b]+$/
    if (value && !re.test(value)) {
      return
    }
    setDialogMeta({ ...dialogMeta, [name]: value })
    setFormErrors({ ...formErrors, [name]: '' })
  }

  return (
    <div className='w-full  bg-lightbg  rounded-lg mt-4'>
      <div className='flex  justify-between p-4 items-center'>
        <p className='text-lg font-extrabold text-white font-nunitoRegular w-full'>
          Selling Price Info
        </p>
        <DateFiter onDateRangeSelect={onDateSelect} />
      </div>
      {loading ? (
        <div className='w-full h-80 flex justify-center items-center'>
          <CircularProgress />
          <span className='text-3xl'>Loading...</span>
        </div>
      ) : (
        <>
          <div className='rounded-lg  bg-darkGray flex justify-between mx-4 mb-2 p-5 items-center'>
            <div className='flex gap-4 text-center'>
              <img src={SellingPrice} />
              <div>
                <p>
                  <span className='text-sm'>Today`s Selling price :</span>
                  <span className='text-lg font-bold'> ₹ {defaultValue.price}</span>{' '}
                </p>
                {defaultValue.updated_at ? (
                  <p>
                    <span className='text-textgray text-xs'>Updated on </span>
                    <span className='text-xs'>
                      {moment(defaultValue?.updated_at).format('LT')},
                      {moment(defaultValue?.updated_at).format('DD/MM/YYYY')}
                    </span>
                  </p>
                ) : (
                  <></>
                )}
              </div>
            </div>
            <CustomButton
              onClick={handleCreate}
              width='w-fit'
              variant='outlined'
              size='large'
              borderRadius='8px'
              icon={<img src={Refresh} alt='' />}
            >
              <Tooltip title='update new selling price'>
                <span>Update Price</span>
              </Tooltip>
            </CustomButton>
          </div>
          <div className='px-4 pb-4'>
            <TableContainer component={Paper}>
              <Table
                aria-label='simple table'
                sx={{
                  [`& .${tableCellClasses.root}`]: {
                    borderBottom: '1px solid #404050',
                  },
                  minWidth: 650,
                  background: '#151929',
                  borderRadius: '8px',
                  '& .css-zvlqj6-MuiTableCell-root': {
                    padding: 0,
                  },
                }}
                className={classes.root}
              >
                <TableHead>
                  <TableRow>
                    <TableCell align='center' sx={{ borderRight: '1px solid #404050' }}>
                      <span>Updated Date and Time</span>
                    </TableCell>
                    <TableCell align='center'>
                      <span>Selling Price of Fuel</span>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {list?.length ? (
                    list?.map((row: any) => (
                      <TableRow
                        key={row?.id}
                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                      >
                        <TableCell align='center'>
                          <div className='flex justify-center gap-6'>
                            <p>
                              {moment(row?.updated_at).format('LT')},
                              {moment(row?.updated_at).format('DD/MM/YYYY')}
                            </p>
                          </div>
                        </TableCell>

                        <TableCell align='center'>₹ {row?.price}</TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell align='center' colSpan={2}>
                        No Results found !!
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>

            <div>
              <div className='dialog-wrapper'>
                <BootstrapDialog
                  sx={{
                    '& .MuiBackdrop-root': {
                      backgroundColor: 'rgba(0,0,0,0.8)',
                      backdropFilter: 'blur(5px)',
                    },
                  }}
                  aria-labelledby='customized-dialog-title'
                  open={dialogMeta.open}
                  PaperProps={{
                    sx: {
                      width: '60%',
                      m: 0,
                      backgroundColor: 'arsenic',
                      alignItems: 'center',
                      borderColor: 'arsenic',
                    },
                  }}
                >
                  <BootstrapDialogTitle onClose={handleClose}>
                    <div className='flex justify-start'>
                      <p className='font-bold font-nunitoRegular flex justify-start text-white absolute top-2 left-6'>
                        Update Selling Price
                      </p>
                    </div>
                  </BootstrapDialogTitle>
                  <DialogContent>
                    <div className='w-full mt-4 bg-darkGray p-6 rounded-lg flex flex-col gap-6'>
                      <Input
                        rows={1}
                        width='w-full'
                        disabled={false}
                        readOnly={false}
                        error={!!formErrors.price}
                        value={dialogMeta.price}
                        handleChange={handleChange}
                        helperText={formErrors.price}
                        label='Enter the Selling Price in Rupees'
                        name='price'
                      />
                    </div>
                  </DialogContent>

                  <div className='flex justify-center pt-2 pb-10 h-[72px]'>
                    <CustomButton
                      disabled={dialogMeta.disable_button}
                      onClick={updateSellingPrice}
                      width='w-full'
                      variant='contained'
                      size='large'
                    >
                      Submit Details
                    </CustomButton>
                  </div>
                </BootstrapDialog>
              </div>
            </div>
          </div>
        </>
      )}

      <Pagination
        className='pagination-bar'
        currentPage={currentPage}
        totalCount={meta.total}
        pageSize={10}
        onPageChange={(page) => setCurrentPage(page)}
      />
    </div>
  )
}
export default SellingPriceList
