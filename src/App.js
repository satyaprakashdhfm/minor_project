import React, { useState } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import './App.css';

function App() {
  const [formData, setFormData] = useState({
    age: '',
    height: '',
    weight: '',
    gender: '',
    state: '',
    dietType: '',
  });
  const [response, setResponse] = useState([]);

  const API_KEY = 'AIzaSyBpJBAxl9wfr4OQqFdbsIEs8TcSZm2Z3e0';

  const genAI = new GoogleGenerativeAI(API_KEY);

  const generateResponse = async (userPrompt) => {
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const result = await model.generateContent(userPrompt);
      const text = result.response.text();
      setResponse(formatResponse(text));
    } catch (error) {
      console.error('Error generating response:', error);
      setResponse(['An error occurred while generating the response.']);
    }
  };

  const formatResponse = (text) => {
    const lines = text.split('\n');
    return lines
      .filter(line => line.trim() !== '')
      .map(line => line.trim().replace(/\*/g, ''));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const prompt = `Create a general ${formData.dietType} diet plan for a ${formData.age} year old ${formData.gender} who is ${formData.height} cm tall, weighs ${formData.weight} kg, and lives in ${formData.state}, India. Please include the following sections, each on a new line:
    1. Breakfast suggestion
    2. Lunch suggestion
    3. Dinner suggestion
    
    Make sure to tailor the suggestions to the person's age, gender, location, and dietary preference (${formData.dietType}). Include specific times for each activity.`;
    generateResponse(prompt);
  };

  const indianStates = [
    "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
    "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka",
    "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram",
    "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu",
    "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal"
  ];

  return (
    <div className="App">
      <h1>Personalized Diet Plan Generator</h1>
      <div className="form-container">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="age">Age:</label>
            <input
              type="number"
              id="age"
              name="age"
              value={formData.age}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="height">Height (cm):</label>
            <input
              type="number"
              id="height"
              name="height"
              value={formData.height}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="weight">Weight (kg):</label>
            <input
              type="number"
              id="weight"
              name="weight"
              value={formData.weight}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="gender">Gender:</label>
            <select
              id="gender"
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              required
            >
              <option value="">Select gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="state">State:</label>
            <select
              id="state"
              name="state"
              value={formData.state}
              onChange={handleChange}
              required
            >
              <option value="">Select state</option>
              {indianStates.map((state, index) => (
                <option key={index} value={state}>{state}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="dietType">Diet Type:</label>
            <select
              id="dietType"
              name="dietType"
              value={formData.dietType}
              onChange={handleChange}
              required
            >
              <option value="">Select diet type</option>
              <option value="vegetarian">Vegetarian</option>
              <option value="non-vegetarian">Non-vegetarian</option>
            </select>
          </div>
          <button type="submit">Generate Diet Plan</button>
        </form>
      </div>
      {response.length > 0 && (
        <div className="response-container">
          <h2>Your Personalized Diet Plan:</h2>
          {response.map((line, index) => (
            <p key={index}>{line}</p>
          ))}
        </div>
      )}
    </div>
  );
}

export default App;
