import React, { ReactNode } from "react";

interface FormInputContainerProps {
  children: ReactNode;
  className?: string;
  columns?: 1 | 2 | 3;
  withSpacing?: boolean;
}

const FormInputContainer: React.FC<FormInputContainerProps> = ({
  children,
  className = "",
  columns = 2,
  withSpacing = true,
}) => {
  const getColumnsClass = () => {
    switch (columns) {
      case 1:
        return "grid-cols-1";
      case 2:
        return "grid-cols-1 md:grid-cols-2";
      case 3:
        return "grid-cols-1 md:grid-cols-2 lg:grid-cols-3";
      default:
        return "grid-cols-1 md:grid-cols-2";
    }
  };

  return (
    <div
      className={`grid ${getColumnsClass()} gap-x-12 gap-y-8 items-start ${
        withSpacing ? "mb-16" : ""
      } ${className}`.trim()}>
      {children}
    </div>
  );
};

export default FormInputContainer;
