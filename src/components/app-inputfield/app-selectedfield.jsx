export const SelectField = ({ id, label, options, name, value, onChange, required = false, multiple = false  }) => (
  <div>
    <label
      htmlFor={id}
      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
    >
      {label}
    </label>
    <select
      id={id}
      name={name}
      value={value} 
      required={required}
      onChange={onChange} 
      multiple={multiple}
      className="p-2 bg-gray-50 border border-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:text-white rounded w-full focus:outline-none focus:border-gray-300"
    >
      <option value="">Select an option</option> 
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  </div>
);
