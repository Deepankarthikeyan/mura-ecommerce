"use client";

import { useState } from "react";

interface PasswordInputWithToggleProps {
  id: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  hasError?: boolean;
}

export default function PasswordInputWithToggle({
  id,
  value,
  onChange,
  placeholder,
  hasError = false,
}: PasswordInputWithToggleProps) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div style={{ position: "relative", width: "100%" }}>
      <input
        id={id}
        type={showPassword ? "text" : "password"}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        style={{
          border: hasError ? "2px solid #dc2626" : "1px solid #ccc",
          width: "100%",
          padding: "12px 44px 12px 12px",
          boxSizing: "border-box",
        }}
      />
      <button
        type="button"
        onClick={() => setShowPassword((prev) => !prev)}
        aria-label={showPassword ? "Hide password" : "Show password"}
        style={{
          position: "absolute",
          top: "50%",
          right: "12px",
          transform: "translateY(-50%)",
          background: "none",
          border: "none",
          padding: 0,
          margin: 0,
          cursor: "pointer",
          color: "#666",
          fontSize: "16px",
          lineHeight: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "24px",
          height: "24px",
          minWidth: "24px",
          zIndex: 1,
        }}
      >
        <i className={showPassword ? "fa-regular fa-eye-slash" : "fa-regular fa-eye"} />
      </button>
    </div>
  );
}
