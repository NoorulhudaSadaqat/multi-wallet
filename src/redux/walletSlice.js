import { createSlice } from '@reduxjs/toolkit';

export const walletSlice = createSlice({
    name: 'wallet',
    initialState: {
        isConnected: false,
        address: null,
        error: null,
    },
    reducers: {
        connectWallet: (state, action) => {
            state.isConnected = true;
            state.address = action.payload.address;
        },
        disconnectWallet: (state) => {
            state.isConnected = false;
            state.address = null;
        },
        walletError: (state, action) => {
            state.error = action.payload.error;
        },
    },
});

export const { connectWallet, disconnectWallet, walletError } = walletSlice.actions;
export default walletSlice.reducer;
