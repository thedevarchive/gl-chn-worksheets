"use client";

import { useState } from "react";

export default function Home() {
  const [level, setLevel] = useState("A");
  const [pages, setPages] = useState(1);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Selected level:", level);
    console.log("Number of pages:", pages);
  };

  return (
    <main className="flex flex-col min-h-screen bg-gray-100 text-black">
      {/* Header */}
      <header className="w-full bg-red-600 p-4 shadow-md flex items-center">
        <div className="max-w-screen-xl mx-auto flex items-center gap-4">
          <div className="border border-4 border-yellow-500 rounded-md text-yellow-500 text-5xl">
            龚李
          </div>
          <div className="flex flex-col">
            <div className="flex gap-4 text-xl justify-center font-semibold text-white">
              <span>龚</span>
              <span>李</span>
              <span>练</span>
              <span>习</span>
              <span>册</span>
            </div>
            <span className="text-lg font-bold text-white">Gong Li Worksheets</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex flex-col items-center justify-center p-4 bg-red-200 flex-1">
        <div className="flex flex-col items-center bg-white p-8 rounded-2xl shadow-md w-full max-w-md mt-12">
          <h1 className="text-2xl font-bold mb-6 text-center">Generate Worksheet</h1>

          {/* Level selection */}
          <section className="flex flex-col items-center mb-6">
            <h2 className="text-xl font-semibold mb-2">Select Level</h2>
            <select
              value={level}
              onChange={(e) => setLevel(e.target.value)}
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="A">Level A: Introduction and Phrases I</option>
              <option value="B">Level B: Introduction and Phrases II</option>
              <option value="C">Level C: Food and Drink Preferences</option>
            </select>
          </section>

          {/* Number of pages */}
          <section className="flex flex-col items-center mb-6">
            <h2 className="text-xl font-semibold mb-2">Select Number of Pages</h2>
            <div className="flex gap-4">
              <label className="flex items-center space-x-2">
                <input type="radio" name="pages" value="4" className="accent-yellow-500" />
                <span>4 Pages</span>
              </label>
              <label className="flex items-center space-x-2">
                <input type="radio" name="pages" value="5" className="accent-yellow-500" />
                <span>5 Pages</span>
              </label>
              <label className="flex items-center space-x-2">
                <input type="radio" name="pages" value="6" className="accent-yellow-500" />
                <span>6 Pages</span>
              </label>
            </div>
          </section>

          {/* Submit button */}
          <button className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
            Generate
          </button>
        </div>
      </div>
    </main>
  );
}
