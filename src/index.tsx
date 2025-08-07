import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import logger from "redux-logger";
import { Toaster } from "react-hot-toast"; // Fixed import
import "./index.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "semantic-ui-css/semantic.min.css";
// Remove this line: "react-redux-toastr/lib/css/react-redux-toastr.min.css";
import App from "./App";
import ScrollToTop from "./Components/common/util/ScrollToTop";
import rootReducer from "./Store/Reducers/rootReducer";

// Create store with Redux Toolkit (modern approach)
const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      // Redux Toolkit includes redux-thunk by default
      thunk: true,
      serializableCheck: {
        ignoredActions: ["redux-form/ARRAY_INSERT", "redux-form/ARRAY_REMOVE"],
      },
    }).concat(logger),
  devTools: process.env.NODE_ENV !== "production",
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

const container = document.getElementById("root");
if (!container) {
  throw new Error("Root element not found");
}
const root = createRoot(container);

root.render(
  <Provider store={store}>
    <BrowserRouter>
      <ScrollToTop>
        <App />
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: "#363636",
              color: "#fff",
            },
            success: {
              duration: 3000,
              iconTheme: {
                primary: "green",
                secondary: "black",
              },
            },
          }}
        />
      </ScrollToTop>
    </BrowserRouter>
  </Provider>,
);
