import { getClientCookie } from '@/lib/jsCookies';
import constants from '@/settings/constant';
import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';

export interface BookingState {
  access_token?: string | null;
  refresh_token?: string | null;
}

const initialState: BookingState = {
  access_token: getClientCookie(constants.ACCESS_TOKEN),
  refresh_token: getClientCookie(constants.REFRESH_TOKEN),
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAccessToken: (state, action: PayloadAction<string | null>) => {
      state.access_token = action.payload;
    },
    setRefreshToken: (state, action: PayloadAction<string | null>) => {
      state.refresh_token = action.payload;
    },
    clearTokens: (state) => {
      state.access_token = null;
      state.refresh_token = null;
    },
  },
});

// Action creators are generated for each case reducer function
export const { setAccessToken, setRefreshToken } = authSlice.actions;

export default authSlice.reducer;
