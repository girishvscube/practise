import React, { useEffect, useRef, useState, lazy, Suspense } from 'react'
import { Routes, Route, Navigate, Link, useLocation, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'

// assests
import ScubeLogo from '../assets/images/scube.svg'
import NotificationIcon from '../assets/icons/lightIcons/NotificationLight.svg'
import atdhdlogo from '../assets/images/atdhdlogo.svg'
// components
const Login = lazy(() => import('../components/Pages/Auth/Login'))
const Dashboard = lazy(() => import('../components/Pages/Dashboard/Dashboard'))
const ComponentToolKit = lazy(() => import('../components/Pages/ComponentToolKit'))
const UserListing = lazy(() => import('../components/Pages/User/UserListing/UserListing'))
const View = lazy(() => import('../components/Pages/User/ViewProfile/View'))
const ForgotPassword = lazy(() => import('../components/Pages/Auth/ForgotPassword'))
const CreatePassword = lazy(() => import('../components/Pages/Auth/CreatePassword'))
const ResetPassword = lazy(() => import('../components/Pages/Auth/ResetPassword'))
const Create = lazy(() => import('../components/Pages/Customer/Create/Create'))
const UserUpdate = lazy(() => import('../components/Pages/User/UserUpdate/UserUpdate'))
const UserCreate = lazy(() => import('../components/Pages/User/UserCreation/UserCreation'))
const CustomerView = lazy(() => import('../components/Pages/Customer/View/CustomerView'))
const CustomerListing = lazy(() => import('../components/Pages/Customer/Listing/CustomerListing'))
const LeadCreation = lazy(() => import('../components/Pages/leads/LeadCreation/LeadCreation'))
const LeadUpdate = lazy(() => import('../components/Pages/leads/LeadUpdate/LeadUpdate'))
const LeadListing = lazy(() => import('../components/Pages/leads/LeadListing/LeadListing'))
const NotFound = lazy(() => import('../components/Pages/PageNotFound'))
const OrdersListing = lazy(() => import('../components/Pages/Orders/List/OrdersListing'))
const CreateOrder = lazy(() => import('../components/Pages/Orders/Create/Create'))
const ViewOrder = lazy(() => import('../components/Pages/Orders/View/ViewOrder'))
const Main = lazy(() => import('../components/Pages/Settings/Main'))
const ParkingStations = lazy(
  () => import('../components/Pages/Parking/ParkingStations/ParkingStations'),
)
const CreateStation = lazy(() => import('../components/Pages/Parking/CreateStation/CreateStation'))
const BrowserListing = lazy(
  () => import('../components/Pages/Browser/BrowserListing/BrowserListing'),
)
const CreateBrowser = lazy(() => import('../components/Pages/Browser/Create/CreateBrowser'))
const UpdateBrowser = lazy(() => import('../components/Pages/Browser/Update/UpdateBrowser'))
const StationUpdate = lazy(() => import('../components/Pages/Parking/StationUpdate/StationUpdate'))
const Support = lazy(() => import('../components/Pages/SupportsTicket/OrderListing/Supports'))
const CreateTicket = lazy(
  () => import('../components/Pages/SupportsTicket/CreateTicket/CreateTicket'),
)
const BowserView = lazy(() => import('../components/Pages/Browser/View/BowserView'))
const TicketListing = lazy(
  () => import('../components/Pages/SupportsTicket/TicketListing/TicketListing'),
)
const TicketView = lazy(() => import('../components/Pages/SupportsTicket/TicketView/TicketView'))
const SupplierListing = lazy(
  () => import('../components/Pages/Suppliers/SuppliersListing/SuppliersListing'),
)
const SuppliersView = lazy(
  () => import('../components/Pages/Suppliers/SuppliersView/SuppliersView'),
)
const SupplierCreation = lazy(
  () => import('../components/Pages/Suppliers/SupplierCreation/SupplierCreation'),
)
const SupplierEdit = lazy(() => import('../components/Pages/Suppliers/SupplierCreation/Edit'))
const EditOrder = lazy(() => import('../components/Pages/Orders/Create/Edit'))
const LeadView = lazy(() => import('../components/Pages/leads/LeadView/LeadView'))
const ExpenseListing = lazy(() => import('../components/Pages/Accounts/Expenses/ExpenseListing'))
const EditCustomer = lazy(() => import('../components/Pages/Customer/Create/Edit'))
const CashInHandListing = lazy(
  () => import('../components/Pages/Accounts/CashIn/CashInHandListing'),
)
const InvoiceListing = lazy(() => import('../components/Pages/Accounts/Invoices/InvoiceListing'))
const BillsListing = lazy(() => import('../components/Pages/Accounts/PurchaseBills/BillsListing'))
const PaymentsInListing = lazy(
  () => import('../components/Pages/Accounts/PaymentsIn/PaymentsInListing'),
)
const CreatePaymentsIn = lazy(
  () => import('../components/Pages/Accounts/PaymentsIn/CreatePaymentsIn'),
)
const PaymentsOutListing = lazy(
  () => import('../components/Pages/Accounts/PaymentOut/PaymentsOutListing'),
)
const CreatePaymentsOut = lazy(
  () => import('../components/Pages/Accounts/PaymentOut/CreatePaymentsOut'),
)
const PurchaseOrdersListing = lazy(() => import('../components/Pages/PurchaseOrders/List/Listing'))
const CreatePurchaseOrder = lazy(() => import('../components/Pages/PurchaseOrders/Create/Create'))
const EditPO = lazy(() => import('../components/Pages/PurchaseOrders/Create/Edit'))
const SellingPriceList = lazy(() => import('../components/Pages/ValueAndCharges/Main'))
const TripsListing = lazy(() => import('../components/Pages/Trips/Listing/TripsListing'))
const TripsView = lazy(() => import('../components/Pages/Trips/View/TripsView'))
const Schedule = lazy(() => import('../components/Pages/Trips/ScheduleTrip/Schedule'))
const NoScheduleInfo = lazy(() => import('../components/Pages/Trips/View/NoScheduleInfo'))
const ViewPurchaseOrder = lazy(
  () => import('../components/Pages/PurchaseOrders/View/ViewPurchaseOrder'),
)
const EditPaymentsIn = lazy(() => import('../components/Pages/Accounts/PaymentsIn/Edit'))
const EditPaymentsOut = lazy(() => import('../components/Pages/Accounts/PaymentOut/Edit'))
const RescheduleTrip = lazy(() => import('../components/Pages/Trips/Reschedule/RescheduleTrip'))

// utils
import { getLoggedInUser, isUserLoggedIn } from '../utils/auth'
import { showToastMessage, uuid } from '../utils/helpers'
import { loggedOut } from '../features/auth/authSlice'
import MyProfile from './MyProfile'
import { fetchUserProfile } from '../features/user-profile/userProfileSlice'
import Validator from 'validatorjs'
import axiosInstance from '../utils/axios'

type Children = {
  children: any
}
type PrivateRouteProps = {
  children: any
  userRole: string[]
}

function useOutsideAlerter(ref, callbak) {
  useEffect(() => {
    /**
     * clicked on outside of element
     */
    function handleClickOutside(event) {
      if (ref.current && !ref.current.contains(event.target)) {
        callbak(false)
      }
    }

    // Bind the event listener
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [ref])
}

const RestrictedRoute = ({ children }: Children) => {
  const auth = isUserLoggedIn()
  return !auth ? children : <Navigate to='/dashboard' />
}

const PrivateRoute = ({ children, userRole }: PrivateRouteProps) => {
  const auth = isUserLoggedIn()
  const is_mobile = useCheckMobileScreen()
  const [isSidebarOpen, setMenuOpen] = useState(false)

  if (!auth) {
    return <Navigate to='/login' />
  }

  let user: any = {
    name: '',
    email: '',
  }
  const loggedUser = getLoggedInUser()
  if (loggedUser) {
    user = loggedUser
  }
  // const [openProfile, setOpenProfile] = useState(false)
  const [, setOpenMenuIndex] = useState(0)
  const location = useLocation()
  const dispatch = useDispatch<any>()
  const [showNotification, setNoticication] = React.useState(false)
  const [showUserInfo, setUserInfo] = React.useState(false)
  const navigate = useNavigate()
  const { userProfile } = useSelector((state: any) => state.user_profile)

  const [params, setParams] = useState({
    openProfile: false,
    name: '',
    phone: '',
    image: '',
    old_pwd: '',
    new_pwd: '',
  })
  const [formErrors, setFormErrors] = useState(params)
  const [userImage, setUserImage] = useState('')

  useEffect(() => {
    dispatch(fetchUserProfile())
  }, [])

  // console.log(params, "user_profile....")

  const wrapperInfoRef = useRef(null)
  useOutsideAlerter(wrapperInfoRef, setUserInfo)

  const wrapperNofificationRef = useRef(null)
  useOutsideAlerter(wrapperNofificationRef, setNoticication)

  function toogleNotification() {
    if (showNotification) {
      return setNoticication(false)
    }
    setNoticication(true)
    return true
  }

  function toogleUserInfo() {
    if (showUserInfo) {
      return setUserInfo(false)
    }
    setUserInfo(true)
    return true
  }

  function logout() {
    dispatch(loggedOut())
    navigate('/login')
  }

  const myProfile = () => {
    setParams({
      ...params,
      openProfile: true,
      name: userProfile?.name,
      phone: userProfile?.phone,
      image: userProfile?.image,
    })
  }

  const handleChange = (e: any) => {
    if (e.target) {
      const { name, value } = e.target
      if (name === 'phone') {
        const re = /^[0-9\b]+$/
        if (value && !re.test(value)) {
          return
        }
      }

      setParams({ ...params, [name]: value })
      setFormErrors({ ...formErrors, [name]: '' })
    }
  }

  const UpdateProfile = async (meta) => {
    const postdata = { ...params }
    const rules = {
      name: ['required', 'regex:^[A-Za-zs]$', 'max:100'],
      phone: 'required|min:10|max:10',
    }

    const validation = new Validator(params, rules)

    if (validation.fails()) {
      const fieldErrors: any = {}
      Object.keys(validation.errors.errors).forEach((key) => {
        fieldErrors[key] = validation.errors.errors[key][0]
      })

      setFormErrors(fieldErrors)
      return false
    }

    const formData = new FormData()

    Object.entries(postdata).forEach(([key, value]) => {
      if (!['openProfile', 'old_pwd', 'new_pwd'].includes(key)) {
        formData.append(`${key}`, `${value}`)
      }
    })

    if (userImage) {
      formData.append('user_image', userImage)
    }

    await axiosInstance
      .put(`/admin/users/profile/update-profile`, formData)
      .then((response) => {
        console.log(response.data, 'success')
        showToastMessage(response.data.data.message, 'success')
        setParams({ ...params, openProfile: false })
      })
      .catch((error) => {
        showToastMessage(error.message, 'error')
        setParams({ ...params, openProfile: false })
      })
    return true
  }

  const UpdatePassword = async () => {
    let change_pwd = {
      password: params.old_pwd,
      password_confirmation: params.new_pwd,
    }

    const validation = new Validator(params, {})

    if (validation.fails()) {
      const fieldErrors: any = {}
      Object.keys(validation.errors.errors).forEach((key) => {
        fieldErrors[key] = validation.errors.errors[key][0]
      })

      setFormErrors(fieldErrors)
      return false
    }

    await axiosInstance
      .put(`/admin/users/profile/change-password`, change_pwd)
      .then((response) => {
        console.log(response.data, 'success')
        showToastMessage(response.data.data.message, 'success')
        setParams({ ...params, openProfile: false })
      })
      .catch((error) => {
        showToastMessage(error.message, 'error')
        setParams({ ...params, openProfile: false })
      })
    return true
  }

  const handleImage = (data: any) => {
    setUserImage(data.file)
  }

  const removeImage = () => {
    setParams({ ...params, image: '' })
  }

  const { pathname } = location
  const splitLocation = pathname.split('/')
  const SYSTEM_ROUTES = [
    {
      name: 'Dashboard',
      icon: 'assets/icons/lightIcons/ChartLight.svg',
      active_icon: 'assets/icons/filledIcons/BarChart.svg',
      sub_menus: [],
      index: 1,
      url: 'dashboard',
      module: 'dashboard',
    },
    {
      name: 'Sales',
      icon: 'assets/icons/lightIcons/WorkLight.svg',
      active_icon: 'assets/icons/filledIcons/Work.svg',
      index: 2,
      sub_menus: [
        {
          name: 'Leads',
          url: 'sales/leads',
          sub_module: 'leads',
        },
        {
          name: 'Orders',
          url: 'sales/orders',
          sub_module: 'orders',
        },
      ],
      url: 'sales/leads',
      module: 'sales',
    },
    {
      name: 'Purchase',
      icon: 'assets/icons/lightIcons/GameLight.svg',
      active_icon: 'assets/icons/filledIcons/User3.svg',
      sub_menus: [],
      index: 3,
      url: 'purchase-orders',
      module: 'purchase-orders',
    },
    {
      name: 'Customers',
      icon: 'assets/icons/lightIcons/User3Light.svg',
      active_icon: 'assets/icons/filledIcons/User3.svg',
      sub_menus: [],
      index: 4,
      url: 'customers',
      module: 'customers',
    },
    {
      name: 'Suppliers',
      icon: 'assets/icons/lightIcons/HomeLight.svg',
      active_icon: 'assets/icons/filledIcons/Home.svg',
      sub_menus: [],
      index: 5,
      url: 'suppliers',
      module: 'suppliers',
    },
    {
      name: 'Support',
      icon: 'assets/icons/lightIcons/CallingLight.svg',
      active_icon: 'assets/icons/filledIcons/Call.svg',
      sub_menus: [],
      index: 6,
      url: 'support/tickets',
      module: 'support',
    },
    {
      name: 'Fleet Management',
      icon: 'assets/icons/lightIcons/CategoryLight.svg',
      active_icon: 'assets/icons/filledIcons/Category.svg',
      index: 7,
      sub_menus: [
        {
          name: 'Bowsers',
          url: 'fleet_manage/bowser',
          sub_module: 'bowser',
        },
        {
          name: 'Trips',
          url: 'fleet_manage/trips',
          sub_module: 'trips',
        },
        {
          name: 'Parking Stations',
          url: 'fleet_manage/parking-station',
          sub_module: 'parking-station',
        },
      ],
      url: 'fleet_manage/bowser',
      module: 'fleet_manage',
    },
    {
      name: 'Users',
      icon: 'assets/icons/lightIcons/ProfileLight.svg',
      active_icon: 'assets/icons/filledIcons/Profile.svg',
      sub_menus: [],
      index: 8,
      url: 'users',
      module: 'users',
    },
    {
      name: 'Accounts',
      icon: 'assets/icons/lightIcons/GraphLight.svg',
      active_icon: 'assets/icons/filledIcons/Graph.svg',
      index: 9,
      sub_menus: [
        {
          name: 'Invoice',
          url: 'accounts/invoices',
          sub_module: 'invoices',
        },
        {
          name: 'Payments In',
          url: 'accounts/payments-in',
          sub_module: 'payments-in',
        },
        {
          name: 'Payments Out',
          url: 'accounts/payments-out',
          sub_module: 'payments-out',
        },
        {
          name: 'Purchase Bills',
          url: 'accounts/purchase-bills',
          sub_module: 'purchase-bills',
        },
        {
          name: 'Expense',
          url: 'accounts/expenses',
          sub_module: 'expenses',
        },
        {
          name: 'Cash in hand',
          url: 'accounts/cash-in-hand',
          sub_module: 'cash-in-hand',
        },
      ],
      url: 'accounts/invoices',
      module: 'accounts',
    },
    {
      name: 'Values & Charges',
      icon: 'assets/icons/lightIcons/DiscountLight.svg',
      active_icon: 'assets/icons/filledIcons/Discount.svg',
      index: 10,
      sub_menus: [],
      url: 'value-charges/selling-price',
      module: 'value-charges',
    },
    {
      name: 'Settings',
      icon: 'assets/icons/lightIcons/SettingLight.svg',
      active_icon: 'assets/icons/filledIcons/Setting.svg',
      sub_menus: [],
      index: 11,
      url: 'admin/settings',
      module: 'settings',
    },
  ]

  const ROUTES = loggedUser
    ? SYSTEM_ROUTES.filter((x: any) => {
        let is_match = Array.isArray(loggedUser.user_permissions)
          ? loggedUser.user_permissions.find((y) => y.slug === x.module)
          : false
        return is_match ? true : false
      }).map((x: any) => {
        x.sub_menus = x.sub_menus.filter((y) => {
          let is_match = loggedUser.user_permissions.find((z) => z.slug === y.sub_module)
          return is_match ? true : false
        })
        return x
      })
    : SYSTEM_ROUTES

  console.log(ROUTES)
  return auth && userRole ? (
    <div className='flex h-screen overflow-y-hidden bg-lightGray text-white'>
      <aside
        className={`fixed inset-y-0 z-10 flex flex-col flex-shrink-0 w-64  border-r
       max-h-screen overflow-hidden transition-all transform bg-lightGray border-r-darkGray
       shadow-lg lg:z-auto lg:static lg:shadow-none ${
         !isSidebarOpen ? '-translate-x-full lg:translate-x-0 lg:w-20' : ''
       }`}
      >
        <div
          className={`flex items-center justify-between flex-shrink-0 p-2 ${
            !isSidebarOpen ? 'lg:justify-center' : ''
          }`}
        >
          <span className='p-2 text-xl font-semibold leading-8 tracking-wider uppercase whitespace-nowrap'>
            <img src={atdhdlogo} alt='logo' />
          </span>
          <button
            type='button'
            className='p-2 rounded-md lg:hidden'
            onClick={() => setMenuOpen(!isSidebarOpen)}
          >
            <svg
              className='w-6 h-6 text-white'
              xmlns='http://www.w3.org/2000/svg'
              fill='none'
              viewBox='0 0 24 24'
              stroke='currentColor'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth='2'
                d='M6 18L18 6M6 6l12 12'
              />
            </svg>
          </button>
        </div>
        <nav className='flex-1 overflow-hidden hover:overflow-y-auto' id='slimscrool'>
          <ul className='p-2 overflow-hidden'>
            {SYSTEM_ROUTES.map((x) => (
              <li
                key={uuid()}
                className={`pb-2 menu ${x.sub_menus.length && isSidebarOpen ? 'is-sub-menu' : ''}
               ${x.url && splitLocation.includes(x.module) ? 'active-link' : ''}`}
                onClick={() => x.sub_menus.length && isSidebarOpen && setOpenMenuIndex(x.index)}
              >
                <Link
                  to={`/${x.url}`}
                  className={`flex items-center py-2 px-4  space-x-4 rounded-md  ${
                    !isSidebarOpen ? 'justify-center' : ''
                  }`}
                >
                  <span>
                    <img
                      src={`/${
                        x.module && splitLocation.includes(x.module) ? x.active_icon : x.icon
                      }`}
                      alt='Setting'
                    />
                  </span>
                  <span className={`${!isSidebarOpen ? 'lg:hidden' : ''}`}>{x.name}</span>
                </Link>
                {x.sub_menus.length && isSidebarOpen && splitLocation.includes(x.module) ? (
                  <ul className='submenu pt-2'>
                    {x.sub_menus.map((y) => (
                      <li
                        key={uuid()}
                        className={`${splitLocation.includes(y.sub_module) ? 'active' : ''}`}
                      >
                        <Link to={`/${y.url}`}>
                          <a>
                            <span>{y.name}</span>
                          </a>
                        </Link>
                      </li>
                    ))}
                  </ul>
                ) : (
                  ''
                )}
              </li>
            ))}
          </ul>
        </nav>
        <div className='flex-shrink-0 p-2 border-t   max-h-14'>
          <div
            className={`flex items-center justify-center w-full px-4 py-2 space-x-1 ${
              !isSidebarOpen ? 'flex-col' : ''
            }`}
          ></div>
        </div>
      </aside>

      <div className='flex flex-col flex-1 h-full overflow-hidden'>
        <header className='flex-shrink-0'>
          <div className='flex items-center justify-between p-2'>
            <div className='flex items-center space-x-3'>
              <button
                className='p-2 cursor-pointer rounded-md focus:outline-none focus:ring hidden lg:block'
                type='button'
                onClick={() => setMenuOpen(!isSidebarOpen)}
              >
                <svg
                  className='w-4 h-4 text-white'
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 24 24'
                  stroke='currentColor'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth='2'
                    d='M13 5l7 7-7 7M5 5l7 7-7 7'
                  />
                </svg>
              </button>

              <svg
                onClick={() => setMenuOpen(true)}
                className='absolute cursor-pointer top-5 left-4  block lg:hidden'
                width='24'
                height='24'
                viewBox='0 0 24 24'
                fill='none'
                xmlns='http://www.w3.org/2000/svg'
              >
                <path
                  d='M2 12.303H22M2 2C2 2 17.9446 2 22 2M2 22H22'
                  stroke='white'
                  strokeWidth='2.11036'
                  strokeLinecap='round'
                />
              </svg>
            </div>

            <div className='relative flex items-center space-x-3 pr-3'>
              <div className='items-center  space-x-3 md:flex' ref={wrapperNofificationRef}>
                <div className='relative'>
                  <img
                    className='cursor-pointer'
                    src={NotificationIcon}
                    alt='Notification'
                    onClick={() => toogleNotification()}
                  />

                  <div
                    className={`absolute block w-48 z-99 max-w-md layout-menu transform layout-menu rounded-md 
                  shadow-lg -translate-x-3/4 min-w-max ${showNotification ? 'block' : 'hidden'}`}
                  >
                    <div className='p-4 font-medium border-b border-b-line'>
                      <span className='text-white'>Notification</span>
                    </div>
                    <ul className='flex flex-col p-2 my-2 space-y-1'>
                      <li>
                        <a className='block px-2 py-1 transition rounded-md '>Message 1</a>
                      </li>
                      <li>
                        <a className='block px-2 py-1 transition rounded-md '>Message 2</a>
                      </li>
                    </ul>
                    <div className='flex items-center justify-center p-4  underline border-t border-t-textgray'>
                      <a href='#'>See All</a>
                    </div>
                  </div>
                </div>
              </div>

              <div className='relative' ref={wrapperInfoRef}>
                <div
                  className='m-1 mr-2 w-10 h-10 relative flex justify-center
              items-center rounded-full bg-textgray text-xl text-white uppercase cursor-pointer'
                  onClick={() => toogleUserInfo()}
                >
                  {user?.name?.charAt(0)}
                </div>

                <div
                  className={`absolute  user-login-info  mt-3 transform -translate-x-full layout-menu rounded-md shadow-lg ${
                    showUserInfo ? 'block' : 'hidden'
                  } `}
                >
                  <div className='flex flex-col p-4 space-y-1 font-medium border-b border-b-line'>
                    <span className='text-white'> {user?.name}</span>
                    <span className='text-sm text-white'>{user?.email}</span>
                  </div>
                  <ul className='flex flex-col p-2 my-2 space-y-1'>
                    <li>
                      <a
                        className='block px-2 py-1 transition rounded-md cursor-pointer'
                        onClick={myProfile}
                      >
                        My Profile
                      </a>
                      <MyProfile
                        open={params.openProfile}
                        handleClose={() => setParams({ ...params, openProfile: false })}
                        title='My Profile'
                        type='info'
                        name='myprofile'
                        params={params}
                        handleChange={handleChange}
                        UpdateProfile={UpdateProfile}
                        removeImage={removeImage}
                        handleImage={handleImage}
                        UpdatePassword={UpdatePassword}
                      />
                    </li>
                  </ul>
                  <div className='flex items-center p-4  underline border-t border-t-line'>
                    <a onClick={() => logout()}>Logout</a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>
        <main className='flex-1 max-h-full p-2 lg:p-5 overflow-hidden overflow-y-scroll bg-darkGray'>
          {children}
        </main>
      </div>
    </div>
  ) : (
    <Navigate to='/page-not-found' />
  )
}

const useCheckMobileScreen = () => {
  const [width, setWidth] = useState(window.innerWidth)
  const handleWindowSizeChange = () => {
    setWidth(window.innerWidth)
  }

  useEffect(() => {
    window.addEventListener('resize', handleWindowSizeChange)
    return () => {
      window.removeEventListener('resize', handleWindowSizeChange)
    }
  }, [])

  return width <= 768
}

export const Layout = () => {
  return (
    <div className='App'>
      <Suspense fallback={<h1 className='loader'> Loading....</h1>}>
        <Routes>
          <Route path='/' element={<Navigate to='/login' />} />

          <Route
            path='/dashboard'
            element={
              <PrivateRoute userRole={['admin', 'king']}>
                <Dashboard />
              </PrivateRoute>
            }
          />
          <Route
            path='/login'
            element={
              <RestrictedRoute>
                <Login />
              </RestrictedRoute>
            }
          />
          <Route
            path='/create-password/:token'
            element={
              <RestrictedRoute>
                <CreatePassword />
              </RestrictedRoute>
            }
          />

          <Route
            path='/forgot-password'
            element={
              <RestrictedRoute>
                <ForgotPassword />
              </RestrictedRoute>
            }
          />

          <Route
            path='/reset-password'
            element={
              <RestrictedRoute>
                <ResetPassword />
              </RestrictedRoute>
            }
          />

          <Route
            path='/users'
            element={
              <PrivateRoute userRole={['admin']}>
                <UserListing />
              </PrivateRoute>
            }
          />

          <Route
            path='/users/create'
            element={
              <PrivateRoute userRole={['admin']}>
                <UserCreate />
              </PrivateRoute>
            }
          />

          <Route
            path='/users/edit/:id'
            element={
              <PrivateRoute userRole={['admin']}>
                <UserUpdate />
              </PrivateRoute>
            }
          />

          <Route
            path='/users/view/:id'
            element={
              <PrivateRoute userRole={['admin']}>
                <View />
              </PrivateRoute>
            }
          />

          <Route
            path='/customers'
            element={
              <PrivateRoute userRole={['admin']}>
                <CustomerListing />
              </PrivateRoute>
            }
          />

          <Route
            path='/customers/create'
            element={
              <PrivateRoute userRole={['admin']}>
                <Create />
              </PrivateRoute>
            }
          />

          <Route
            path='/customers/create/:id'
            element={
              <PrivateRoute userRole={['admin']}>
                <Create />
              </PrivateRoute>
            }
          />

          <Route
            path='/customers/edit/:id'
            element={
              <PrivateRoute userRole={['admin']}>
                <EditCustomer />
              </PrivateRoute>
            }
          />

          <Route
            path='/customers/view/:id'
            element={
              <PrivateRoute userRole={['admin']}>
                <CustomerView />
              </PrivateRoute>
            }
          />

          <Route
            path='/sales/leads'
            element={
              <PrivateRoute userRole={['admin']}>
                <LeadListing />
              </PrivateRoute>
            }
          />

          <Route
            path='/sales/leads/create'
            element={
              <PrivateRoute userRole={['admin']}>
                <LeadCreation />
              </PrivateRoute>
            }
          />

          <Route
            path='/sales/leads/edit/:id'
            element={
              <PrivateRoute userRole={['admin']}>
                <LeadUpdate />
              </PrivateRoute>
            }
          />

          <Route
            path='/sales/leads/view/:id'
            element={
              <PrivateRoute userRole={['admin']}>
                <LeadView />
              </PrivateRoute>
            }
          />

          <Route
            path='/sales/leads/convert/customer'
            element={
              <PrivateRoute userRole={['admin']}>
                <CreateOrder />
              </PrivateRoute>
            }
          />

          <Route
            path='/sales/orders'
            element={
              <PrivateRoute userRole={['admin']}>
                <OrdersListing />
              </PrivateRoute>
            }
          />

          <Route
            path='/fleet_manage/parking-station'
            element={
              <PrivateRoute userRole={['admin']}>
                <ParkingStations />
              </PrivateRoute>
            }
          />
          <Route
            path='/sales/orders/create'
            element={
              <PrivateRoute userRole={['admin']}>
                <CreateOrder />
              </PrivateRoute>
            }
          />
          <Route
            path='/sales/orders/create/:id'
            element={
              <PrivateRoute userRole={['admin']}>
                <CreateOrder />
              </PrivateRoute>
            }
          />

          <Route
            path='/sales/orders/edit/:id'
            element={
              <PrivateRoute userRole={['admin']}>
                <EditOrder />
              </PrivateRoute>
            }
          />
          <Route
            path='/sales/orders/view/:id'
            element={
              <PrivateRoute userRole={['admin']}>
                <ViewOrder />
              </PrivateRoute>
            }
          />

          <Route
            path='/fleet_manage/parking-station/create'
            element={
              <PrivateRoute userRole={['admin']}>
                <CreateStation />
              </PrivateRoute>
            }
          />

          <Route
            path='/fleet_manage/parking-station/edit/:id'
            element={
              <PrivateRoute userRole={['admin']}>
                <StationUpdate />
              </PrivateRoute>
            }
          />

          <Route
            path='/fleet_manage/bowser'
            element={
              <PrivateRoute userRole={['admin']}>
                <BrowserListing />
              </PrivateRoute>
            }
          />

          <Route
            path='/fleet_manage/bowser/create'
            element={
              <PrivateRoute userRole={['admin']}>
                <CreateBrowser />
              </PrivateRoute>
            }
          />

          <Route
            path='/fleet_manage/bowser/view/driver-detail/:id'
            element={
              <PrivateRoute userRole={['admin']}>
                <BowserView />
              </PrivateRoute>
            }
          />

          <Route
            path='/fleet_manage/bowser/:id'
            element={
              <PrivateRoute userRole={['admin']}>
                <UpdateBrowser />
              </PrivateRoute>
            }
          />

          <Route
            path='/fleet_manage/trips'
            element={
              <PrivateRoute userRole={['admin']}>
                <TripsListing />
              </PrivateRoute>
            }
          />

          <Route
            path='/fleet_manage/trips/view/:id'
            element={
              <PrivateRoute userRole={['admin']}>
                <TripsView />
              </PrivateRoute>
            }
          />

          <Route
            path='/fleet_manage/trips/schedule/:id'
            element={
              <PrivateRoute userRole={['admin']}>
                <Schedule type='' title='' />
              </PrivateRoute>
            }
          />

          <Route
            path='/fleet_manage/trips/schedule/edit/:id'
            element={
              <PrivateRoute userRole={['admin']}>
                <RescheduleTrip />
              </PrivateRoute>
            }
          />

          <Route
            path='/components'
            element={
              <PrivateRoute userRole={['admin']}>
                <ComponentToolKit />
              </PrivateRoute>
            }
          />

          <Route
            path='/admin/settings'
            element={
              <PrivateRoute userRole={['admin']}>
                <Main />
              </PrivateRoute>
            }
          />

          <Route
            path='/support'
            element={
              <PrivateRoute userRole={['admin']}>
                <Support />
              </PrivateRoute>
            }
          />

          <Route
            path='/support/create-ticket/:orderId'
            element={
              <PrivateRoute userRole={['admin']}>
                <CreateTicket />
              </PrivateRoute>
            }
          />

          <Route
            path='/support/tickets'
            element={
              <PrivateRoute userRole={['admin']}>
                <TicketListing />
              </PrivateRoute>
            }
          />

          <Route
            path='/support/tickets/edit/:id'
            element={
              <PrivateRoute userRole={['admin']}>
                <CreateTicket />
              </PrivateRoute>
            }
          />

          <Route
            path='/support/tickets/view/:id'
            element={
              <PrivateRoute userRole={['admin']}>
                <TicketView />
              </PrivateRoute>
            }
          />

          <Route
            path='/suppliers'
            element={
              <PrivateRoute userRole={['admin']}>
                <SupplierListing />
              </PrivateRoute>
            }
          />

          <Route
            path='/suppliers/view/:id'
            element={
              <PrivateRoute userRole={['admin']}>
                <SuppliersView />
              </PrivateRoute>
            }
          />

          <Route
            path='/suppliers/create'
            element={
              <PrivateRoute userRole={['admin']}>
                <SupplierCreation />
              </PrivateRoute>
            }
          />

          <Route
            path='/suppliers/edit/:id'
            element={
              <PrivateRoute userRole={['admin']}>
                <SupplierEdit />
              </PrivateRoute>
            }
          />

          <Route
            path='/accounts/expenses'
            element={
              <PrivateRoute userRole={['admin']}>
                <ExpenseListing />
              </PrivateRoute>
            }
          />

          <Route
            path='/accounts/cash-in-hand'
            element={
              <PrivateRoute userRole={['admin']}>
                <CashInHandListing />
              </PrivateRoute>
            }
          />

          <Route
            path='/accounts/invoices'
            element={
              <PrivateRoute userRole={['admin']}>
                <InvoiceListing />
              </PrivateRoute>
            }
          />

          <Route
            path='/accounts/purchase-bills'
            element={
              <PrivateRoute userRole={['admin']}>
                <BillsListing />
              </PrivateRoute>
            }
          />

          <Route
            path='/accounts/payments-in'
            element={
              <PrivateRoute userRole={['admin']}>
                <PaymentsInListing />
              </PrivateRoute>
            }
          />

          <Route
            path='/accounts/create/payments-in'
            element={
              <PrivateRoute userRole={['admin']}>
                <CreatePaymentsIn />
              </PrivateRoute>
            }
          />

          <Route
            path='/accounts/payments-out'
            element={
              <PrivateRoute userRole={['admin']}>
                <PaymentsOutListing />
              </PrivateRoute>
            }
          />

          <Route
            path='/accounts/edit/payments-in/:id'
            element={
              <PrivateRoute userRole={['admin']}>
                <EditPaymentsIn />
              </PrivateRoute>
            }
          />

          <Route
            path='/accounts/create/payments-out'
            element={
              <PrivateRoute userRole={['admin']}>
                <CreatePaymentsOut />
              </PrivateRoute>
            }
          />

          <Route
            path='/accounts/edit/payments-out/:id'
            element={
              <PrivateRoute userRole={['admin']}>
                <EditPaymentsOut />
              </PrivateRoute>
            }
          />

          <Route
            path='/purchase-orders'
            element={
              <PrivateRoute userRole={['admin']}>
                <PurchaseOrdersListing />
              </PrivateRoute>
            }
          />

          <Route
            path='/purchase-orders/create'
            element={
              <PrivateRoute userRole={['admin']}>
                <CreatePurchaseOrder />
              </PrivateRoute>
            }
          />
          <Route
            path='/purchase-orders/edit/:id'
            element={
              <PrivateRoute userRole={['admin']}>
                <EditPO />
              </PrivateRoute>
            }
          />
          <Route
            path='/purchase-orders/view/:id'
            element={
              <PrivateRoute userRole={['admin']}>
                <ViewPurchaseOrder />
              </PrivateRoute>
            }
          />

          <Route
            path='/value-charges/selling-price'
            element={
              <PrivateRoute userRole={['admin']}>
                <SellingPriceList />
              </PrivateRoute>
            }
          />

          <Route path='*' element={<NotFound />} />
        </Routes>
      </Suspense>
    </div>
  )
}
