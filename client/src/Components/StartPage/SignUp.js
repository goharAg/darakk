import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../AuthContext';
import validate from '../../helpers/validators';
import LoadingButton from '../shared/LoadingButton';

import Warning from './Warning';

const SignUp = () => {
  const signUpForm = useRef(null);

  const { handleSignup } = useAuth();
  let timeOutId = null;
  const [state, setState] = useState({
    form: {
      first_name: '',
      last_name: '',
      email: '',
      password: '',
    },
    warnings: {
      first_name: '',
      last_name: '',
      email: '',
      password: '',
      // confirmPassword: '', // TO DO: add confirm password
    },
    submitDisabled: true,
    isLoading: false,
    error: '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setState({ ...state, isLoading: true });
      const success = await handleSignup(state.form);
      if (!success) {
        setState({ ...state, error: 'Email must be unique', isLoading: false });
      }
    } catch (error) {}
  };

  const handleChange = (e) => {
    clearTimeout(timeOutId);
    timeOutId = setTimeout(() => {
      const inputType = e.target.name;
      const inputValue = e.target.value;

      const newState = {
        ...state,
        form: { ...state.form, [inputType]: inputValue },
        submitDisabled: inputValue === '' ? true : state.submitDisabled,
      };

      const validationMessage = validate(inputType, inputValue);

      newState.warnings[inputType] = validationMessage;
      newState.submitDisabled = validationMessage.length > 0 ? true : newState.submitDisabled;

      const formElement = signUpForm.current;

      const inputs = Array.from(formElement.getElementsByTagName('input'));
      const warningsArr = Object.values(newState.warnings);

      const anyEmptyInputs = inputs.some((input) => input.value.length === 0); // check for empty inputs in form
      const anyWarnings = warningsArr.some((warning) => warning.length > 0); // check for warnings in form

      newState.submitDisabled = anyEmptyInputs || anyWarnings; // if any inputs are empty or there are warnings, disable submit button

      setState(newState);
    }, 300);
  };

  return (
    <div className="form-container">
      <h4 className="form-title">Sign Up to Almost Trello</h4>
      {state.error && <p className="signin-error">{state.error}</p>}
      <form ref={signUpForm} className="signinout" onSubmit={handleSubmit}>
        <div className="form-group">
          <input onChange={handleChange} name="first_name" type="text" className="form-control" placeholder="First Name" />
          {state.warnings.first_name && <Warning text={state.warnings.first_name} />}
        </div>
        <div className="form-group">
          <input onChange={handleChange} name="last_name" type="text" className="form-control" placeholder="Last Name" />
          {state.warnings.last_name && <Warning text={state.warnings.last_name} />}
        </div>
        <div className="form-group">
          <input onChange={handleChange} name="email" type="email" className="form-control" aria-describedby="emailHelp" placeholder="Email" />
          {state.warnings.email && <Warning text={state.warnings.email} />}
        </div>
        <div className="form-group">
          <input onChange={handleChange} name="password" type="password" className="form-control" placeholder="Password" />
          {state.warnings.password && <Warning text={state.warnings.password} />}
        </div>
        <LoadingButton key={state.isLoading} disabled={state.submitDisabled} loading={state.isLoading} type="submit" text="Sign Up" className="submit-btn" />
      </form>
      <div className="switch">
        <hr className="seperator" />
        <span>Already have an account? </span>
        <Link to="/signin">Sign in</Link>
      </div>
    </div>
  );
};

export default SignUp;
