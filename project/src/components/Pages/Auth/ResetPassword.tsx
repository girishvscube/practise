import Validator from 'validatorjs';
import { useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

import { Input } from '../../common/input/Input';
import logo from '../../../assets/images/logo.svg';
import loginlogo from '../../../assets/images/login.svg';
import scube from '../../../assets/images/scube.svg';
import eyeClosed from '../../../assets/icons/filledIcons/eyeClosed.svg';
import eyeopen from '../../../assets/icons/filledIcons/eyeopen.svg';

import CustomButton from '../../common/Button';
import Auth from '../../Auth/Auth';
import PasswordSuccess from '../../PasswordSuccess/PasswordSuccess';
import { resetPassword } from '../../../features/auth/authSlice';

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  
  const dispatch = useDispatch();
  const fields = {
    token,
    password: '',
    password_confirmation: '',
  };

  const [params, setParams] = useState(fields);
  const [formErrors, setFormErrors] = useState(fields);
  const { apiSuccess, isLoading } = useSelector((state: any) => state.auth);

  const [eyeOpen, seteyeOpen] = useState(false);
  const handleChange = (e: any) => {
    if (e.currentTarget.value.includes(" ")) {
      e.currentTarget.value = e.currentTarget.value.replace(/\s/g, "");
    }
    setParams({ ...params, [e.target.name]: e.target.value });
    setFormErrors(fields);
  };

  const submit = async (e: any) => {
    e.preventDefault();
    const validation = new Validator(
      params,
      {
        password: 'required|min:8|max:14|confirmed',
        password_confirmation: 'required|min:8|max:14',
      },
    );

    if (validation.fails()) {
      const fieldErrors: any = {};
      Object.keys(validation.errors.errors).forEach((key) => {
        fieldErrors[key] = validation.errors.errors[key][0];
      });
      // console.log(fieldErrors);
      setFormErrors(fieldErrors);
      return false;
    }

    dispatch(resetPassword(params));
    return true;
  };

  return (
    <>
      {
        apiSuccess ? (
          <Auth>
            <div className="mt-16 lg:mt-16 sm:w-[479px] w-full sm:mx-auto ">
              <PasswordSuccess />
              <p className="flex gap-2 items-center text-yellow font-nunitoLight text-xs justify-center mt-7">
                Powered By
                {' '}
                <span>
                  {' '}
                  <img
                    className=" relative bottom-[2px] w-[78px]"
                    src={scube}
                    alt="scubelogo"
                  />
                </span>
              </p>
            </div>
            <div>
              <img className="" src={loginlogo} alt="login" />
            </div>
          </Auth>
        ) : (
          <Auth>
            <div className="mt-16 lg:mt-16 sm:w-[479px] w-full sm:mx-auto">
              <div className="  bg-lightbg border-border border flex flex-col justify-center items-center p-6 sm:p-12 rounded-lg ">
                <p className=" text-yellow text-[19px] sm:22px  font-nunitoBold flex items-center sm:gap-2 mb-4">
                  Create New Password
                  <span>
                    <img src={logo} alt="logo" />
                  </span>
                </p>
                <p className="text-center sm:text-left text-xs text-white mb-8">Enter Your New Password.</p>

                <form className="flex flex-col gap-y-5 w-full " onSubmit={submit}>
                  <div className=" relative">
                    <Input
                      rows={1}
                      width="w-full"
                      disabled={false}
                      readOnly={false}
                      label="Enter New Password"
                      name="password"
                      value={params?.password}
                      handleChange={handleChange}
                      type={eyeOpen ? 'text' : 'password'}
                      helperText={
                        formErrors?.password
                          ? formErrors?.password
                          : ''
                      }
                      error={formErrors?.password?.length > 0}
                    />
                    {eyeOpen ? (
                      <img
                        className=" absolute right-2 top-4 cursor-pointer"
                        onClick={() => seteyeOpen(false)}
                        src={eyeopen}
                        alt="eye-closed"
                      />
                    ) : (
                      <img
                        className=" absolute right-2 top-4 cursor-pointer"
                        onClick={() => seteyeOpen(true)}
                        src={eyeClosed}
                        alt="eye-closed"
                      />
                    )}
                  </div>
                  <Input
                    rows={1}
                    width="w-full"
                    label="Confirm New Password"
                    name="password_confirmation"
                    value={params?.password_confirmation}
                    handleChange={handleChange}
                    type="password"
                    helperText={
                      formErrors?.password_confirmation
                        ? formErrors?.password_confirmation
                        : ''
                    }
                    error={formErrors?.password_confirmation?.length > 0}
                  />

                  <CustomButton type="submit" variant="contained" disabled={isLoading}>
                    Submit New Password
                  </CustomButton>

                  <div className=" flex items-center gap-2 justify-center ">
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 20 20"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M3.54102 10.2282L16.041 10.2282"
                        stroke="#FFCD2C"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M8.58203 15.2488L3.54037 10.2288L8.58203 5.20801"
                        stroke="#FFCD2C"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>

                    <Link to="/login" className=" text-yellow text-sm ">
                      Back to Login
                    </Link>
                  </div>
                </form>
              </div>
              <p className="flex gap-2 items-center text-yellow font-nunitoLight text-xs justify-center mt-7">
                powered by
                {' '}
                <span>
                  {' '}
                  <img
                    className=" relative bottom-[2px] w-[78px]"
                    src={scube}
                    alt="scubelogo"
                  />
                </span>
              </p>
            </div>
            <div className="hidden lg:flex   justify-end">
              <img className="" src={loginlogo} alt="login" />
            </div>
          </Auth>
        )
      }

    </>
  );
};

export default ResetPassword;
