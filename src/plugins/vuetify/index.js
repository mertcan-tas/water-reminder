import { createVuetify } from "vuetify";
import "vuetify/styles";
import "@mdi/font/css/materialdesignicons.css";

export default createVuetify({
  theme: {
    defaultTheme: "light",
    themes: {
      light: {
        colors: {
          background: "#f4f5fa",
          surface: "#f9f9f9",
          primary: "#4177f5",
          secondary: "#03dac6",
          error: "#f44336",
          info: "#2196F3",
          success: "#4caf50",
          warning: "#fb8c00",
        },
      },
      dark: {
        colors: {
          background: "#15202b",
          surface: "#15202b",
          primary: "#4177f5",
          secondary: "#03dac6",
          error: "#f44336",
          info: "#2196F3",
          success: "#4caf50",
          warning: "#fb8c00",
        },
      },
    },
  },
});
