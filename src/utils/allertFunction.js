import Swal from "sweetalert2";

//success
export const successAlert = ({ title, text,timer, ...rest }) => {
  return Swal.fire({
    icon: "success",
    title: title || "Success",
    text: text || "Successfully Done",
    timer: timer || 4000,
    timerProgressBar: true,
    ...rest,
  });
};

//error
export const errorAlert = ({ title, text, ...rest }) => {
  return Swal.fire({
    icon: "error",
    title: title || "Error",
    text: text || "Something went wrong",
    ...rest,
  });
};

//warning

export const warningAlert = ({
  title,
  text,
  input,
  html,
  preConfirm,
  cancelButtonText,
  confirmButtonText,
  ...rest
}) => {
  return Swal.fire({
    icon: "warning",
    title: title || "Warning",
    text: text || "Something went wrong",
    cancelButtonText: cancelButtonText || "Cancel",
    confirmButtonText: confirmButtonText || "Confirm",
    showCancelButton: true,
    showLoaderOnConfirm: true,
    input: input,
    preConfirm: preConfirm,
    html: html,
    ...rest,
  });
};
