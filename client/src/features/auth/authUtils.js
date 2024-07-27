import toast from "react-hot-toast";

/**
 * Sets the loading state and displays a loading toast.
 * @param {Object} state - The Redux state object.
 * @param {string} message - The loading message to display.
 */
export const setLoadingState = (state, message) => {
  state.isLoading = true;
  state.error = "";
  toast.loading(message);
};

/**
 * Sets the error state and displays an error toast.
 * @param {Object} state - The Redux state object.
 * @param {Object} action - The Redux action object.
 */
export const setErrorState = (state, action) => {
  state.isLoading = false;
  state.error = action.payload;
  toast.dismiss();
  toast.error(action.payload);
};
