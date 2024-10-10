import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from './Navbar';

const Profile = () => {
  const [imagePreview, setImagePreview] = useState(null);
  const [file, setFile] = useState(null);
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null); 

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(function(position) {
      setLatitude(position.coords.latitude);
      setLongitude(position.coords.longitude);
      console.log("Latitude is :", position.coords.latitude);
      console.log("Longitude is :", position.coords.longitude);
    })
  },[])

  const handleImageChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(selectedFile);
      setFile(selectedFile); // Store the selected file for upload
    }
  };

  const handleUpload = async () => {
    if (!file) {
      alert('Please select a file first!');
      return;
    }

    const formData = new FormData();
    formData.append('profileImage', file); // Append the file to FormData

    try {
      const response = await axios.post('http://localhost:5000/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      alert(response.data); // Show success message
    } catch (error) {
      console.error('Error uploading file:', error);
      alert('Error uploading file');
    }
  };

  return (
    <div>
        <Navbar/>
        <div className="profile-container flex flex-col items-center p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4">Profile</h2>
          <div className="profile-photo mb-4">
            {imagePreview ? (
              <img
                src={imagePreview}
                alt="Profile Preview"
                className="rounded-full w-32 h-32 object-cover border-2 border-gray-300"
              />
            ) : (
              <div className="rounded-full w-32 h-32 bg-gray-200 flex items-center justify-center">
                <span className="text-gray-400">No Image</span>
              </div>
            )}
          </div>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="mb-4"
          />
          <button
            onClick={handleUpload}
            className="btn btn-primary"
          >
            Upload Image
          </button>
        </div>
        <div className='text-center text-white'>
          location: {latitude}, {longitude}
        </div>
    </div>
    
  );
};

export default Profile;
