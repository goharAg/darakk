import React, { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../AuthContext';

import LoadingButton from '../shared/LoadingButton';

const SignIn = () => {
  const signInForm = useRef(null);

  const [state, setState] = useState({
    form: {
      email: '',
      password: '',
    },
    submitDisabled: true,
    error: null,
  });
  const [isLoading, setIsLoading] = useState(false);
  const { handleLogin } = useAuth();

  const handleChange = (e) => {
    const formElement = signInForm.current;
    const inputs = Array.from(formElement.getElementsByTagName('input'));
    const anyInputsEmpty = inputs.some((input) => input.value.length === 0);
    const newForm = { ...state.form };
    newForm[e.target.name] = e.target.value;
    setState({ ...state, form: newForm, submitDisabled: anyInputsEmpty });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setIsLoading(true);

      const success = await handleLogin(state.form);
      if (!success) {
        setState({ ...state, error: 'Invalid email or password' });
        setIsLoading(false);
      }
    } catch (error) {}
  };

  return (
    <div className="form-container">
      <h4 className="form-title">Sign In to Almost Trello</h4>
      {state.error && <p className="signin-error">{state.error}</p>}
      <form ref={signInForm} onSubmit={handleSubmit} className="signinout">
        <div className="form-group">
          <input onChange={handleChange} name="email" type="email" className="form-control" aria-describedby="emailHelp" placeholder="Email" />
        </div>
        <div className="form-group">
          <input onChange={handleChange} name="password" type="password" className="form-control" placeholder="Password" />
        </div>
        <LoadingButton key={isLoading} disabled={state.submitDisabled} loading={isLoading} type="submit" text="Sign In" className="submit-btn" />
      </form>

      <div className="switch">
        <hr className="seperator" />
        <span>Don't have an account? </span>
        <br />
        <Link to="/signup">Sign up</Link>
      </div>
    </div>
  );
};

export default SignIn;
