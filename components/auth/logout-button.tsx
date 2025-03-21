"use client";

import { logout } from "@/actions/logut";

interface LogoutButtonProps {
  children?: React.ReactNode;
}

export const LogoutButton = ({ children }: LogoutButtonProps) => {
  const onClick = () => {
    logout();
  };

  return (
    <span onClick={onClick} className="cursor-pointer flex items-center justify-around">
      {children}
    </span>
  );
};
