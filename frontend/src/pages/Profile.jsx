import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import SidebarNavigation from '../components/layout/SidebarNavigation';

const Profile = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [initError, setInitError] = useState('');
  const [formError, setFormError] = useState('');
  
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({ name: '', email: '', avatar: '', companyName: '' });
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get('/auth/me');
        setUser(res.data.user);
        setFormData({ name: res.data.user.name, email: res.data.user.email, avatar: res.data.user.avatar || '', companyName: res.data.user.companyName || '' });
        setLoading(false);
      } catch (err) {
        console.error(err);
        if (err.response?.status === 401) {
          navigate('/');
        } else {
          setInitError('Failed to load profile.');
          setLoading(false);
        }
      }
    };
    fetchData();
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (initError) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-error p-4 bg-error-container rounded-xl">{initError}</div>
      </div>
    );
  }

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        setFormError('File is too large. Please select an image under 2MB.');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, avatar: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    try {
      setSuccessMsg('');
      setFormError('');
      const res = await api.put('/auth/me', formData);
      // The interceptor returns { data: response.data.data, message: ... }
      setUser(res.data.user);
      setSuccessMsg('Profile updated successfully!');
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err) {
      console.error(err);
      setFormError(err.response?.data?.message || err.message || 'Failed to update profile.');
    }
  };

  return (
    <div className="font-body-md text-on-surface bg-background min-h-screen flex">
      <SidebarNavigation user={user} />

      <main className="min-h-screen flex-1 ml-64">
        <div className="max-w-container-max mx-auto px-margin-desktop py-stack-lg">
          
          <div className="mb-8">
            <h1 className="font-headline-xl text-headline-xl text-on-surface mb-4">
              Your Profile
            </h1>
            <p className="font-body-lg text-on-surface-variant max-w-xl">
              Manage your personal information and preferences.
            </p>
            {successMsg && (
              <div className="mt-4 p-4 bg-primary-container text-on-primary rounded-xl font-label-md inline-block">
                {successMsg}
              </div>
            )}
            {formError && (
              <div className="mt-4 p-4 bg-error-container text-error rounded-xl font-label-md inline-block">
                {formError}
              </div>
            )}
          </div>

          <div className="bg-white rounded-xl border border-outline-variant overflow-hidden shadow-sm max-w-3xl">
            <div className="p-8 border-b border-outline-variant bg-surface-container-low flex flex-col md:flex-row items-center gap-8">
              <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-md bg-surface-container flex items-center justify-center">
                {formData.avatar ? (
                  <img className="w-full h-full object-cover" src={formData.avatar} alt="User Profile" />
                ) : (
                  <span className="material-symbols-outlined text-6xl text-on-surface-variant">person</span>
                )}
              </div>
              <div className="text-center md:text-left">
                <h2 className="font-headline-lg text-on-surface">{user?.name}</h2>
                <p className="font-label-md text-on-surface-variant uppercase tracking-widest mt-1 mb-4">{user?.role}</p>
                <div className="relative">
                  <input 
                    type="file" 
                    id="photo-upload" 
                    accept="image/*" 
                    onChange={handlePhotoChange} 
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <button className="bg-surface-container px-6 py-2 rounded-full font-label-md hover:bg-surface-container-high transition-colors pointer-events-none">
                    Change Photo
                  </button>
                </div>
              </div>
            </div>

            <div className="p-8">
              <h3 className="font-headline-sm text-on-surface mb-6 border-b border-outline-variant/30 pb-2">Personal Information</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-[10px] font-label-md uppercase tracking-widest text-on-surface-variant mb-2">Full Name</label>
                  <input 
                    type="text" 
                    name="name"
                    value={formData.name} 
                    onChange={handleInputChange}
                    className="w-full font-body-lg text-on-surface bg-white px-4 py-3 rounded-lg border border-outline-variant focus:outline-none focus:border-primary transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-label-md uppercase tracking-widest text-on-surface-variant mb-2">Email Address</label>
                  <input 
                    type="email" 
                    name="email"
                    value={formData.email} 
                    onChange={handleInputChange}
                    className="w-full font-body-lg text-on-surface bg-white px-4 py-3 rounded-lg border border-outline-variant focus:outline-none focus:border-primary transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-label-md uppercase tracking-widest text-on-surface-variant mb-2">Company Name</label>
                  <input 
                    type="text" 
                    name="companyName"
                    value={formData.companyName || ''} 
                    onChange={handleInputChange}
                    className="w-full font-body-lg text-on-surface bg-white px-4 py-3 rounded-lg border border-outline-variant focus:outline-none focus:border-primary transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-label-md uppercase tracking-widest text-on-surface-variant mb-2">Role</label>
                  <div className="font-body-lg text-on-surface bg-surface-container-low px-4 py-3 rounded-lg border border-outline-variant capitalize">
                    {user?.role?.toLowerCase()}
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-8 border-t border-outline-variant flex justify-end gap-4">
                <button className="px-8 py-3 rounded-full font-label-md bg-surface-container text-on-surface-variant hover:bg-surface-container-high transition-colors">
                  Reset Password
                </button>
                <button 
                  onClick={handleSave}
                  className="px-8 py-3 rounded-full font-label-md bg-primary text-white hover:bg-primary-fixed transition-colors shadow-sm"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
          
        </div>
      </main>
    </div>
  );
};

export default Profile;
