import { forwardRef } from "react";

const CustomInput = forwardRef(({ labelName, id, name, type, isRequired, value, onChange, error }, ref) => {
  return (
    <>
      <label className="block text-md text-gray-700 font-normal mb-1" htmlFor={id}>
        {labelName}
      </label>
      <input
        id={id}
        name={name}
        type={type}
        required={isRequired}
        ref={ref}
        value={value} // Change from 'values' to 'value'
        onChange={onChange}
        className={`${error && 'ring-red-400'} tracking-wide font-sans text-md font-normal shadow border border-gray-300 rounded w-full h-11 
        py-1 px-3 text-gray-700 focus:shadow-outline focus:outline-none focus:ring-2 ring-cgreen ring-offset-2`}
      />
    </>
  );
});

export default CustomInput;
