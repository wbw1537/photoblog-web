
import React from 'react';
import SelectBasePathForm from '../../../components/auth/select-base-path.component';

export default function SelectBasePath() {
  return (
    <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <SelectBasePathForm />
      </div>
    </div>
  );
}