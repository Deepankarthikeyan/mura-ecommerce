"use client"
import { useState, useEffect } from 'react';
import Image from 'next/image';
import axios from 'axios';
import { useUser } from '@/components/header/UserContext';
import PasswordInputWithToggle from '@/components/auth/PasswordInputWithToggle';

function DemoContent() {
  const { user, isAuthenticated, isUserLoaded, updateUser } = useUser();
  
  // tab
  const [activeTab, setActiveTab] = useState<string>('tab1');
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    company: '',
    address: '',
    city: '',
    state: '',
    country: '',
    zip: '',
    orderNotes: ''
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  
  // Password form state
  const [passwordData, setPasswordData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [passwordErrors, setPasswordErrors] = useState<{[key: string]: string}>({});
  const [isPasswordLoading, setIsPasswordLoading] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState('');
  
  // Load user data when component mounts
  useEffect(() => {
    if (isUserLoaded && user) {
      const userBillingInfo = user?.billingInfo || {};
      setFormData({
        name: userBillingInfo.firstName && userBillingInfo.lastName 
          ? `${userBillingInfo.firstName} ${userBillingInfo.lastName}` 
          : user.username || '',
        phone: userBillingInfo.phone || '',
        email: user.email || '',
        company: userBillingInfo.company || '',
        address: userBillingInfo.street || '',
        city: userBillingInfo.city || '',
        state: userBillingInfo.state || '',
        country: userBillingInfo.country || '',
        zip: userBillingInfo.zip || '',
        orderNotes: userBillingInfo.orderNotes || ''
      });
    }
  }, [isUserLoaded, user]);
  
  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isAuthenticated || !user) {
      setMessage('Please log in to update your profile.');
      return;
    }
    
    setIsLoading(true);
    setMessage('');
    
    try {
      // Split name into first and last name
      const nameParts = formData.name.trim().split(' ');
      const firstName = nameParts[0] || '';
      const lastName = nameParts.slice(1).join(' ') || '';
      
      const response = await axios.put('/api/users', {
        email: user.email,
        billingInfo: {
          firstName,
          lastName,
          phone: formData.phone,
          company: formData.company,
          street: formData.address,
          city: formData.city,
          state: formData.state,
          country: formData.country,
          zip: formData.zip,
          orderNotes: formData.orderNotes
        }
      });
      
      if (response.data?.success) {
        setMessage('Profile updated successfully!');
        // Update user context with new billing info
        updateUser({
          billingInfo: {
            firstName,
            lastName,
            phone: formData.phone,
            company: formData.company,
            street: formData.address,
            city: formData.city,
            state: formData.state,
            country: formData.country,
            zip: formData.zip,
            orderNotes: formData.orderNotes
          }
        });
      } else {
        setMessage('Failed to update profile. Please try again.');
      }
    } catch (error: any) {
      console.error('Error updating profile:', error);
      setMessage(error.response?.data?.message || 'Error updating profile. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Handle password input change
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setPasswordData(prev => ({ ...prev, [id]: value }));
    // Clear error when user types
    if (passwordErrors[id]) {
      setPasswordErrors(prev => ({ ...prev, [id]: '' }));
    }
  };
  
  // Validate password form
  const validatePasswordForm = (): boolean => {
    const errors: {[key: string]: string} = {};
    
    if (!passwordData.oldPassword.trim()) {
      errors.oldPassword = 'Old password is required';
    }
    
    if (!passwordData.newPassword.trim()) {
      errors.newPassword = 'New password is required';
    } else if (passwordData.newPassword.length < 6) {
      errors.newPassword = 'Password must be at least 6 characters';
    }
    
    if (!passwordData.confirmPassword.trim()) {
      errors.confirmPassword = 'Please confirm your new password';
    } else if (passwordData.newPassword !== passwordData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }
    
    setPasswordErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  // Handle password form submission
  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isAuthenticated || !user) {
      setPasswordMessage('Please log in to change your password.');
      return;
    }
    
    if (!validatePasswordForm()) {
      return;
    }
    
    setIsPasswordLoading(true);
    setPasswordMessage('');
    
    try {
      const response = await axios.put('/api/users/change-password', {
        email: user.email,
        oldPassword: passwordData.oldPassword,
        newPassword: passwordData.newPassword
      });
      
      if (response.data?.success) {
        setPasswordMessage('Password changed successfully!');
        // Clear form
        setPasswordData({
          oldPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
      } else {
        setPasswordMessage(response.data?.message || 'Failed to change password.');
      }
    } catch (error: any) {
      console.error('Error changing password:', error);
      setPasswordMessage(error.response?.data?.message || 'Error changing password. Please verify your old password.');
    } finally {
      setIsPasswordLoading(false);
    }
  };

  return (
    <div className="profile-setting-area-main-wrapper">
      <h1 className="title">Profile Setting</h1>
      <div className="inner-profile-setting">
        <div className="left-setting-area">
          <div className="personal-info">
            {/* <div className="thumbnail-img">
              <Image 
                src="/assets/images-dashboard/avatar/02.png" 
                alt="avatar" 
                width={80} 
                height={80}
              />
            </div> */}
            <div className="infor">
              <h2 className="title">{formData.name || user?.username || 'User'}</h2>
              {/* <span className="design">Owner & Founder</span> */}
            </div>
          </div>
          <div className="tab-button-area-setting">
            <ul className="nav nav-tabs" id="myTab" role="tablist">
              <li className="nav-item" role="presentation">
                <button
                  onClick={() => setActiveTab('tab1')}
                  className={`nav-link ${activeTab === 'tab1' ? 'active' : ''}`}
                >
                  <Image 
                    src="/assets/images-dashboard/icons/11.svg" 
                    alt="Edit Profile" 
                    width={20} 
                    height={20}
                  />
                  Edit Profile
                </button>
              </li>
              {/* <li className="nav-item" role="presentation">
                <button 
                  onClick={() => setActiveTab('tab2')}
                  className={`nav-link ${activeTab === 'tab2' ? 'active' : ''}`}
                >
                  <Image 
                    src="/assets/images-dashboard/icons/12.svg" 
                    alt="Account Settings" 
                    width={20} 
                    height={20}
                  />
                  Account Settings
                </button>
              </li> */}
              <li className="nav-item" role="presentation">
                <button 
                  onClick={() => setActiveTab('tab3')}
                  className={`nav-link ${activeTab === 'tab3' ? 'active' : ''}`}
                >
                  <Image 
                    src="/assets/images-dashboard/icons/13.svg" 
                    alt="Change Password" 
                    width={20} 
                    height={20}
                  />
                  Change Password
                </button>
              </li>
              {/* <li className="nav-item" role="presentation">
                <button 
                  onClick={() => setActiveTab('tab4')}
                  className={`nav-link ${activeTab === 'tab4' ? 'active' : ''}`}
                >
                  <Image 
                    src="/assets/images-dashboard/icons/14.svg" 
                    alt="Social Profile" 
                    width={20} 
                    height={20}
                  />
                  Social Profile
                </button>
              </li> */}
              {/* <li className="nav-item" role="presentation">
                <button 
                  onClick={() => setActiveTab('tab5')}
                  className={`nav-link ${activeTab === 'tab5' ? 'active' : ''}`}
                >
                  <Image 
                    src="/assets/images-dashboard/icons/15.svg" 
                    alt="Notification" 
                    width={20} 
                    height={20}
                  />
                  Notification
                </button>
              </li> */}
            </ul>
          </div>
        </div>
        <div className="tab-content-area-user-setting">
          <div className="tab-content" id="myTabContent">
            {/* profile setting start */}
            {activeTab === 'tab1' && (
              <div>
                <div className="inner-content-setting-form">
                  <h3 className="title">Edit Profile</h3>
                  <p>Set Up Your Personal Information</p>
                  <form onSubmit={handleSubmit}>
                    {message && (
                      <div style={{
                        padding: "10px 15px",
                        marginBottom: "20px",
                        backgroundColor: message.includes('successfully') ? "#d1fae5" : "#fee2e2",
                        color: message.includes('successfully') ? "#065f46" : "#dc2626",
                        borderRadius: "6px",
                        fontSize: "14px"
                      }}>
                        {message}
                      </div>
                    )}
                    <div className="half-input-wrapper">
                      <div className="single">
                        <label htmlFor="name">Name</label>
                        <input
                          id="name"
                          type="text"
                          value={formData.name}
                          onChange={handleInputChange}
                          placeholder="Enter your name"
                          required
                        />
                      </div>
                      <div className="single">
                        <label htmlFor="phone">Phone Number</label>
                        <input 
                          id="phone" 
                          type="text" 
                          value={formData.phone}
                          onChange={handleInputChange}
                          placeholder="Enter phone number" 
                        />
                      </div>
                    </div>
                    <div className="half-input-wrapper">
                      <div className="single">
                        <label htmlFor="email">Email Address</label>
                        <input 
                          id="email" 
                          type="email" 
                          value={formData.email}
                          onChange={handleInputChange}
                          placeholder="Enter email address"
                          readOnly
                          style={{ backgroundColor: '#f3f4f6' }}
                        />
                      </div>
                      <div className="single">
                        <label htmlFor="company">Company</label>
                        <input 
                          id="company" 
                          type="text" 
                          value={formData.company}
                          onChange={handleInputChange}
                          placeholder="Enter company name" 
                        />
                      </div>
                    </div>
                    <div className="half-input-wrapper">
                      <div className="single">
                        <label htmlFor="address">Address Line</label>
                        <input 
                          id="address" 
                          type="text" 
                          value={formData.address}
                          onChange={handleInputChange}
                          placeholder="Enter street address" 
                        />
                      </div>
                      <div className="single">
                        <label htmlFor="city">City</label>
                        <input 
                          id="city" 
                          type="text" 
                          value={formData.city}
                          onChange={handleInputChange}
                          placeholder="Enter city" 
                        />
                      </div>
                    </div>
                    <div className="half-input-wrapper">
                      <div className="single">
                        <label htmlFor="state">State</label>
                        <input 
                          id="state" 
                          type="text" 
                          value={formData.state}
                          onChange={handleInputChange}
                          placeholder="Enter state" 
                        />
                      </div>
                      <div className="single">
                        <label htmlFor="country">Country</label>
                        <input 
                          id="country" 
                          type="text" 
                          value={formData.country}
                          onChange={handleInputChange}
                          placeholder="Enter country" 
                        />
                      </div>
                    </div>
                    <div className="half-input-wrapper">
                      <div className="single">
                        <label htmlFor="zip">Postal Code</label>
                        <input 
                          id="zip" 
                          type="text" 
                          value={formData.zip}
                          onChange={handleInputChange}
                          placeholder="Enter postal code" 
                        />
                      </div>
                    </div>
                    <div className="about-me-area-setting-area">
                      <label htmlFor="orderNotes">Order Notes</label>
                      <textarea
                        id="orderNotes"
                        value={formData.orderNotes}
                        onChange={handleInputChange}
                        placeholder="Any special instructions..."
                      />
                      <div className="button-area">
                        <button 
                          type="submit" 
                          className="rts-btn btn-primary"
                          disabled={isLoading}
                        >
                          {isLoading ? 'Updating...' : 'Update Profile'}
                        </button>
                        <button 
                          type="button" 
                          className="rts-btn btn-primary"
                          onClick={() => {
                            if (user?.billingInfo) {
                              setFormData({
                                name: user?.billingInfo?.firstName && user?.billingInfo?.lastName 
                                  ? `${user.billingInfo.firstName} ${user.billingInfo.lastName}` 
                                  : user.username || '',
                                phone: user?.billingInfo?.phone || '',
                                email: user.email || '',
                                company: user?.billingInfo?.company || '',
                                address: user?.billingInfo?.street || '',
                                city: user?.billingInfo?.city || '',
                                state: user?.billingInfo?.state || '',
                                country: user?.billingInfo?.country || '',
                                zip: user?.billingInfo?.zip || '',
                                orderNotes: user?.billingInfo?.orderNotes || ''
                              });
                            }
                            setMessage('');
                          }}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            )}
            
            {/* account setting start */}
            {activeTab === 'tab2' && (
              <div>
                <div className="account-setting-area-start">
                  <div className="rts--profile-picture-edit">
                    <div className="profile-left col-xl-4">
                      <div className="profile-image mb--30">
                        <h6 className="title">Change Your Profile Picture</h6>
                        <Image
                          id="rts_image"
                          src="/assets/images-dashboard/profile/profile-01.jpg"
                          alt="Profile-NFT"
                          width={150}
                          height={150}
                        />
                      </div>
                      <div className="button-area">
                        <div className="brows-file-wrapper">
                          <input name="rts_images1" id="rts_images1" type="file" />
                          <label htmlFor="rts_images1" title="No File Choosen">
                            <span className="text-center color-white">
                              Upload Profile
                            </span>
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {/* change password area start */}
            {activeTab === 'tab3' && (
              <div>
                <div className="rts-change-password-area">
                  <form onSubmit={handlePasswordSubmit} className="change-pass-form">
                    {passwordMessage && (
                      <div style={{
                        padding: "10px 15px",
                        marginBottom: "20px",
                        backgroundColor: passwordMessage.includes('successfully') ? "#d1fae5" : "#fee2e2",
                        color: passwordMessage.includes('successfully') ? "#065f46" : "#dc2626",
                        borderRadius: "6px",
                        fontSize: "14px"
                      }}>
                        {passwordMessage}
                      </div>
                    )}
                    <div className="single">
                      <label htmlFor="oldPassword">Old Password</label>
                      <PasswordInputWithToggle
                        id="oldPassword"
                        value={passwordData.oldPassword}
                        onChange={handlePasswordChange}
                        placeholder="Enter current password"
                        hasError={!!passwordErrors.oldPassword}
                      />
                      {passwordErrors.oldPassword && (
                        <span style={{ color: "#dc2626", fontSize: "13px", marginTop: "5px", display: "block" }}>
                          {passwordErrors.oldPassword}
                        </span>
                      )}
                    </div>
                    <div className="single">
                      <label htmlFor="newPassword">Create New Password</label>
                      <PasswordInputWithToggle
                        id="newPassword"
                        value={passwordData.newPassword}
                        onChange={handlePasswordChange}
                        placeholder="Enter new password (min 6 characters)"
                        hasError={!!passwordErrors.newPassword}
                      />
                      {passwordErrors.newPassword && (
                        <span style={{ color: "#dc2626", fontSize: "13px", marginTop: "5px", display: "block" }}>
                          {passwordErrors.newPassword}
                        </span>
                      )}
                    </div>
                    <div className="single">
                      <label htmlFor="confirmPassword">Confirm New Password</label>
                      <PasswordInputWithToggle
                        id="confirmPassword"
                        value={passwordData.confirmPassword}
                        onChange={handlePasswordChange}
                        placeholder="Re-enter new password"
                        hasError={!!passwordErrors.confirmPassword}
                      />
                      {passwordErrors.confirmPassword && (
                        <span style={{ color: "#dc2626", fontSize: "13px", marginTop: "5px", display: "block" }}>
                          {passwordErrors.confirmPassword}
                        </span>
                      )}
                    </div>
                    <button 
                      type="submit" 
                      className="rts-btn btn-primary"
                      disabled={isPasswordLoading}
                    >
                      {isPasswordLoading ? 'Saving...' : 'Save Changes'}
                    </button>
                  </form>
                </div>
              </div>
            )}
            
            {/* social profile area start */}
            {activeTab === 'tab4' && (
              <div>
                <form action="#" className="social-media-edit-wrapper">
                  <div className="single">
                    <label htmlFor="fb">Facebook URL</label>
                    <input
                      id="fb"
                      type="text"
                      placeholder="Facebook URL"
                    />
                  </div>
                  <div className="single">
                    <label htmlFor="twitter">twitter URL</label>
                    <input id="twitter" type="text" placeholder="twitter URL" />
                  </div>
                  <div className="single">
                    <label htmlFor="linkedin">Linkedin URL</label>
                    <input id="linkedin" type="text" placeholder="Linkedin URL" />
                  </div>
                  <button className="rts-btn btn-primary">Save Changes</button>
                </form>
              </div>
            )}
            
            {/* notification area start */}
            {activeTab === 'tab5' && (
              <div>
                <ul className="notification__items">
                  {[2, 2, 3, 4, 5, 7, 7, 8, 9, 10].map((item) => (
                    <li key={item} className="single__items">
                      <a className="single-link" href="#">
                        <div className="avatar">
                          <Image
                            src={`/assets/images-dashboard/avatar/user${item % 5 === 0 ? '' : `-${item % 5}`}.svg`}
                            alt="User"
                            width={40}
                            height={40}
                          />
                        </div>
                        <div className="main-content">
                          <h5 className="name-user">
                            MR.Crow Kader
                            <span className="time-ago">1.3 hrs ago</span>
                          </h5>
                          <div className="disc">
                            Lorem ipsum dolor amet cosec...
                            <span className="count" />
                          </div>
                        </div>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* bottom footer areas start */}
      <div className="footer-copyright">
        <div className="left">
          <p>Copyright © 2026 All Right Reserved.</p>
        </div>
        {/*
        <ul>
          <li>
            <a href="#">Terms</a>
          </li>
          <li>
            <a href="#">Privacy</a>
          </li>
          <li>
            <a href="#">Help</a>
          </li>
        </ul>
        */}
      </div>
    </div>
  );
}

export default DemoContent;