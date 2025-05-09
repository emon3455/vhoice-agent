/* eslint-disable react/prop-types */

const CTextArea = ({
  id = '',
  name = '',
  placeholder = '',
  className = '',
  onChange,
  label,
  disabled = false,
  defaultValue,
  width = 'w-full',
  height = 'h-20',
  ...rest
}) => {
  return (
    <div>
      {label && (
        <label htmlFor={label.toLowerCase()} className="level text-sm text-gray-500">
          {label}
        </label>
      )}
      <textarea
        id={id}
        className={`${className} ${width} ${height} border-2 border-dark-primary rounded-md px-3 py-2 outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${
          disabled ? 'opacity-20 cursor-not-allowed' : ''
        }`}
        name={name}
        placeholder={placeholder}
        defaultValue={defaultValue}
        onChange={onChange}
        disabled={disabled}
        {...rest}
      ></textarea>
    </div>
  );
};

export default CTextArea;
