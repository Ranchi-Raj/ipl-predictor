"use client";

// import Image from "next/image";
import { useState } from "react";
import axios from "axios";

const teams = [
  "Sunrisers Hyderabad",
  "Mumbai Indians",
  "Royal Challengers Bangalore",
  "Kolkata Knight Riders",
  "Kings XI Punjab",
  "Chennai Super Kings",
  "Rajasthan Royals",
  "Delhi Capitals"
];

const venues = ["Mumbai", "Chennai", "Kolkata", "Delhi", "Bangalore", "Hyderabad", "Jaipur", "Ahmedabad"];

export default function Home() {

  const [formData, setFormData] = useState({
    batting_team: "",
    bowling_team: "",
    city: "",
    // venue: "",
    runs_left: "",
    balls_left: "",
    wickets: "",
    total_runs: "",
    crr: "",
    rrr: ""
  });

  const [finalTeams, setFinalTeams] = useState<string[]>([]);
  const [pred, setPred] = useState<number[]>([]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
  };

 const handleSubmit = async (e : React.ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();

    const rrr = (parseInt(formData.runs_left) * 6 / parseInt(formData.balls_left || "1")).toFixed(2)
    const crr = ((parseInt(formData.total_runs) - parseInt(formData.runs_left)) * 6 / (120 - (parseInt(formData.balls_left || "1")))).toFixed(2) 
    
    const sendData = {
      ...formData,
      crr: String(crr),
      rrr: String(rrr)
    };

    console.log("Form Data:", sendData);
    setFinalTeams([sendData.batting_team, sendData.bowling_team]);

    try{
      const prediction = await axios.post('https://ipl-predictor-c4ld.onrender.com/predict', sendData,{
        headers: {
          "Content-Type": "application/json"
        },}
      );
      setPred(prediction.data.prediction[0]);
      console.log("Prediction ",prediction.data.prediction[0]); // Replace with prediction logic or API call
    }
    catch (error) {
      console.error("Error during prediction:", error);
      // alert("An error occurred while making the prediction. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a2b] via-[#0a1a3d] to-[#1a003d] text-white flex items-center justify-center p-6 flex-col">
      <form
        onSubmit={handleSubmit}
        className="bg-white text-black p-8 rounded-2xl shadow-2xl w-full max-w-xl flex flex-col gap-6"
      >
        <h1 className="text-3xl font-bold text-center text-black">
          Match Outcome Predictor
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block font-semibold mb-1">Batting Team</label>
            <select
              name="batting_team"
              value={formData.batting_team}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
              required
            >
              <option value="">Select</option>
              {teams.map((team) => (
                <option key={team} value={team}>{team}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-semibold mb-1">Bowling Team</label>
            <select
              name="bowling_team"
              value={formData.bowling_team}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
              required
            >
              <option value="">Select</option>
              {teams.map((team) => (
                <option key={team} value={team}>{team}</option>
              ))}
            </select>
          </div>

          {/* <div>
            <label className="block font-semibold mb-1">City</label>
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleInputChange}
              placeholder="e.g. Mumbai"
              className="w-full p-2 border rounded"
              required
            />
          </div> */}

          <div>
            <label className="block font-semibold mb-1">Venue</label>
            <select
              name="city"
              value={formData.city}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
              required
            >
              <option value="">Select</option>
              {venues.map((venue) => (
                <option key={venue} value={venue}>{venue}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-semibold mb-1">Runs Left</label>
            <input
              type="number"
              name="runs_left"
              value={formData.runs_left}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>

          <div>
            <label className="block font-semibold mb-1">Balls Left</label>
            <input
              type="number"
              name="balls_left"
              value={formData.balls_left}
              onChange={handleInputChange}
              placeholder="e.g. 120 for full innings"
              className="w-full p-2 border rounded"
              required
            />
          </div>

          <div>
            <label className="block font-semibold mb-1">Wickets</label>
            <input
              type="number"
              name="wickets"
              value={formData.wickets}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block font-semibold mb-1">Total Runs</label>
            <input
              type="number"
              name="total_runs"
              value={formData.total_runs}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>

        </div>

        <button
          type="submit"
          className="mt-4 bg-[#0a1a3d] hover:bg-[#1a2a5d] text-white font-semibold py-2 rounded-xl mx-auto px-4"
        >
          Predict Outcome
        </button>
      </form>
      {
        finalTeams.length > 0 && (
          <div className="mt-6 bg-white text-black p-4 rounded-xl shadow-lg w-full max-w-xl">
            <h1 className="text-2xl font-bold">Final Prediction</h1>
            <p >{finalTeams[0]} : {(pred[0] * 100).toFixed(2)}%</p>
            <p >{finalTeams[1]} : {(pred[1] * 100).toFixed(2)}%</p>
          </div>
        )
      }
    </div>
  );
}
