export const TextAreaField = ({
    id,
    label,
    placeholder = "",
    required = false,
    value,
    onChange,
    name,
    rows = 4,
  }) => {
    return (
      <div className="mb-4">
        <label
          htmlFor={id}
          className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
        >
          {label}
        </label>
        <textarea
          id={id}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          rows={rows}
          className="p-2 bg-gray-50 border border-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:text-white rounded w-full focus:outline-none focus:border-gray-300"
        />
      </div>
    );
  };
  