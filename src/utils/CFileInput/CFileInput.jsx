/* eslint-disable react/prop-types */

const CFileInput = ({
    label,
    onChange,
    disabled = false,
    multiple = false,
    accept,
    files,
    id = '',
    ...rest
}) => {
    const handleFileChange = (e) => {
        if (e.target.files) {
            onChange?.(e);
        }
    };

    return (
        <section>
            {label && (
                <label htmlFor={label?.toLowerCase()} className="level text-sm text-gray-500">
                    {label}
                </label>
            )}
            <div className="relative w-full mt-1">
                <label
                    className={`flex items-center justify-center cursor-pointer w-full p-2 -mt-1 bg-gray-200 rounded-md hover:bg-gray-300 dark:bg-black/10 border overflow-hidden ${disabled && 'opacity-30'
                        }`}
                >
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                        {files?.length && multiple
                            ? `${files?.length} file(s) selected`
                            : multiple && files?.length === 0
                                ? 'Choose multiple files: '
                                : 'Choose a file: '}

                        {!multiple && files?.name && (
                            <span className="text-sm text-gray-500 dark:text-gray-400">{files?.name}</span>
                        )}
                    </span>
                </label>
                <input
                    id={id}
                    type="file"
                    className="absolute inset-0 opacity-0 cursor-pointer w-full"
                    onChange={handleFileChange}
                    multiple={multiple}
                    accept={accept || '*/*'}
                    disabled={disabled}
                    {...rest}
                />
            </div>
        </section>
    );
};

export default CFileInput;
