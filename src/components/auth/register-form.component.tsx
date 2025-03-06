'use client'

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';

import { authApi } from '../../lib/api/auth.api';
import { RegisterData } from '../../types/auth.type';
import { useAuth } from '@/contexts/auth.context';

const RegisterForm: React.FC = () => {
  const [formData, setFormData] = useState<RegisterData>({ name: '', email: '', password: '' });
  const [error, setError] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [isCheckingEmail, setIsCheckingEmail] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const t = useTranslations();
  const emailCheckTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const { setUser, setToken } = useAuth();

  const checkEmailAvailability = async (email: string) => {
    if (!email || !email.includes('@')) return;

    setIsCheckingEmail(true);
    try {
      const emailData = { email };
      const response = await authApi.emailAvailability(emailData);
      if (response.data.exists === true) {
        setEmailError(t('auth.emailTaken'));
      } else {
        setEmailError(null);
      }
    } catch (error) {
      console.error('Error checking email availability:', error);
    } finally {
      setIsCheckingEmail(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (error) setError(null); // Clear error when user starts typing
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Check email availability with debouncing
    if (name === 'email') {
      // Clear previous timeout
      if (emailCheckTimeoutRef.current) {
        clearTimeout(emailCheckTimeoutRef.current);
      }

      // Set new timeout to check email after typing stops for 500ms
      emailCheckTimeoutRef.current = setTimeout(() => {
        checkEmailAvailability(value);
      }, 50);
    }
  };

  // Clear timeout on unmount
  useEffect(() => {
    return () => {
      if (emailCheckTimeoutRef.current) {
        clearTimeout(emailCheckTimeoutRef.current);
      }
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Check if email is available before proceeding
    if (emailError) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Step 1: Register the user
      await authApi.register(formData);
      console.log('Registration successful');

      try {
        // Step 2: Automatically log in the user
        const loginResponse = await authApi.login({ 
          email: formData.email, 
          password: formData.password 
        });
        console.log('Automatic login successful');

        // Step 3: Store authentication data
        const userData = loginResponse.data;
        const userToken = userData.token;

        // Update local storage
        localStorage.setItem('token', userToken);
        localStorage.setItem('user', JSON.stringify(userData));

        // Update auth context
        setUser(userData);
        setToken(userToken);

        // Step 4: Navigate to appropriate page
        router.push('/auth/pending');
      } catch (loginError: any) {
        console.error('Automatic login failed:', loginError);
        // Show login error but don't prevent navigation - registration was successful
        setError(t('auth.automaticLoginFailed'));
        
        // Still navigate to login page as fallback
        setTimeout(() => {
          router.push('/auth/login');
        }, 2000);
      }
    } catch (registerError: any) {
      console.error('Registration failed:', registerError);
      if (registerError.response?.data?.message) {
        setError(registerError.response.data.message);
      } else {
        setError(t('auth.registrationFailed'));
      }
      setIsSubmitting(false);
    }
  };

  const handleLogin = (e: React.MouseEvent) => {
    e.preventDefault();
    router.push('/auth/login');
  };

  return (
    <form onSubmit={handleSubmit} className='space-y-6'>
      {error && (
        <div className="p-3 text-sm text-red-700 bg-red-100 rounded-md border border-red-300">
          {error}
        </div>
      )}
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
          {t('auth.email')}
        </label>
        <div className="relative">
          <input
            type="email"
            name="email"
            id="email"
            value={formData.email}
            onChange={handleChange}
            required
            className={`mt-1 block w-full px-3 py-2 border ${emailError ? 'border-red-300' : 'border-gray-300'
              } rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
          />
          {isCheckingEmail && (
            <span className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <svg className="animate-spin h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </span>
          )}
        </div>
        {emailError && <p className="mt-1 text-sm text-red-600">{emailError}</p>}
      </div>
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
          {t('auth.userName')}
        </label>
        <input
          type="text"
          name="name"
          id="name"
          value={formData.name}
          onChange={handleChange}
          required
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>
      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
          {t('auth.password')}
        </label>
        <input
          type="password"
          name="password"
          id="password"
          value={formData.password}
          onChange={handleChange}
          required
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>
      <div>
        <button
          type="submit"
          disabled={!!emailError || isCheckingEmail || isSubmitting}
          className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
            emailError || isCheckingEmail || isSubmitting ? 'bg-indigo-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'
          } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
        >
          {isSubmitting ? t('common.submitting') : t('auth.register')}
        </button>
      </div>
      <div className="text-center text-sm">
        <p className="text-gray-600">
          {t('auth.alreadyHaveAccount')}{' '}
          <button
            type="button"
            onClick={handleLogin}
            className="font-medium text-indigo-600 hover:text-indigo-500 underline"
          >
            {t('auth.login')}
          </button>
        </p>
      </div>
    </form>
  );
};

export default RegisterForm;
