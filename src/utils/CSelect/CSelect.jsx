/* eslint-disable react/prop-types */
import { useState } from 'react';
import Select, { components } from 'react-select';
import makeAnimated from 'react-select/animated';

const CSelect = ({
  name = '',
  className = '',
  id = '',
  width,
  label,
  options,
  isMulti,
  classNamePrefix,
  defaultValue,
  onChange,
  disabled,
  value,
  title,
  ...props
}) => {
  const animatedComponents = makeAnimated();
  const [selectedValue, setSelectedValue] = useState(
    options.find((item) => item?.value === value) || defaultValue || null
  );

  const Control = ({ children, ...props }) => (
    <components.Control {...props} className="text-xs pl-[5px]">
      {title} → {children}
    </components.Control>
  );

  const handleOnChange = (selectedOptions) => {
    setSelectedValue(selectedOptions);
    onChange?.(selectedOptions);
  };

  return (
    <div className="">
      <label htmlFor={label?.toLowerCase()} className="level text-sm text-gray-500">
        {label}
      </label>

      <Select
        name={name}
        id={id}
        className={`${className} ${width ? width : 'w-full'} rounded outline-none focus:ring-2 focus:ring-primary focus:border-transparent`}
        onChange={handleOnChange}
        classNamePrefix={classNamePrefix || 'select'}
        closeMenuOnSelect={true}
        components={isMulti ? animatedComponents : { Control }}
        isMulti={isMulti}
        options={options}
        defaultValue={defaultValue}
        isDisabled={disabled}
        isClearable={true}
        isSearchable={true}
        value={selectedValue}
        {...props}
        styles={{
          option: (defaultStyles) => ({
            ...defaultStyles,
            zIndex: 100,
            height: '100%',
            
          }),
          singleValue: (defaultStyles) => ({
            ...defaultStyles,
            color: '#0C5164',
            zIndex: 999,
          }),
          control: (provided, state) => ({
            ...provided,
            border: '2px solid #0C5164',
            borderRadius: '0.375rem',
            outlineColor: '#0C5164',
            opacity: state.isDisabled ? '.5' : '1',
            cursor: state.isDisabled ? 'not-allowed' : 'default',
            width: '100%',
          }),
        }}
      />
    </div>
  );
};

export default CSelect;