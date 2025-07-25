import type { Middleware } from '@reduxjs/toolkit';

import { isRejectedWithValue } from '@reduxjs/toolkit';

import { toast } from 'sonner';

export const rtkQueryErrorLogger: Middleware = () => (next) => (action) => {
  if (isRejectedWithValue(action)) {
    const payload = action.payload as {
      status?: number;
      data?: { message?: string };
    };
    const statusCode = payload?.status;
    const message = payload?.data?.message;

    if (statusCode !== 401) toast.error(message || 'Có lỗi xảy ra trong quá trình xử lý yêu cầu');
  }

  return next(action);
};
