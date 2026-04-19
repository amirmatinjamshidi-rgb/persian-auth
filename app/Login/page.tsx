import React from 'react';
 import PersianLoginLibrary from './components';

const UsageExample = () => {
  const handleAuthSuccess = (data: any) => {
    console.log('Authentication successful:', data);
  };

  const handleError = (error: string) => {
    console.error('Authentication error:', error);
  };

  return (
    <div className="example-container">
      <h2>TEST</h2>
      
      <section className="login-section">
        <h3>ورود با شماره تلفن</h3>
        <PersianLoginLibrary
          type="phone"
          onAuthSuccess={handleAuthSuccess}
          onAuthError={handleError}
          className="login-form-phone"
        />
      </section>
      
      <section className="login-section">
        <h3>ورود با نام کاربری و رمز عبور</h3>
        <PersianLoginLibrary
          type="username"
          onAuthSuccess={handleAuthSuccess}
          onAuthError={handleError}
          className="login-form-username"
        />
      </section>
    </div>
  );
};

export default UsageExample;
