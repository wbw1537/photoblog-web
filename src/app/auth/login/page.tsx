import React from "react";

import AuthLayout from "@/components/auth/auth-layout.component";
import LoginForm from "@/components/auth/login-form.component";

const LoginPage: React.FC = () => {
  return (
    <AuthLayout title="Login">
      <LoginForm />
    </AuthLayout>
  );
};

export default LoginPage;