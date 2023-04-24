import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { authenticate, logout } from '../features/auth/authSlice';

const Header = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state: any) => state.auth);

  useEffect(() => {
    dispatch(authenticate());
  }, [dispatch]);

  function logoutUser(e: any) {
    e.preventDefault();
    dispatch(logout());
  }

  return (
    <div>
      <div className="bg-gray-100 border-t-4 border-indigo-600">
        <div className="container mx-auto">
          <div className="py-4 px-4 flex flex-row justify-between flex-wrap">
            <Link
              to="/"
              className="block px-2 py-4 lg:w-3/12 font-bold text-gray-800 text-xl uppercase tracking-wider"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 inline-block mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
                />
              </svg>
              BOILERPLATE
            </Link>
            <div className="block lg:hidden text-right py-4 mt-1">
              <button id="menu" type="button">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4 6h16M4 12h16m-7 6h7"
                  />
                </svg>
              </button>
            </div>
            <ul
              className="hidden lg:flex flex-col md:flex-row justify-end"
              id="submenu"
            >
              {Object.keys(user).length > 0 && (
              <li>
                <Link
                  to="/logout"
                  onClick={(e) => logoutUser(e)}
                  className="p-4 block"
                >
                  Logout
                </Link>
              </li>
              )}
              {!Object.keys(user).length && (
              <li>
                <Link to="/login" className="p-4 block">
                  Sign In
                </Link>
              </li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
