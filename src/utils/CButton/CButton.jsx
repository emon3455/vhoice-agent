/* eslint-disable react/prop-types */

const CButton = ({
  circle,
  customClass,
  className,
  fullWidth,
  fontSize,
  gap,
  fontStyle,
  type,
  textUpperCased,
  children,
  disabled,
  color,
  variant,
  onClick,
  loading,
  paddingNone,
  ...rest
}) => {
  return (
    <button
      className={
        customClass
          ? customClass
          : ` ${className} ${
              paddingNone ? "p-2" : "md:px-3 md:py-2  px-2 py-1"
            } 
            ${circle ? "rounded-full" : "rounded-sm"}
            ${fontSize ? fontSize : "text-[0.75rem] sm:text-sm"}
            ${fontStyle ? fontStyle : "font-semibold"}
            transition-all
            flex
            items-center
            justify-center
            ${gap ? gap : "gap-1"}
            ring-1
            ring-transparent
            focus:outline-none
            focus:ring-2
            focus:ring-secondary
            focus:ring-opacity-50

            ${fullWidth ? "w-full" : ""} 
            ${textUpperCased ? "uppercase" : ""}
            ${
              disabled || loading
                ? `opacity-50 cursor-not-allowed hover:opacity-70 
                hover:cursor-not-allowed hover:text-black`
                : "cursor-pointer"
            }

            ${
              variant === "text"
                ? `bg-transparent ${
                    color ? color : "text-primary"
                  } `
                : ""
            }
            ${
              variant === "contained"
                ? `${color ? color : "bg-primary text-black hover:opacity-90 transition-all duration-500"}
                  ${circle ? "rounded-full" : "rounded-none"} `
                : ""
            }

            ${
              variant === "outline"
                ? `${
                    color
                      ? color
                      : "border-[0.0625rem] border-secondary text-secondary hover:bg-secondary rounded-md hover:text-white transition-all duration-500"
                  }
              
             hover:bg-secondary/90 `
                : ""
            }

            ${
              variant === "solid"
                ? `${color ? color : "bg-secondary text-black"}
                  hover:opacity-90
                  transition-all
                  duration-500
                  `
                : ""
            }
            `
      }
      onClick={onClick}
      style={
        {
          // Your style modifications go here if needed
        }
      }
      type={type}
      disabled={disabled || loading}
      {...rest}
    >
      {loading && (
        <svg
          className="animate-spin h-5 w-5 mx-auto"
          viewBox="0 0 24 24"
          fill="none"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
          ></path>
        </svg>
      )}
      {!loading && children}
    </button>
  );
};

export default CButton;