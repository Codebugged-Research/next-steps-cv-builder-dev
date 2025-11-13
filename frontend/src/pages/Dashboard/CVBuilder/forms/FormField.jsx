const FormField = ({ label, type = 'text', value, onChange, placeholder, options, rows, required, min, max }) => {
  const baseClasses = "w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#169AB4] focus:border-transparent";

  const handleChange = (e) => {
    const newValue = type === 'checkbox' ? e.target.checked : e.target.value;
    onChange(newValue);
  };

  if (type === 'textarea') {
    return (
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label> 
        <textarea
          value={value || ''}
          onChange={handleChange}
          rows={rows || 6}
          placeholder={placeholder}
          required={required}
          className={baseClasses}
        />
      </div>
    );
  }

  if (type === 'select') {
    return (
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
        <select
          value={value || ''}
          onChange={handleChange}
          required={required}
          className={baseClasses}
        >
          <option value="">Select {label}</option>
          {options?.map((option) => {
            const optionValue = typeof option === 'string' ? option : option.value;
            const optionLabel = typeof option === 'string' ? option : option.label;
            
            return (
              <option key={optionValue} value={optionValue}>
                {optionLabel}
              </option>
            );
          })}
        </select>
      </div>
    );
  }

  if (type === 'checkbox') {
    return (
      <div className="flex items-center gap-3">
        <input
          type="checkbox"
          id={label}
          checked={value || false}
          onChange={handleChange}
          className="text-[#169AB4] focus:ring-[#169AB4]"
        />
        <label htmlFor={label} className="text-sm font-medium text-gray-700">
          {label}
        </label>
      </div>
    );
  }

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <input
        type={type}
        value={value || ''}
        onChange={handleChange}
        placeholder={placeholder}
        required={required}
        min={min}
        max={max}
        className={baseClasses}
      />
    </div>
  );
};

export default FormField;