import React, { useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { ToastContainer, toast } from 'react-toastify';
import Loading from '../../shared/Loading';
import ErrorWrapper from '../../shared/ErrorWrapper';
import CloseButton from '../../shared/CloseButton';

import profilePicture from '../../../Assets/Images/profilePictureWhite.png';
import loadingProfile from '../../../Assets/Images/loadingProfile.gif';
import './Profile.css';

import { useAuth } from '../../../AuthContext';

import client from '../../../services/requests.service';

const Profile = () => {
  const navigate = useNavigate();
  const { user, setUser } = useAuth();
  const [about, setAbout] = useState({ first_name: user.first_name, last_name: user.last_name });
  const [security, setSecurity] = useState({ password: '', new_password: '' });
  const [state, setState] = useState({
    warnings: {
      first_name: false,
      last_name: false,
      image: false,
      email: false,
      password: false,
    },
    submitAboutDisabled: true,
    submitSecurityDisabled: true,
    isLoading: true,
    showRemoveAccountPopup: false,
    error: null,
  });
  const fetchProfile = async () => {
    try {
      await new Promise((res) => setTimeout(res, 800));
      await client.authenticate();
      setState({ ...state, isLoading: false, error: null });
    } catch (error) {
      setState({ ...state, isLoading: false, error });
    }
  };

  useEffect(fetchProfile, []);

  const handleAboutSubmit = async (e) => {
    e.preventDefault();
    try {
      await client.updateProfile(about);
      setState({ ...state, submitAboutDisabled: true });
      setUser({ ...user, first_name: about.first_name, last_name: about.last_name });
    } catch (error) {
      toast.error(error.response?.data.messages[0]);
    }
  };

  const handleSecuritySubmit = async (e) => {
    e.preventDefault();
    try {
      await client.updateSecurity(security);
      setState({ ...state, submitSecurityDisabled: true });
      setSecurity({ password: '', new_password: '' });
      toast.success('Password changed sucsessfuly!');
    } catch (error) {
      toast.error(error.response?.data.messages[0]);
    }
  };

  const handleAboutChange = (e) => {
    setState({ ...state, submitAboutDisabled: false });
    setAbout({ ...about, [e.target.name]: e.target.value });
  };

  const handleSecurytyChange = (e) => {
    setState({ ...state, submitSecurityDisabled: false });
    setSecurity({ ...security, [e.target.name]: e.target.value });
  };

  const handleDeleteAccount = async (e) => {
    e.preventDefault();
    await client.deleteAccount();
    navigate('/');
  };

  const handleUpload = async (e) => {
    try {
      if (!e.target.value) return;
      const image = new FormData();
      image.append('profile-picture', e.target.files[0]);
      const imageName = await client.updatePhoto(image);
      setUser({ ...user, image_name: imageName });
      setState({ ...state });
    } catch (error) {
      e.target.value = '';
      toast.error(error.response?.data.messages[0]);
      setState({ ...state });
    }
  };

  const handleImageDelete = async () => {
    await client.deletePhoto();
    setUser({ ...user, image_name: null });
  };

  const handleAboutBlur = (e) => {
    if (e.target.value.trim() === '') {
      e.target.value = user[e.target.name];
    }
  };

  const toggleRemovePopupOpen = (e) => {
    if (e.target === e.currentTarget) {
      setState({ ...state, showRemoveAccountPopup: !state.showRemoveAccountPopup });
    }
  };
  return (
    <Loading isLoading={state.isLoading} src={loadingProfile} className="profile-loading">
      <ErrorWrapper error={state.error}>
        <ToastContainer autoClose={2000} position={toast.POSITION.BOTTOM_RIGHT} />
        <div className="profile bg-dark">
          <div className="profile-header">
            <div className={user.image_name ? 'profile-image' : 'default-image'}>
              <img className="rounded-circle" src={user.image_name ? `${client.HOST_NAME}/${user.image_name}` : profilePicture} />
              <div className="middle">
                <input type="file" accept="image/*" name="image" id="file" onChange={handleUpload} />
                <label htmlFor="file">Update</label>
                {user.image_name ? (
                  <button className="delete-image-btn" onClick={handleImageDelete}>
                    Delete
                  </button>
                ) : null}
              </div>
            </div>
            <div className="display-name">
              {user.first_name} {user.last_name}
            </div>
          </div>
          <div className="profile-body">
            <form className="settings" onSubmit={handleAboutSubmit}>
              <div className="settings-group">
                <div className="settings-header">About</div>
                <hr className="settings-h-line" />
                <div className="form-group">
                  <input
                    onChange={handleAboutChange}
                    onBlur={handleAboutBlur}
                    name="first_name"
                    type="text"
                    className="form-control"
                    placeholder="First Name"
                    defaultValue={user.first_name}
                    contentEditable="true"
                  />
                </div>
                <div className="form-group">
                  <input onChange={handleAboutChange} onBlur={handleAboutBlur} name="last_name" type="text" className="form-control" placeholder="Last Name" defaultValue={user.last_name} />
                </div>
                <button disabled={state.submitAboutDisabled} type="submit" className="btn btn-outline-light">
                  Save
                </button>
              </div>
            </form>
            <form className="settings" onSubmit={handleSecuritySubmit}>
              <div className="settings-group">
                <div className="settings-header">Security</div>
                <hr className="settings-h-line" />
                <div className="form-group">
                  <input name="email" type="email" className="form-control" aria-describedby="emailHelp" placeholder="Email" defaultValue={user.email} disabled="disabled" />
                </div>
                <div className="form-group">
                  <input onChange={handleSecurytyChange} value={security.password} name="password" type="password" className="form-control" placeholder="Password" />
                </div>
                <div className="form-group">
                  <input onChange={handleSecurytyChange} value={security.new_password} name="new_password" type="password" className="form-control" placeholder="New Password" />
                </div>

                <button disabled={state.submitSecurityDisabled} type="submit" className="btn btn-outline-light">
                  Change password
                </button>
                <hr className="settings-h-line" />
                <span onClick={toggleRemovePopupOpen} className="remove-account-btn">
                  Delete your account
                </span>
                {state.showRemoveAccountPopup && (
                  <div className="remove-account-popup" onClick={toggleRemovePopupOpen}>
                    <div className="remove-account-popup-content">
                      <CloseButton onClick={toggleRemovePopupOpen} />
                      <div className="delete-account-text">Are you sure that you want to permanently delete your account?</div>
                      <div className="d-flex">
                        <button onClick={toggleRemovePopupOpen} className="btn btn-light">
                          Cancel
                        </button>
                        <button className="btn btn-danger" onClick={handleDeleteAccount}>
                          Yes, delete my account
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </form>
          </div>
        </div>
      </ErrorWrapper>
    </Loading>
  );
};

export default Profile;
