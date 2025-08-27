import React, { useState } from "react";
import Swal from "sweetalert2";

const SetPasswordForm: React.FC = () => {
  const [password, setPassword] = useState<string>("");
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const showSetPasswordForm = () => {
    Swal.fire({
      title: "Set New Password",
      html: `
        <input type="password" id="password" class="swal2-input" placeholder="New Password">
      `,
      confirmButtonText: "Save Password",
      focusConfirm: false,
      didOpen: () => {
        const popup = Swal.getPopup();
        const passwordInput =
          popup?.querySelector<HTMLInputElement>("#password");

        if (passwordInput) {
          passwordInput.addEventListener("input", (e: Event) => {
            const target = e.target as HTMLInputElement;
            setPassword(target.value);
          });

          passwordInput.addEventListener("keyup", (e: KeyboardEvent) => {
            if (e.key === "Enter") Swal.clickConfirm();
          });
        }
      },
      preConfirm: () => {
        return { password };
      },
    }).then((result) => {
      if (result.isConfirmed) {
        console.log("New Password Set:", result.value.password);
        Swal.fire("Success!", "Your password has been updated.", "success");
      }
    });
  };

  return <button onClick={showSetPasswordForm}>Set Password</button>;
};

export default SetPasswordForm;
