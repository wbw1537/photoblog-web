'use client'

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';

import { authApi } from '../../lib/api/auth.api';
import { LoginData } from '../../types/auth.type';

const LoginForm: React.FC = () => {
  const [formData, setFormData] = useState<LoginData>({ email: '', password: '' });
  const router = useRouter();
  const t = useTranslations();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await authApi.login(formData);
      console.log('Logged in:', response.data);
      // router.push('/dashboard'); // Redirect to dashboard after login
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  const handleRegister = (e: React.MouseEvent) => {
    e.preventDefault();
    router.push('/auth/register');
  };

  return (
    <form onSubmit={handleSubmit} className='space-y-6'>
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
          {t('auth.email')}
        </label>
        <input
          type="email"
          name="email"
          id="email"
          value={formData.email}
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
      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center">
          <input id="remember-me" type="checkbox" className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded" />
          <label htmlFor="remember-me" className="ml-2 block text-gray-700">{t('auth.rememberMe')}</label>
        </div>
        <div>
          <a href="#" className="text-indigo-600 hover:text-indigo-500">{t('auth.forgotPassword')}</a>
        </div>
      </div>
      <div>
        <button
          type="submit"
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          {t('auth.signIn')}
        </button>
      </div>
      <div className="text-center text-sm">
        <p className="text-gray-600">
          {t('auth.dontHaveAccount')}{' '}
          <button 
            type="button" 
            onClick={handleRegister} 
            className="font-medium text-indigo-600 hover:text-indigo-500 underline"
          >
            {t('auth.register')}
          </button>
        </p>
      </div>
    </form>
  );
};

export default LoginForm;