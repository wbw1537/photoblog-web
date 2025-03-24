import React from "react";

import AuthLayout from "@/components/auth/auth-layout.component";
import LoginForm from "@/components/auth/login-form.component";

import { useTranslations } from 'next-intl';

const LoginPage: React.FC = () => {
  const t = useTranslations();

  return (
    <AuthLayout title={t('auth.login')}>
      <LoginForm />
    </AuthLayout>
  );
};

export default LoginPage;