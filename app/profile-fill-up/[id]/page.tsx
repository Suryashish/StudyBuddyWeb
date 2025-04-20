"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useParams } from 'next/navigation';

const ProfileCompletionForm = () => {
  const params = useParams()
  const { id } = params
  const URL = process.env.NEXT_PUBLIC_VITE_BE_URL || 'http://localhost:5000'; // Set API URL through env vars
  const router = useRouter();

  const [formData, setFormData] = useState({
    mobileNumber: '',
    country: '',
    schoolOrUniversity: '', // "school" or "university"
    schoolDetails: {
      schoolBoard: '',
      schoolName: '',
      standard: '',
    },
    universityDetails: {
      universityName: '',
      collegeName: '',
      course: '',
      branch: '',
      year: '',
      semester: '',
    },
  });

  // Helper function to handle nested fields
  const handleChange = (name: string, value: string) => {
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData((prev:any) => ({
        ...prev,
        [parent]: {
          ...(prev[parent] as Record<string, string>),
          [child]: value,
        },
      }));
    } else {
      setFormData((prev:any) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validate required fields
    if (
      !formData.mobileNumber ||
      !formData.country ||
      !formData.schoolOrUniversity ||
      (formData.schoolOrUniversity === 'school' &&
        (!formData.schoolDetails.schoolBoard ||
          !formData.schoolDetails.schoolName ||
          !formData.schoolDetails.standard)) ||
      (formData.schoolOrUniversity === 'university' &&
        (!formData.universityDetails.universityName ||
          !formData.universityDetails.collegeName ||
          !formData.universityDetails.course ||
          !formData.universityDetails.branch ||
          !formData.universityDetails.year ||
          !formData.universityDetails.semester))
    ) {
      alert('Please fill in all required fields.');
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/profile/${id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data && data._id) {
        router.push(`/dashboard/${data._id}`); // Redirect to dashboard on success
      } else {
        console.error('Error:', data.message);
        alert("Failed to complete profile. Please try again.") //Simple error handling
      }
    } catch (error:any) {
      console.error('Error:', error);
       alert(`Failed to complete profile. ${error.message}`) // Improved error message
    }
  };

  const countries = [
    'United States',
    'Canada',
    'United Kingdom',
    'Australia',
    'India',
    'Germany',
    'France',
    'Japan',
    'Brazil',
    'Mexico',
  ];

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white shadow-md rounded-lg overflow-hidden">
        <div className="p-8">
          <h2 className="text-2xl font-semibold text-gray-800 text-center mb-4">
            Complete Your Profile
          </h2>
          <p className="text-sm text-gray-600 text-center mb-6">
            Please provide the following information to complete your profile.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="mobileNumber" className="block text-gray-700 text-sm font-bold mb-2">
                Mobile Number
              </label>
              <input
                id="mobileNumber"
                type="tel"
                value={formData.mobileNumber}
                onChange={(e) => handleChange('mobileNumber', e.target.value)}
                required
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>

            <div>
              <label htmlFor="country" className="block text-gray-700 text-sm font-bold mb-2">
                Country
              </label>
              <select
                id="country"
                value={formData.country}
                onChange={(e) => handleChange('country', e.target.value)}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              >
                <option value="">Select your country</option>
                {countries.map((country) => (
                  <option key={country} value={country}>
                    {country}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="schoolOrUniversity" className="block text-gray-700 text-sm font-bold mb-2">
                School or University
              </label>
              <select
                id="schoolOrUniversity"
                value={formData.schoolOrUniversity}
                onChange={(e) => handleChange('schoolOrUniversity', e.target.value)}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              >
                <option value="">Select School or University</option>
                <option value="school">School</option>
                <option value="university">University</option>
              </select>
            </div>

            {formData.schoolOrUniversity === 'school' && (
              <>
                <div>
                  <label htmlFor="schoolBoard" className="block text-gray-700 text-sm font-bold mb-2">
                    School Board
                  </label>
                  <input
                    id="schoolBoard"
                    type="text"
                    value={formData.schoolDetails.schoolBoard}
                    onChange={(e) => handleChange('schoolDetails.schoolBoard', e.target.value)}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  />
                </div>
                <div>
                  <label htmlFor="schoolName" className="block text-gray-700 text-sm font-bold mb-2">
                    School Name
                  </label>
                  <input
                    id="schoolName"
                    type="text"
                    value={formData.schoolDetails.schoolName}
                    onChange={(e) => handleChange('schoolDetails.schoolName', e.target.value)}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  />
                </div>
                <div>
                  <label htmlFor="standard" className="block text-gray-700 text-sm font-bold mb-2">
                    Standard/Class
                  </label>
                  <input
                    id="standard"
                    type="text"
                    value={formData.schoolDetails.standard}
                    onChange={(e) => handleChange('schoolDetails.standard', e.target.value)}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  />
                </div>
              </>
            )}

            {formData.schoolOrUniversity === 'university' && (
              <>
                <div>
                  <label htmlFor="universityName" className="block text-gray-700 text-sm font-bold mb-2">
                    University Name
                  </label>
                  <input
                    id="universityName"
                    type="text"
                    value={formData.universityDetails.universityName}
                    onChange={(e) => handleChange('universityDetails.universityName', e.target.value)}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  />
                </div>
                <div>
                  <label htmlFor="collegeName" className="block text-gray-700 text-sm font-bold mb-2">
                    College Name
                  </label>
                  <input
                    id="collegeName"
                    type="text"
                    value={formData.universityDetails.collegeName}
                    onChange={(e) => handleChange('universityDetails.collegeName', e.target.value)}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  />
                </div>
                <div>
                  <label htmlFor="course" className="block text-gray-700 text-sm font-bold mb-2">
                    Course
                  </label>
                  <input
                    id="course"
                    type="text"
                    value={formData.universityDetails.course}
                    onChange={(e) => handleChange('universityDetails.course', e.target.value)}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  />
                </div>
                <div>
                  <label htmlFor="branch" className="block text-gray-700 text-sm font-bold mb-2">
                    Branch
                  </label>
                  <input
                    id="branch"
                    type="text"
                    value={formData.universityDetails.branch}
                    onChange={(e) => handleChange('universityDetails.branch', e.target.value)}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  />
                </div>
                <div>
                  <label htmlFor="year" className="block text-gray-700 text-sm font-bold mb-2">
                    Year
                  </label>
                  <input
                    id="year"
                    type="text"
                    value={formData.universityDetails.year}
                    onChange={(e) => handleChange('universityDetails.year', e.target.value)}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  />
                </div>
                <div>
                  <label htmlFor="semester" className="block text-gray-700 text-sm font-bold mb-2">
                    Semester
                  </label>
                  <input
                    id="semester"
                    type="text"
                    value={formData.universityDetails.semester}
                    onChange={(e) => handleChange('universityDetails.semester', e.target.value)}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  />
                </div>
              </>
            )}

            <button
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Complete Profile
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProfileCompletionForm;