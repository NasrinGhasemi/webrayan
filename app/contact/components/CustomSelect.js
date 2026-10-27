import { FaChevronDown } from 'react-icons/fa';

const CustomSelect = ({ value, onChange, name, children }) => {
  return (
    <div className="relative w-full">
      <select
        value={value}
        onChange={onChange}
        name={name}
        className="w-full px-4 py-3.5 text-blue-700 bg-white border border-blue-200 rounded-lg
                   focus:border-blue-500 focus:ring-2 focus:ring-blue-100
                   transition-all duration-200 appearance-none cursor-pointer
                   hover:border-blue-300"
      >
        {children}
      </select>
      <FaChevronDown
        className="absolute left-4 top-1/2 transform -translate-y-1/2 text-blue-500 pointer-events-none text-sm"
      />
    </div>
  );
};

export default CustomSelect;
