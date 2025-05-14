import { Notify } from "notiflix/build/notiflix-notify-aio";

Notify.init({
  position: "center-bottom",
  distance: "100px",
  borderRadius: "12px",
  timeout: 3000,
  showOnlyTheLastOne: true,
  fontFamily: "Roboto",
  fontSize: "14px",
  closeButton: false,
  success: {
    background: "#4177f5",
    textColor: "#ffffff",
    notiflixIconColor: "rgb(255, 255, 255)",
  },
});

export function showNotifi(message) {
  Notify.success(message, {
    background: "#ff5549",
    textColor: "#fff",
  });
}

export default showNotifi;
