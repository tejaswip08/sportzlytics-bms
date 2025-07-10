// Styles
import "@mdi/font/css/materialdesignicons.css";
import "vuetify/styles";

// Vuetify
import { createVuetify } from "vuetify";

export default createVuetify({
  theme: {
    defaultTheme: "customTheme",
    themes: {
      customTheme: {
        dark: false, // Set to true for a dark theme
        colors: {
          primary: "#0981c5",
          // secondary: "#FFC107",
          // success: "#4CAF50",
          // error: "#FF5252",
        },
      },
    },
  },
});
