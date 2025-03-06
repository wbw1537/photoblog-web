
import React from "react";
import { useTranslations } from 'next-intl';

import AuthLayout from "@/components/auth/auth-layout.component";
import PendingApprovalComponent from "@/components/auth/pending-approval.component";

export default function PendingPage() {
  const t = useTranslations();
  
  return (
    <AuthLayout title={t('auth.accountPending')}>
      <PendingApprovalComponent />
    </AuthLayout>
  );
}