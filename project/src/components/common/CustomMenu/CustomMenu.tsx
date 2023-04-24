import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import View from '../../../assets/icons/View.svg'
import Download from '../../../assets/icons/Download.svg'
import Confirmed from '../../../assets/icons/Confirmed.svg'
import { useEffect } from 'react'
import Send from '../../../assets/icons/Send.svg'
import { Link } from 'react-router-dom'
import axiosInstance from './../../../utils/axios'
import { useDispatch } from 'react-redux'
import { showToastMessage, uuid } from '../../../utils/helpers'
import { fetchPurchaseOrdersList } from '../../../features/PurchaseOrders/purchaseOrderSlice'
import { fetchOrdersList, fetchOrderCount } from '../../../features/orders/orderSlice'
interface Props {
  children: any
  anchorEl: any
  handleMenu: any
  CloseMenu: any
  Open: any
  defaultId: any
  MenuOptions: any
}

const CustomMenu: React.FC<Props> = ({
  defaultId,
  children,
  Open,
  anchorEl,
  handleMenu,
  CloseMenu,
  MenuOptions,
}) => {
  const dispatch = useDispatch()

  const SupplierPOConfirm = (poid: any) => {
    axiosInstance
      .get(`/admin/purchase-order/supplier/confirmation/${poid}`)
      .then((response) => {
        dispatch(
          fetchPurchaseOrdersList(1, {
            searchText: '',
            status: '',
            salesExecutive: '',
            start_date: '',
            end_date: '',
          }),
        )
        // console.log('poc confirmed:', response.data.data.message)
        showToastMessage(response?.data?.data?.message, 'success')
      })
      .catch((error) => {
        console.log(' po error:', error)
        showToastMessage(error?.response?.data?.errors?.message, 'success')
      })
  }

  const ConfirmSO = (order_id: number) => {
    axiosInstance
      .get(`/admin/orders/confirm/${order_id}`)
      .then((response) => {
        dispatch(
          fetchOrdersList(1, {
            searchText: '',
            status: '',
            salesExecutive: '',
            start_date: '',
            end_date: '',
          }),
        )
        // console.log('poc confirmed:', response.data.data.message)
        showToastMessage(`${order_id} ${response?.data?.data?.message}`, 'success')
      })
      .catch((error) => {
        console.log(' po error:', error)
        showToastMessage(error?.response?.data?.errors?.message, 'success')
      })
  }

  const DownloadPOInvoice = (id: any) => {
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

  const DownloadSOInvoice = (id: any) => {
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

  return (
    <div>
      <p
        className='cursor-pointer'
        id='basic-button'
        aria-controls={Open ? 'basic-menu' : undefined}
        aria-haspopup='true'
        aria-expanded={Open ? 'true' : undefined}
        onClick={handleMenu}
      >
        {children}
      </p>

      <Menu
        className='custom-menu'
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        sx={{
          color: 'white',
          '.css-6hp17o-MuiList-root-MuiMenu-list ': {
            color: 'white !important',
          },
          '& .MuiList-root': {
            padding: '0 !important',
          },
          '& .MuiMenuItem-root': {
            borderBottom: '1px solid #404050 !important',
          },
        }}
        PaperProps={{
          elevation: 0,
          sx: {
            width: window.innerWidth < 768 ? '100% !important' : '20% !important',
            backgroundColor: '#333748 !important',
          },
        }}
        id='basic-menu'
        anchorEl={anchorEl}
        open={Open}
        onClose={CloseMenu}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
      >
        {MenuOptions.map((item: any) => (
          <MenuItem key={uuid()}>
            {item?.title?.includes('View') ? (
              <img src={View} alt='view_icon' />
            ) : item?.title?.includes('Download') ? (
              <img src={Download} alt='download_icon' />
            ) : item?.title?.includes('Send') ? (
              <img src={Send} alt='send_icon' />
            ) : item?.title?.toLowerCase()?.includes('confirm') ? (
              <img src={Confirmed} alt='confirmed_icon' />
            ) : (
              ''
            )}

            {item?.title?.includes('Download') ? (
              <button
                className='text-left w-full ml-2 font-nunitoRegular'
                onClick={() => {
                  if (item?.title?.includes('PO')) {
                    DownloadPOInvoice(defaultId)
                    CloseMenu()
                  }
                  if (item?.title?.includes('SO')) {
                    DownloadSOInvoice(defaultId)
                    CloseMenu()
                  }
                  if (item?.title?.includes('Invoice')) {
                    DownloadSOInvoice(defaultId)
                    CloseMenu()
                  }
                }}
              >
                {item?.title}
              </button>
            ) : item?.title?.toLowerCase().includes('confirm') ? (
              <button
                className='text-left cursor-pointer w-full   ml-2 font-nunitoRegular'
                onClick={() => {
                  // CloseMenu()

                  if (item?.title?.includes('PO')) {
                    SupplierPOConfirm(defaultId)
                    CloseMenu()
                  }

                  if (item?.title?.includes('Order')) {
                    ConfirmSO(defaultId)
                    CloseMenu()
                  }
                }}
              >
                {item?.title}
              </button>
            ) : (
              <Link
                onClick={CloseMenu}
                state={{ defaultId }}
                className='w-full  ml-2 font-nunitoRegular'
                to={item?.link}
              >
                {item?.title}
              </Link>
            )}
          </MenuItem>
        ))}
      </Menu>
    </div>
  )
}

export default CustomMenu
