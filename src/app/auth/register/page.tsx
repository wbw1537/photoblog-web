import React from "react";
import { useTranslations } from 'next-intl';

import AuthLayout from "@/components/auth/auth-layout.component";
import RegisterForm from "@/components/auth/register-form.component";

const RegisterPage: React.FC = () => {
  const t = useTranslations();
  
  return (
    <AuthLayout title={t('auth.register')}>
      <RegisterForm />
    </AuthLayout>
  );
};

export default RegisterPage;
