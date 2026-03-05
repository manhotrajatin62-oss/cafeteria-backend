import { create } from "zustand";
import { requestOtp, loginWithOtp, registerUser } from "../api/authApi";

type Name = {
  value: string;
  status: string;
  message: string;
  success: boolean;
};

type Email = {
  value: string;
  status: string;
  message: string;
  success: boolean;
};

type LoginStore = {
  showLogin: boolean;
  showLoader: boolean;

  showOtpPage: boolean;
  otp: string;
  otpTimer: number;
  isResendDisabled: boolean;
  otpInterval: any;

  hoverNameInput: boolean;
  hoverEmailInput: boolean;
  hoverOtpInput: boolean;

  name: Name;
  email: Email;

  setShowLogin: (value: boolean) => void;
  setShowLoader: (value: boolean) => void;

  setShowOtpPage: (value: boolean) => void;
  setOtp: (value: string) => void;
  startOtpTimer: () => void;
  resendOtp: () => Promise<void>;

  setHoverNameInput: (value: boolean) => void;
  setHoverEmailInput: (value: boolean) => void;
  setHoverOtpInput: (value: boolean) => void;

  goToOtpPage: () => void;

  handleNameChange: (e: any) => void;
  handleEmailChange: (e: any) => void;

  handleFormSubmit: (e: any) => Promise<void>;
  handleSubmitOtp: (e: any, navigate: any) => Promise<void>;
};

export const useLogin = create<LoginStore>((set, get) => ({
  showLogin: true,
  showLoader: false,

  showOtpPage: false,
  otp: "",
  otpTimer: 0,
  isResendDisabled: false,
  otpInterval: null,

  hoverNameInput: false,
  hoverEmailInput: false,
  hoverOtpInput: false,

  name: {
    value: "",
    status: "idle",
    message: "",
    success: false,
  },
  email: {
    value: "",
    status: "idle",
    message: "",
    success: false,
  },

  setShowLogin: (value) => set({ showLogin: value }),
  setShowLoader: (value) => set({ showLoader: value }),

  setOtp: (value) => set({ otp: value }),

  setHoverNameInput: (value) => set({ hoverNameInput: value }),
  setHoverEmailInput: (value) => set({ hoverEmailInput: value }),
  setHoverOtpInput: (value) => set({ hoverOtpInput: value }),

  setShowOtpPage: (value) => {
    set({ showOtpPage: value });

    if (value) {
      get().startOtpTimer();
    } else {
      const interval = get().otpInterval;
      if (interval) clearInterval(interval);
      set({ otpTimer: 0, isResendDisabled: false, otpInterval: null });
    }
  },

  startOtpTimer: () => {
    const existing = get().otpInterval;
    if (existing) clearInterval(existing);

    set({
      otpTimer: 120,
      isResendDisabled: true,
    });

    const interval = setInterval(() => {
      const { otpTimer } = get();

      if (otpTimer <= 1) {
        clearInterval(interval);
        set({
          otpTimer: 0,
          isResendDisabled: false,
          otpInterval: null,
        });
      } else {
        set({ otpTimer: otpTimer - 1 });
      }
    }, 1000);

    set({ otpInterval: interval });
  },

  resendOtp: async () => {
    const state = useLogin.getState();

    try {
      set({ showLoader: true });
      await requestOtp(state.email.value);
      set({ showLoader: false });
      get().startOtpTimer();
    } catch (error: any) {
      set({ showLoader: false });
      console.error("API Error:", error.response?.data || error.message);
    }
  },

  goToOtpPage: () => {
    set({ showOtpPage: true });
  },

  handleNameChange: (e) => {
    const nameRegex = /^[A-Za-z]{3,}(?:[ '-][A-Za-z]+)*$/;
    const name = e.target.value;

    if (!name.trim()) {
      return set({
        name: {
          value: name,
          status: "error",
          message: "Name is required",
          success: false,
        },
      });
    }

    if (!nameRegex.test(name)) {
      return set({
        name: {
          value: name,
          status: "error",
          message: "Name is incorrect",
          success: false,
        },
      });
    }

    return set({
      name: {
        value: name,
        status: "idle",
        message: "",
        success: true,
      },
    });
  },

  handleEmailChange: (e) => {
    const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
    const value = e.target.value;

    if (!value.trim()) {
      return set({
        email: {
          value,
          status: "error",
          message: "Email is required",
          success: false,
        },
      });
    }

    if (!emailRegex.test(value)) {
      return set({
        email: {
          value,
          status: "error",
          message: "Email is incorrect",
          success: false,
        },
      });
    }

    return set({
      email: {
        value,
        status: "idle",
        message: "",
        success: true,
      },
    });
  },

  handleFormSubmit: async (e) => {
    e.preventDefault();

    const state = useLogin.getState();

    if (state.showLogin) {
      if (!state.email.value.trim()) {
        set({
          email: {
            ...state.email,
            success: false,
            message: "Email is required",
            status: "error",
          },
        });
        return;
      }

      if (!state.email.success) return;

      try {
        set({ showLoader: true });
        await requestOtp(state.email.value);
        set({ showLoader: false });
        state.goToOtpPage();
      } catch (error: any) {
         set({ showLoader: false });
        console.error("API Error:", error.response?.data || error.message);
      }

      return;
    }

    if (!state.name.value.trim()) {
      set({
        name: {
          ...state.name,
          success: false,
          message: "Name is required",
          status: "error",
        },
      });
    }

    if (!state.email.value.trim()) {
      set({
        email: {
          ...state.email,
          success: false,
          message: "Email is required",
          status: "error",
        },
      });
      return;
    }

    const updatedState = useLogin.getState();

    if (!updatedState.email.success || !updatedState.name.success) return;

    try {
      set({ showLoader: true });
      await registerUser(updatedState.name.value, updatedState.email.value);
      setTimeout(() => {
        set({ showLoader: false, showLogin: true });
        set({
          name: {
            value: "",
            success: false,
            message: "",
            status: "idle",
          },
          email: {
            ...state.email,
            success: true,
            message: "",
            status: "idle",
          },
        });
      }, 1000);
    } catch (error: any) {
      console.error("API Error:", error.response?.data || error.message);
      setTimeout(() => {
        set({ showLoader: false, showLogin: false });
      }, 500);
    }
  },

  handleSubmitOtp: async (e, navigate) => {
    e.preventDefault();

    const state = useLogin.getState();

    try {
      set({ showLoader: true });
      const res = await loginWithOtp(state.email.value, state.otp);

      set({ showLoader: false });
      const { data } = res.data;

      localStorage.setItem("user", JSON.stringify({token : data.token, ...data.user}));
      navigate("/");
    } catch (error: any) {
       set({ showLoader: false });
      console.error("API Error:", error.response?.data || error.message);
    }
  },
}));
