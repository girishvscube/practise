import Validator from 'validatorjs';
import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

import Auth from '../../Auth/Auth';
import { clearAccessToken, updatePassword } from '../../../features/auth/authSlice';

import { Input } from '../../common/input/Input';
import CustomButton from '../../common/Button';
import logo from '../../../assets/images/logo.svg';
import loginlogo from '../../../assets/images/login.svg';
import scube from '../../../assets/images/scube.svg';
import eyeClosed from '../../../assets/icons/filledIcons/eyeClosed.svg';
import eyeopen from '../../../assets/icons/filledIcons/eyeopen.svg';

const CreatePassword = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { token } = useParams();

  const fields:any = {
    password: '',
    password_confirmation: '',
  };

  const [params, setParams] = useState(fields);
  const [formErrors, setFormErrors] = useState(fields);
  const [eyeOpen, seteyeOpen] = useState(false);
  const { user, isLoading, errors } = useSelector((state: any) => state.auth);

  useEffect(() => {
    clearAccessToken();
  }, []);

  useEffect(() => {
    if (Object.keys(user).length) {
      navigate('/dashboard');
    }
  }, [user]);

  const apiError = errors.updatePassword;
  let errorMessage = '';
  if (apiError) {
    errorMessage = apiError[Object.keys(apiError)[0]] || apiError;
  }
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
      setFormErrors(fieldErrors);
      return false;
    }

    params.access_token = token;
    dispatch(updatePassword(params));
    return true;
  };

  return (
    <>
      <Auth>
        <div className="mt-16 lg:mt-16 sm:w-[479px] w-full sm:mx-auto ">
          <div className=" bg-lightbg border-border border flex flex-col justify-center items-center p-6 sm:p-12 rounded-lg ">
            <p className=" text-yellow text-[20px] sm:22px  font-nunitoBold flex items-center gap-2 mb-4">
              Welcome to ATD
              <span>
                <img src={logo} alt="logo" />
              </span>
            </p>
            <p className="text-center sm:text-left text-xs text-white mb-8">
              Create Your Own Login Password.
            </p>

            <form className="flex flex-col gap-y-5 w-full " onSubmit={submit}>
              <div className=" relative">
                <Input
                  rows={1}
                  width="w-full"
                  disabled={false}
                  readOnly={false}
                  label="Enter Password"
                  name="password"
                  value={params?.password}
                  handleChange={handleChange}
                  type={eyeOpen ? 'text' : 'password'}
                  helperText={
                      !formErrors?.password?.includes('match') ? formErrors?.password : ''
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
                disabled={false}
                readOnly={false}
                label="Confirm Password"
                name="password_confirmation"
                value={params?.password_confirmation}
                handleChange={handleChange}
                type="password"
                helperText={
                    !formErrors?.password_confirmation?.includes('match')
                      ? formErrors?.password_confirmation
                      : ''
                  }
                error={formErrors?.password_confirmation?.length > 0
                  || (formErrors?.password?.includes('match') && params?.password_confirmation)}
              />
              {' '}
              <p className="pl-4  text-xs text-red-600">
                {formErrors?.password?.includes('match') && params?.password_confirmation && 'Password does not match.'}
              </p>

              {
                  errorMessage
                    ? (
                      <p className="pl-4  text-xs text-red-600">
                        {errorMessage}
                      </p>
                    ) : ''
                }

              <CustomButton type="submit" variant="contained" disabled={isLoading}>
                Update Password
              </CustomButton>
            </form>
          </div>
          <p className="flex gap-2 items-center text-yellow font-nunitoLight text-xs justify-center mt-7">
            Powered By
            {' '}
            <span>
              {' '}
              <img className=" relative bottom-[2px] w-[78px]" src={scube} alt="scubelogo" />
            </span>
          </p>
        </div>
        <div className="hidden lg:flex   justify-end">
          <img className="" src={loginlogo} alt="login" />
        </div>
      </Auth>
    </>
  );
};

export default CreatePassword;
