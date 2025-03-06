import React from "react";

import AuthLayout from "@/components/auth/auth-layout.component";
import RegisterForm from "@/components/auth/register-form.component";

const RegisterPage: React.FC = () => {
  return (
    <AuthLayout title="Register">
      <RegisterForm />
    </AuthLayout>
  );
};

export default RegisterPage;
