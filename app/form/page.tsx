"use client";

import { useState } from "react";

export default function FormPage() {
  const [formData, setFormData] = useState({
    height: "",
    bodyShape: "",
    skinTone: "",
    gender: "",
    age: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/form", {
      method: "POST",
      body: JSON.stringify(formData),
      headers: { "Content-Type": "application/json" },
    });
    if (res.ok) alert("Form submitted successfully!");
    else alert("Error submitting form.");
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow-lg rounded-xl text-black">
      <h2 className="text-xl font-semibold mb-4 text-black">User Details Form</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input type="number" name="height" placeholder="Height" onChange={handleChange} className="w-full p-2 border rounded text-black" />
        <select name="bodyShape" onChange={handleChange} className="w-full p-2 border rounded text-black">
          <option value="">Select Body Shape</option>
          <option value="Slim">Slim</option>
          <option value="Athletic">Athletic</option>
          <option value="Curvy">Curvy</option>
        </select>
        <input type="text" name="skinTone" placeholder="Skin Tone" onChange={handleChange} className="w-full p-2 border rounded" />
        <select name="gender" onChange={handleChange} className="w-full p-2 border rounded text-black">
          <option value="">Select Gender</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Other">Other</option>
        </select>
        <input type="number" name="age" placeholder="Age" onChange={handleChange} className="w-full p-2 border rounded" />
        <button type="submit" className="w-full bg-blue-500 text-black p-2 rounded">Submit</button>
      </form>
    </div>
  );
}
