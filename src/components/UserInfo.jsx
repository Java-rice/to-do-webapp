import React, { useState, useEffect, useRef } from 'react';
import './components.css';

const UserInfo = () => {
  const [isEditingName, setIsEditingName] = useState(false);
  const [isEditingMotto, setIsEditingMotto] = useState(false);
  const [name, setName] = useState('');
  const [motto, setMotto] = useState('');
  const [originalName, setOriginalName] = useState('');
  const [originalMotto, setOriginalMotto] = useState('');
  const [currentTime, setCurrentTime] = useState('');
  const [currentDate, setCurrentDate] = useState('');
  const [profilePic, setProfilePic] = useState('');
  const [file, setFile] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    fetchUserData();
    
    const updateTimeAndDate = () => {
      const now = new Date();
      const hours24 = now.getHours();
      const minutes = now.getMinutes().toString().padStart(2, '0');
      const seconds = now.getSeconds().toString().padStart(2, '0');
      const date = now.toLocaleDateString();
      
      const hours12 = hours24 % 12 || 12;
      const ampm = hours24 >= 12 ? 'PM' : 'AM';
      const time = `${hours12.toString().padStart(2, '0')}:${minutes}:${seconds} ${ampm}`;

      setCurrentTime(time);
      setCurrentDate(date);
    };

    const intervalId = setInterval(updateTimeAndDate, 1000);
    updateTimeAndDate(); 

    return () => clearInterval(intervalId); 
  }, []);

  const fetchUserData = () => {
    fetch('http://localhost:5000/user')
      .then(response => response.json())
      .then(data => {
        setName(data.name);
        setMotto(data.motto);
        setOriginalName(data.name);
        setOriginalMotto(data.motto);
        setProfilePic(data.profilePic || ''); // Use empty string if no profile pic
      });
  };

  const handleNameClick = () => setIsEditingName(true);

  const handleMottoClick = () => setIsEditingMotto(true);

  const handleNameChange = (e) => setName(e.target.value);

  const handleMottoChange = (e) => setMotto(e.target.value);

  const handleNameBlur = () => {
    if (name !== originalName || motto !== originalMotto) {
      fetch('http://localhost:5000/user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, motto, profilePic }),
      })
      .then(response => response.json())
      .then(data => {
        console.log('Update response:', data);
        setOriginalName(name);
        setOriginalMotto(motto);
      })
      .catch(error => console.error('Error:', error));
    }
    setIsEditingName(false);
  };

  const handleMottoBlur = () => {
    if (motto !== originalMotto || name !== originalName) {
      fetch('http://localhost:5000/user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, motto, profilePic }),
      })
      .then(response => response.json())
      .then(data => {
        console.log('Update response:', data);
        setOriginalName(name);
        setOriginalMotto(motto);
      })
      .catch(error => console.error('Error:', error));
    }
    setIsEditingMotto(false);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePic(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFileUpload = () => {
    if (file) {
      const formData = new FormData();
      formData.append('profilePic', file);

      fetch('http://localhost:5000/upload', {
        method: 'POST',
        body: formData,
      })
      .then(response => response.json())
      .then(data => {
        console.log('File upload response:', data);
        setProfilePic(data.profilePicUrl);
        fetchUserData(); // Re-fetch user data to update the profile picture URL
      })
      .catch(error => console.error('Error:', error));
    }
  };

  const handleProfilePicClick = () => {
    fileInputRef.current.click();
  };

  useEffect(() => {
    if (file) {
      handleFileUpload();
    }
  }, [file]);

  return (
    <div className="info">
      <div>
        {isEditingName ? (
          <input
            type="text"
            value={name}
            onChange={handleNameChange}
            onBlur={handleNameBlur}
            autoFocus
            placeholder="Input your name"
          />
        ) : (
          <h3 onClick={handleNameClick}>{name || "Input your name"}</h3>
        )}
        {isEditingMotto ? (
          <input
            type="text"
            value={motto}
            onChange={handleMottoChange}
            onBlur={handleMottoBlur}
            autoFocus
            placeholder="Input your favorite quote in life"
          />
        ) : (
          <h4 onClick={handleMottoClick}>{motto || "Input your favorite quote in life"}</h4>
        )}
        <p>{currentTime}</p>
        <p>{currentDate}</p>
      </div>
      <div>
        <input 
          type="file" 
          accept="image/*" 
          style={{ display: 'none' }} 
          ref={fileInputRef}
          onChange={handleFileChange} 
        />
        <div className="profile-pic-container" onClick={handleProfilePicClick}>
          {profilePic ? (
            <img 
              src={profilePic} 
              alt="Profile" 
              className="profile-pic" 
            />
          ) : (
            <div className="profile-pic-placeholder">
              <span>+</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserInfo;
