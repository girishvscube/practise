import React from 'react';

interface Props {
  placeholder?: string
  id?: string
  name?: string
  rows: number
  className?: string
  value?: string
  error?: boolean
  handleChange?: any
  helperText?: string
}
const TextArea: React.FC<Props> = ({
  placeholder,
  id,
  name,
  rows,
  className,
  value,
  error,
  handleChange,
  helperText,
}) => (
  <div className="relative">
    <textarea
      className={`mb-3 w-full border border-border  bg-transparent rounded-lg  text-white p-4 placeholder-placeholder focus:outline focus:outline-themetext placeholder:text-textgray focus:border-yellow hover:border-white ${className}  ${
        error && 'border-errortext placeholder:text-errortext'
      }`}
      name={name}
      id={id}
      rows={rows}
      value={value}
      onChange={handleChange}
      placeholder={placeholder}
    />
    {helperText && <p className="absolute -bottom-1 ml-4 text-errortext text-xs">{helperText}</p>}
  </div>
);

export default TextArea;

TextArea.defaultProps = {
  placeholder: '',
  id: '',
  name: '',
  className: '',
  value: '',
  error: false,
  handleChange: function test() {},
  helperText: '',
};
