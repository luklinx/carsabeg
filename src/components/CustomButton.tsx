"use client";

import Image from "next/image";
import React from "react";

import { CustomButtonProps } from "@/types";

const CustomButton = React.forwardRef<HTMLButtonElement, CustomButtonProps>(
  (
    {
      isDisabled,
      btnType,
      containerStyles,
      textStyles,
      title,
      rightIcon,
      handleClick,
      children,
      ...rest
    },
    ref
  ) => (
    <button
      {...rest}
      ref={ref}
      disabled={isDisabled ?? (rest as any).disabled}
      type={(btnType as any) || (rest as any).type || "button"}
      className={`custom-btn ${containerStyles || ""}`}
      onClick={handleClick}
    >
      {children ? (
        children
      ) : (
        <>
          <span className={`flex-1 ${textStyles || ""}`}>{title}</span>
          {rightIcon && (
            <div className="relative w-6 h-6">
              <Image
                src={rightIcon}
                alt="icon"
                fill
                className="object-contain"
              />
            </div>
          )}
        </>
      )}
    </button>
  )
);

CustomButton.displayName = "CustomButton";

export default CustomButton;
