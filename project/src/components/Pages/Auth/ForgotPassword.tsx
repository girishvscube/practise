import { Input } from '../../common/input/Input'
import CustomButton from '../../common/Button'
import Validator from 'validatorjs'

import login from '../../../assets/images/login.svg'
import scube from '../../../assets/images/scube.svg'

import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Auth from '../../Auth/Auth'
import { useSelector, useDispatch } from 'react-redux'
import { forgotPassword, resetapiSuccess } from '../../../features/auth/authSlice'

const ForgotPassword = () => {
  const [email, setEmail] = useState('')
  const [formErrors, setFormErrors] = useState({ email: '' })

  const dispatch = useDispatch()
  const { apiSuccess, isLoading } = useSelector((state: any) => state.auth)
  console.log('isLoading:', isLoading)

  useEffect(
    () => () => {
      dispatch(resetapiSuccess())
    },
    [],
  )

  const handleEmail = (e: any) => {
    if (e.currentTarget.value.includes(' ')) {
      e.currentTarget.value = e.currentTarget.value.replace(/\s/g, '')
    }
    setEmail(e.target.value)
    setFormErrors({ email: '' })
  }

  async function forgot(e: any) {
    e.preventDefault()
    const validation = new Validator(
      {
        email,
      },
      {
        email: 'email|required|max:150',
      },
      {
        required: '*required',
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
    dispatch(forgotPassword({ email }))
    return true
  }
  return (
    <Auth>
      <div className='mt-16 lg:mt-16 sm:w-[479px] w-full sm:mx-auto '>
        <div className='bg-lightbg border-border border flex flex-col justify-center items-center p-6 sm:p-12 rounded-lg  '>
          <p className=' text-yellow text-[20px] sm:22px font-nunitoBold flex items-center gap-2 mb-4 '>
            Forgot Your Password?
          </p>
          <p className=' text-center sm:text-left text-xs text-white mb-8 '>
            Enter your email and we′ll send you instructions to reset your password.
          </p>
          {/* First Time Login & Login  */}
          <form onSubmit={forgot} className='w-full'>
            <div className='relative flex flex-col gap-5 w-full mb-8'>
              <Input
                success={apiSuccess}
                rows={1}
                width='w-full'
                readOnly={false}
                label='Email Id'
                name='email'
                value={email}
                handleChange={handleEmail}
                type='text'
                helperText={formErrors?.email}
                error={formErrors?.email?.length > 0}
              />
              {apiSuccess ? (
                <p className='text-sm absolute -bottom-7 left-4  text-green'>
                  Reset link has been sent to your email ID.
                </p>
              ) : null}
            </div>

            <div className=' w-full '>
              <CustomButton disabled={isLoading} type='submit' variant='contained'>
                Send Reset Link
              </CustomButton>
              <div className=' flex items-center gap-2 justify-center mt-4'>
                <svg
                  width='20'
                  height='20'
                  viewBox='0 0 20 20'
                  fill='none'
                  xmlns='http://www.w3.org/2000/svg'
                >
                  <path
                    d='M3.54102 10.2282L16.041 10.2282'
                    stroke='#FFCD2C'
                    strokeWidth='1.5'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                  />
                  <path
                    d='M8.58203 15.2488L3.54037 10.2288L8.58203 5.20801'
                    stroke='#FFCD2C'
                    strokeWidth='1.5'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                  />
                </svg>

                <Link to='/login' className=' text-yellow text-sm '>
                  Back to Login
                </Link>
              </div>
            </div>
          </form>
        </div>
      
      </div>
      <div className='hidden lg:flex justify-end'>
        <img className=' text-yellow' src={login} alt='login' />
      </div>
    </Auth>
  )
}

export default ForgotPassword
