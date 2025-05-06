"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter(); // Initialise useRouter

  const [lessonArr, setLessonArr] = useState([]);
  const [selectedLesson, setSelectedLesson] = useState("1");
  const [questions, setQuestions] = useState(0);
  //const [isSimplified, setIsSimplified] = useState(true); 

  //boolean value states for question types 
  const [matchPinyin, setMatchPinyin] = useState(false);
  const [matchMeaning, setMatchMeaning] = useState(false);
  const [fillBlank, setFillBlank] = useState(false);
  const [translateChn, setTranslateChn] = useState(false);

  const [selectedFormat, setSelectedFormat] = useState("");

  const API_URL = "http://localhost:9080";

  useEffect(() => {
    fetch(`${API_URL}/lessons`, {
      method: "GET",
      headers: {
        "accept": "application/json",
        "Content-Type": "application/json"
      },
    })
      .then((res) => res.json())
      .then((data) => setLessonArr(data.lessons))
      .catch((err) => console.error(err));
  }, [router]);

  const handleGenerate = () => {
    console.log("Selected level:", selectedLesson);
    console.log("Number of questions:", questions);
    console.log("Match Pinyin?", matchPinyin);
    console.log("Match Meaning?", matchMeaning);
    console.log("FITB?", fillBlank);
    console.log("TL Chinese?", translateChn);
    console.log("Selected Format:", selectedFormat);

    fetch(`${API_URL}/worksheets/${selectedLesson}`, {
      method: "GET",
      headers: {
        "accept": "application/json",
        "Content-Type": "application/json",
        questions: String(questions),
        match_pinyin: String(matchPinyin),
        match_meaning: String(matchMeaning),
        fill_blank: String(fillBlank),
        translate_chn: String(translateChn),
        question_format: selectedFormat
      },
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Network response was not ok");
        }
        return res.blob(); // Convert the response to a Blob
      })
      .then((pdfBlob) => {
        // pdfBlob is a Blob; you can handle it as a PDF
        const pdfUrl = URL.createObjectURL(pdfBlob);
        console.log(pdfBlob);
    
        // Open the PDF in a new window or tab
        const newWindow = window.open(pdfUrl, '_blank'); // '_blank' ensures it opens in a new tab/window
        if (newWindow) {
          newWindow.focus(); // Brings the new window to focus
        } else {
          console.error("Failed to open new window. Allow popups for this website to view the worksheet.");
        }
      })
      .catch((err) => console.error(err));
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
      <div className="flex flex-col items-center p-4 bg-violet-200 flex-1">
        <div className="flex flex-col items-center bg-white p-8 rounded-2xl shadow-md w-full max-w-md mt-12">
          <h1 className="text-2xl font-bold mb-6 text-center">Generate Worksheet</h1>

          {/* Level selection */}
          <section className="flex flex-col items-center mb-6">
            <h2 className="text-xl font-semibold mb-2">Select Lesson</h2>
            <select
              value={selectedLesson}
              onChange={(e) => setSelectedLesson(e.target.value)}
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {
                lessonArr.map((lesson) => (
                  <option key={lesson.id} value={lesson.id}>{lesson.title}</option>
                ))
              }
            </select>
          </section>

          {/* Number of questions */}
          <section className="flex flex-col items-center mb-6">
            <h2 className="text-xl font-semibold mb-2">Select Number of Questions</h2>
            <div className="flex gap-4">
              <label className="flex items-center space-x-2">
                <input type="radio" name="questions" onChange={() => setQuestions(40)} className="accent-yellow-500" />
                <span>40</span>
              </label>
              <label className="flex items-center space-x-2">
                <input type="radio" name="questions" onChange={() => setQuestions(50)} className="accent-yellow-500" />
                <span>50</span>
              </label>
              <label className="flex items-center space-x-2">
                <input type="radio" name="questions" onChange={() => setQuestions(60)} className="accent-yellow-500" />
                <span>60</span>
              </label>
            </div>
          </section>

          <section className="flex flex-col items-center mb-6">
            <h2 className="text-xl font-semibold mb-2">Select Question Types</h2>
            <div className="flex flex-col justify-center gap-2">
              <label className="flex items-center space-x-2">
                <input type="checkbox" name="qType" onChange={() => setMatchPinyin(!matchPinyin)} className="accent-yellow-500" />
                <span>Match Pinyin to Word</span>
              </label>
              <label className="flex items-center space-x-2">
                <input type="checkbox" name="qType" onChange={() => setMatchMeaning(!matchMeaning)} className="accent-yellow-500" />
                <span>Match Meaning to Word</span>
              </label>
              <label className="flex items-center space-x-2">
                <input type="checkbox" name="qType" onChange={() => setFillBlank(!fillBlank)} className="accent-yellow-500" />
                <span>Fill in the Blank</span>
              </label>
              <label className="flex items-center space-x-2">
                <input type="checkbox" name="qType" onChange={() => setTranslateChn(!translateChn)} className="accent-yellow-500" />
                <span>Translate to Chinese</span>
              </label>
            </div>
          </section>

          <section className="flex flex-col items-center mb-6">
            <h2 className="text-xl font-semibold mb-2">Select Question Format</h2>
            <div className="flex gap-4">
              <label className="flex items-center space-x-2">
                <input type="radio" name="qFormat" value="MC" checked={selectedFormat === "MC"} onChange={(e) => setSelectedFormat(e.target.value)} className="accent-yellow-500" />
                <span>Multiple Choice</span>
              </label>
              <label className="flex items-center space-x-2">
                <input type="radio" name="qFormat" value="WR" checked={selectedFormat === "WR"} onChange={(e) => setSelectedFormat(e.target.value)} className="accent-yellow-500" />
                <span>Write Answer</span>
              </label>
              <label className="flex items-center space-x-2">
                <input type="radio" name="qFormat" value="MW" checked={selectedFormat === "MW"} onChange={(e) => setSelectedFormat(e.target.value)} className="accent-yellow-500" />
                <span>Both</span>
              </label>
            </div>
          </section>

          {/* Submit button */}
          <button onClick={() => handleGenerate()} className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
            Generate
          </button>
        </div>
      </div>
    </main>
  );
}
