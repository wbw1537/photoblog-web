'use client'

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

import { authApi } from '../../lib/api/auth.api';
import { RegisterData } from '../../types/auth.type';

const RegisterForm: React.FC = () => {
  const [formData, setFormData] = useState<RegisterData>({ name: '', email: '', password: '' });
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await authApi.register(formData);
      console.log('Registered:', response.data);
      router.push('/auth/login'); // Redirect to login after successful registration
    } catch (error) {
      console.error('Registration failed:', error);
    }
  };

  const handleLogin = (e: React.MouseEvent) => {
    e.preventDefault();
    router.push('/auth/login');
  };

  return (
    <form onSubmit={handleSubmit} className='space-y-6'>
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
          User Name
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
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
          Email
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
          Password
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
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Register
        </button>
      </div>
      <div className="text-center text-sm">
        <p className="text-gray-600">
          Already have an account?{' '}
          <button 
            type="button" 
            onClick={handleLogin} 
            className="font-medium text-indigo-600 hover:text-indigo-500 underline"
          >
            Login
          </button>
        </p>
      </div>
    </form>
  );
};

export default RegisterForm;
