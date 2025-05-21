"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import Header from "./components/Header";
import LanguageToggle from "./components/LanguageToggle";

export default function Home() {
  const router = useRouter(); // Initialise useRouter

  const [lessonArr, setLessonArr] = useState([]);
  const [selectedLesson, setSelectedLesson] = useState("1");
  const [isAcaPerfWS, setIsAcaPerfWS] = useState(false);
  const [lessons, setLessons] = useState(0);
  const [endLesson, setEndLesson] = useState("1");
  const [isForKids, setIsForKids] = useState(false);
  const [questions, setQuestions] = useState(0);
  const [isChineseTr, setIsChineseTr] = useState(false); 
  //const [isSimplified, setIsSimplified] = useState(true); 

  //object state containing boolean values for question types 
  const [qTypes, setQTypes] = useState({
    matchPinyin: false,
    matchMeaning: false,
    fillBlank: false,
    translateChn: false,
    idCorSen: false,
    reconSentence: false,
  });

  const [selectedFormat, setSelectedFormat] = useState("");

  //function getting the question types that are visible depending on format selected
  const getVisibleQTypes = (format = selectedFormat) => {
    const supportsIdCorSen = Number(selectedLesson) >= 4; // becomes available after lesson 4
    const supportsReconSentence = Number(selectedLesson) >= 5; // becomes available after lesson 5

    const base = ["matchPinyin", "matchMeaning", "fillBlank"];
    const wrExtras = ["translateChn"];
    const idCorSenOption = supportsIdCorSen ? ["idCorSen"] : []; //add identify correct sentence if selected lesson is 4 and above 
    const reconSentenceOption = supportsReconSentence ? ["reconSentence"] : [];

    switch (format) {
      case "MC":
        return [...base, ...idCorSenOption];
      case "WR":
        return [...base, ...wrExtras, ...reconSentenceOption];
      case "MW":
        return [...base, ...wrExtras, ...idCorSenOption, ...reconSentenceOption];
      default:
        return [];
    }
  };

  //function for ticking all visible question types
  const handleSelectAllVisible = () => {
    const visible = getVisibleQTypes();
    const areAllSelected = visible.every(type => qTypes[type]);
    const updated = { ...qTypes };

    visible.forEach((key) => {
      updated[key] = !areAllSelected; // if all selected, untick; else, tick all
    });

    setQTypes(updated);
  };

  const handleFormatChange = (format) => {
    setSelectedFormat(format);

    const visibleTypes = new Set(getVisibleQTypes(format));

    const updatedQTypes = Object.fromEntries(
      Object.keys(qTypes).map((key) => [key, visibleTypes.has(key) ? qTypes[key] : false])
    );

    setQTypes(updatedQTypes);
  };

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
    console.log("For Kids?", isForKids);
    console.log("Number of questions:", questions);
    console.log("Match Pinyin?", qTypes.matchPinyin);
    console.log("Match Meaning?", qTypes.matchMeaning);
    console.log("FITB?", qTypes.fillBlank);
    console.log("TL Chinese?", qTypes.translateChn);
    console.log("Selected Format:", selectedFormat);

    fetch(`${API_URL}/worksheets/${selectedLesson}`, {
      method: "POST",
      headers: {
        "accept": "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        is_for_kids: String(isForKids),
        questions: String(questions),
        match_pinyin: String(qTypes.matchPinyin),
        match_meaning: String(qTypes.matchMeaning),
        fill_blank: String(qTypes.fillBlank),
        translate_chn: String(qTypes.translateChn),
        ics: String(qTypes.idCorSen),
        recon_sentence: String(qTypes.reconSentence),
        question_format: selectedFormat
      }),
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

  //update end lesson when selecting new start lesson (selectedLesson)
  useEffect(() => {
    if (endLesson < selectedLesson && isAcaPerfWS) setEndLesson(selectedLesson);
    else if (lessons - 1 > 0 && isAcaPerfWS) setEndLesson(Number(selectedLesson) + lessons - 1);
  }, [selectedLesson]);

  //useEffect for resetting selected question types in regular worksheets
  useEffect(() => {
    setSelectedFormat("");
  }, [isAcaPerfWS]);

  const handleAcademicPerformance = () => {
    fetch(`${API_URL}/academic-performance/${selectedLesson}`, {
      method: "POST",
      headers: {
        "accept": "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        end_lesson: endLesson,
        questions: String(questions),
        is_for_kids: String(isForKids),
      })
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
      <Header isSimplified={true} />

      {/* Main Content */}
      <div className="flex flex-col items-center p-4 bg-violet-200 flex-1 w-full">
        <div className="flex justify-end w-full">
          <LanguageToggle currentLang={isChineseTr} onToggle={() => setIsChineseTr(!isChineseTr)} />
        </div>
        <div className="flex flex-col items-center bg-white p-8 rounded-2xl shadow-md w-full max-w-md mt-12">
          <h1 className="text-2xl font-bold mb-4 text-center">Generate Worksheet</h1>

          <section className="flex flex-col items-center mb-4">
            <h2 className="text-xl font-semibold mb-2">Select Modes</h2>
            <div className="flex flex-col justify-center gap-2">
              <label className="flex items-center space-x-2">
                <input type="checkbox" name="isAcaPerfWS" onChange={() => setIsAcaPerfWS(!isAcaPerfWS)} className="accent-yellow-500" />
                <span>Academic Performance Mode</span>
              </label>

              <label className="flex items-center space-x-2">
                <input type="checkbox" name="isForKids" onChange={() => setIsForKids(!isForKids)} className="accent-yellow-500" />
                <span>Junior Mode</span>
              </label>
            </div>
          </section>

          {
            isAcaPerfWS ? (
              <>
                {/* Level selection */}
                <section className="flex flex-col items-center mb-4">
                  <h2 className="text-xl font-semibold mb-2">Starting Lesson</h2>
                  <select
                    value={selectedLesson}
                    onChange={(e) => setSelectedLesson(e.target.value)}
                    className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {
                      lessonArr.map((lesson) => (
                        <option key={lesson.id} value={lesson.id}>{isChineseTr ? lesson.s_chn_title : lesson.eng_title}</option>
                      ))
                    }
                  </select>
                </section>

                <section className="flex flex-col items-center mb-6">
                  <h2 className="text-xl font-semibold mb-2">Select Number of Lessons</h2>
                  <div className="flex gap-4">
                    <label className="flex items-center space-x-2">
                      <input type="radio" name="lessons" onChange={() => { setLessons(3); setEndLesson(Number(selectedLesson) + 2); }} className="accent-yellow-500" />
                      <span>3</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input type="radio" name="lessons" onChange={() => { setLessons(4); setEndLesson(Number(selectedLesson) + 3); }} className="accent-yellow-500" />
                      <span>4</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input type="radio" name="lessons" onChange={() => { setLessons(5); setEndLesson(Number(selectedLesson) + 4); }} className="accent-yellow-500" />
                      <span>5</span>
                    </label>
                  </div>
                </section>

                <section className="flex flex-col items-center mb-4">
                  <h2 className="text-xl font-semibold mb-2">Preview Lesson Coverage</h2>
                  <p className="text-lg mb-2">Lesson {lessonArr[Number(selectedLesson) - 1].id}: {isChineseTr ? lessonArr[Number(selectedLesson) - 1].s_chn_title : lessonArr[Number(selectedLesson) - 1].eng_title}</p>
                  <p className="text-lg mb-2">to</p>
                  <p className="text-lg mb-2">Lesson {lessonArr[Number(endLesson) - 1].id}: {isChineseTr ? lessonArr[Number(endLesson) - 1].s_chn_title : lessonArr[Number(endLesson) - 1].eng_title}</p>
                </section>

                {/* Number of questions */}
                <section className="flex flex-col items-center mb-6">
                  <h2 className="text-xl font-semibold mb-2">Select Number of Questions</h2>
                  <div className="flex gap-4">
                    <label className="flex items-center space-x-2">
                      <input type="radio" name="questions" onChange={() => setQuestions(isForKids ? 40 : 60)} className="accent-yellow-500" />
                      <span>{isForKids ? "40" : "60"}</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input type="radio" name="questions" onChange={() => setQuestions(isForKids ? 50 : 70)} className="accent-yellow-500" />
                      <span>{isForKids ? "50" : "70"}</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input type="radio" name="questions" onChange={() => setQuestions(isForKids ? 60 : 80)} className="accent-yellow-500" />
                      <span>{isForKids ? "60" : "80"}</span>
                    </label>
                  </div>
                </section>

                {/* Submit button */}
                <button disabled={lessons === 0 || questions === 0} onClick={() => handleAcademicPerformance()} className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 cursor-pointer disabled:bg-gray-400 disabled:cursor-not-allowed">
                  Generate
                </button>
              </>
            ) : (
              <>
                {/* Level selection */}
                <section className="flex flex-col items-center mb-4">
                  <h2 className="text-xl font-semibold mb-2">Select Lesson</h2>
                  <select
                    value={selectedLesson}
                    onChange={(e) => setSelectedLesson(e.target.value)}
                    className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {
                      lessonArr.map((lesson) => (
                        <option key={lesson.id} value={lesson.id}>{isChineseTr ? lesson.s_chn_title : lesson.eng_title}</option>
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
                  <h2 className="text-xl font-semibold mb-2">Select Question Format</h2>
                  <div className="flex gap-4" onChange={(e) => handleFormatChange(e.target.value)}>
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

                {
                  selectedFormat &&
                  <section className="flex flex-col items-center mb-6">
                    <h2 className="text-xl font-semibold mb-2">Select Question Types</h2>
                    <div className="flex flex-col justify-center gap-2">
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" name="qType" checked={getVisibleQTypes().length > 0 ? getVisibleQTypes().every(type => qTypes[type]) : false} onChange={handleSelectAllVisible} className="accent-yellow-500" />
                        <span>Select All</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" name="qType" checked={qTypes.matchPinyin} onChange={() => setQTypes(prev => ({ ...prev, matchPinyin: !prev.matchPinyin }))} className="accent-yellow-500" />
                        <span>Match Pinyin to Word</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" name="qType" checked={qTypes.matchMeaning} onChange={() => setQTypes(prev => ({ ...prev, matchMeaning: !prev.matchMeaning }))} className="accent-yellow-500" />
                        <span>Match Meaning to Word</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" name="qType" checked={qTypes.fillBlank} onChange={() => setQTypes(prev => ({ ...prev, fillBlank: !prev.fillBlank }))} className="accent-yellow-500" />
                        <span>Fill in the Blank</span>
                      </label>
                      {/* Only show certain question types upon reaching a certain lesson or if a question format is selected or both*/}
                      {
                        selectedFormat !== "MC" &&
                        <label className="flex items-center space-x-2">
                          <input type="checkbox" name="qType" checked={qTypes.translateChn} onChange={() => setQTypes(prev => ({ ...prev, translateChn: !prev.translateChn }))} className="accent-yellow-500" />
                          <span>Translate to Chinese</span>
                        </label>
                      }
                      {
                        selectedLesson >= 4 && selectedFormat !== "WR" &&
                        <label className="flex items-center space-x-2">
                          <input type="checkbox" name="qType" checked={qTypes.idCorSen} onChange={() => setQTypes(prev => ({ ...prev, idCorSen: !prev.idCorSen }))} className="accent-yellow-500" />
                          <span>Identify Correct Sentence</span>
                        </label>
                      }
                      {
                        selectedLesson >= 5 && selectedFormat !== "MC" &&
                        <label className="flex items-center space-x-2">
                          <input type="checkbox" name="qType" checked={qTypes.reconSentence} onChange={() => setQTypes(prev => ({ ...prev, reconSentence: !prev.reconSentence }))} className="accent-yellow-500" />
                          <span>Reconstruct Sentence</span>
                        </label>
                      }
                    </div>
                  </section>
                }

                {/* Submit button */}
                <button disabled={questions === 0 || selectedFormat === "" || !Object.values(qTypes).some(value => value === true)} onClick={() => handleGenerate()} className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 cursor-pointer disabled:bg-gray-400 disabled:cursor-not-allowed">
                  Generate
                </button>
              </>
            )
          }
        </div>
      </div>
    </main>
  );
}
