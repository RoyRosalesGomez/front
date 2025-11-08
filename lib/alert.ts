"use client";

import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);

export const alert = {
  success: (title: string, text?: string) =>
    MySwal.fire({
      icon: "success",
      title,
      text,
      timer: 1800,
      showConfirmButton: false,
    }),

  error: (title: string, text?: string) =>
    MySwal.fire({ icon: "error", title, text }),

  info: (title: string, text?: string) =>
    MySwal.fire({ icon: "info", title, text }),

  confirm: async (title: string, text?: string) => {
    const res = await MySwal.fire({
      title,
      text,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Sí",
      cancelButtonText: "No",
    });
    return res.isConfirmed;
  },
};
