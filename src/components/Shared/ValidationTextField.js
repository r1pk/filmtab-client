import { useState } from 'react';
import PropTypes from 'prop-types';

import TextField from './TextField';

const ValidationTextField = ({ error, onFocus, onChange, validator, ...rest }) => {
  const [wasFocused, setWasFocused] = useState(false);

  const showError = wasFocused && error;

  const handleTextFieldFocus = (e) => {
    setWasFocused(true);
    if (onFocus) {
      onFocus(e);
    }
  };

  const handleTextFieldChange = (e) => {
    if (onChange) {
      onChange(e, validator(e.target.value));
    }
  };

  return <TextField error={showError} onFocus={handleTextFieldFocus} onChange={handleTextFieldChange} {...rest} />;
};

ValidationTextField.propTypes = {
  error: PropTypes.bool,
  onFocus: PropTypes.func,
  onChange: PropTypes.func,
  validator: PropTypes.func.isRequired,
};

export default ValidationTextField;
