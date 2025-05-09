/* eslint-disable react/prop-types */

const CInput = ({
  type = 'text',
  id = '',
  name = '',
  placeholder = '',
  className = '',
  value,
  textColor,
  onChange,
  label,
  disabled = false,
  defaultValue,
  endIcon,
  width = 'w-full',
  ...rest
}) => {
  return (
    <div className="">
      <label htmlFor={label?.toLowerCase()} className="level text-sm text-gray-500">
        {label}
      </label>
      <div className="relative flex">
        <input
          type={type}
          name={name}
          id={id}
          autoComplete="off"
          placeholder={placeholder || label}
          defaultValue={defaultValue}
          className={`${className} ${width} border-2  rounded px-3 py-[5px] outline-none focus:ring-2 focus:ring-primary  focus:border-transparent ${textColor ? textColor : 'text-black'} ${
            disabled ? 'opacity-20' : ''
          }`}
          value={value}
          onChange={onChange}
          disabled={disabled}
          {...rest}
        />
        {endIcon && (
          <div className="absolute inset-y-0 right-0 flex items-center pr-2 text-xl z-50 cursor-pointer">
            {endIcon}
          </div>
        )}
      </div>
    </div>
  );
};

export default CInput;
