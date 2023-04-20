// SweetAlert
// eslint-disable-next-line no-undef
const alertError = Swal.mixin({
  title: "Error",
  confirmButtonColor: "#C44021",
  position: "center",
  heightAuto: false,
  width: "350px",
  timer: 2000,
});

// eslint-disable-next-line no-undef
const Toast = Swal.mixin({
  toast: true,
  showConfirmButton: false,
  timer: 1500,
  timerProgressBar: true,
  position: "bottom-end",
  didOpen: (toast) => {
    // eslint-disable-next-line no-undef
    toast.addEventListener("mouseenter", Swal.stopTimer);
    // eslint-disable-next-line no-undef
    toast.addEventListener("mouseleave", Swal.resumeTimer);
  },
});
export { alertError, Toast };
