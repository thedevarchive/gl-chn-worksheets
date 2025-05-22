"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useLanguage } from "@/app/contexts/LanguageContext";

//prevents unnecessary XSS, just to be safe 
import DOMPurify from 'dompurify';

import Header from "../../components/Header";
import LanguageToggle from "@/app/components/LanguageToggle";

export default function LessonGuideId() {
    const params = useParams();
    const router = useRouter();
    const searchParams = useSearchParams();

    const [titles, setTitles] = useState([]); //name of the current lesson
    const [objectives, setObjectives] = useState([]);

    //check if learner is looking for an answer key written in simplified Chinese
    const [isSimplified, setIsSimplified] = useState(true);

    const [vocab, setVocab] = useState([]);
    const [vocabNotes, setVocabNotes] = useState([]);
    const [sampleSentences, setSampleSentences] = useState([]);

    const lessonId = params.id;
    const scriptParam = searchParams.get('script');

    const script = scriptParam && scriptParam.trim() !== '' ? scriptParam : "simplified";

    //for displaying the vocabulary in two columns
    const [columns, setColumns] = useState({ column1: [], column2: [] });

    const { language } = useLanguage();

    // Split the vocabulary into two columns
    const splitIntoColumns = (vocabList) => {
        const half = Math.ceil(vocabList?.length / 2);
        const column1 = vocabList?.slice(0, half);
        const column2 = vocabList?.slice(half);

        return { column1, column2 };
    };

    const API_URL = "http://localhost:9080";

    //useEffect for calling API to load answer key details for a lesson
    useEffect(() => {
        fetch(`${API_URL}/guides/${lessonId}?script=${script}`, {
            method: "GET",
            headers: {
                "accept": "application/json",
                "Content-Type": "application/json"
            },
        })
            .then((res) => res.json())
            .then((data) => {
                setIsSimplified(script !== "traditional");
                setTitles([data.titles.eng_title, data.titles.s_chn_title]);
                setObjectives(data.objectives);
                setVocab(data.vocab);
                setVocabNotes(data.vocabNotes);
                setSampleSentences(data.sampleStc)
            })
            .catch((err) => console.error(err));
    }, [router]);

    //useEffect for splitting vocab to two columns
    useEffect(() => {
        setColumns(splitIntoColumns(vocab));
    }, [vocab]);

    return (
        <main className="flex flex-col min-h-screen bg-gray-100 text-black">
            {/* Header */}
            <Header isSimplified={isSimplified} />
            <div className="flex flex-col items-center p-4 bg-violet-200 flex-1">
                <div className="flex justify-end w-full">
                    <LanguageToggle />
                </div>
                <h1 className="text-3xl font-bold mt-6 mb-4 text-center">{language === "en" ? `Lesson ${lessonId}: ${titles[0]}` : `${titles[1]}`}</h1>

                <h3 className="text-2xl font-bold text-center">Objectives</h3>
                <div className="flex flex-col gap-4 m-4 p-10 rounded-2xl lg:min-w-4xl lg:max-w-4xl bg-violet-300 items-center">
                    <ul className="list-disc list-inside flex flex-col gap-4 text-xl">
                        {
                            objectives?.map((item, index) =>
                                <li key={index}>{item.description}</li>
                            )
                        }
                    </ul>
                </div>

                <h3 className="text-2xl font-bold text-center">Vocabulary</h3>
                <div className="flex flex-col gap-y-4 md:items-center lg:items-stretch py-8 lg:p-8 md:gap-8 lg:flex-row lg:gap-30">
                    <div className="flex flex-col gap-4 p-10 rounded-2xl w-90 lg:min-w-sm lg:max-w-sm bg-violet-300">
                        {
                            columns?.column1?.map((item, index) => (
                                <div key={index}>
                                    <div className="text-2xl whitespace-normal">{index + 1}. <span className="font-bold">{isSimplified ? item.s_hanzi : item.t_hanzi}</span> {item.pinyin} - {item.meaning}</div>
                                </div>
                            ))
                        }
                    </div>
                    <div className="flex flex-col gap-4 p-10 rounded-2xl w-90 lg:min-w-sm lg:max-w-sm bg-violet-300">
                        {
                            columns?.column2?.map((item, index) => (
                                <div key={index}>
                                    <div className="text-2xl whitespace-normal">{columns.column1.length + index + 1}. <span className="font-bold">{isSimplified ? item.s_hanzi : item.t_hanzi}</span> {item.pinyin} - {item.meaning}</div>
                                </div>
                            ))
                        }
                    </div>
                </div>

                <h3 className="text-2xl font-bold text-center">Vocabulary Notes</h3>
                {
                    vocabNotes?.map((item, index) =>
                        <div key={index} className="flex flex-col my-4 gap-4 lg:min-w-4xl lg:max-w-4xl">
                            <div className="p-10 rounded-2xl lg:min-w-4xl lg:max-w-4xl bg-violet-300 items-center text-2xl whitespace-normal leading-relaxed">
                                <span className="font-bold mr-1">{isSimplified ? item.s_hanzi : item.t_hanzi}</span> {item.pinyin} - {item.meaning}
                            </div>
                            <div className="text-xl">
                                {isSimplified ? item.eng_s_notes : item.eng_t_notes}
                            </div>
                        </div>
                    )
                }

                <h3 className="text-2xl font-bold text-center">Sample Sentences</h3>
                {
                    sampleSentences?.map((item, index) =>
                        <div key={index} className="flex flex-col my-4 gap-4 lg:min-w-4xl lg:max-w-4xl">
                            <div className="flex p-10 rounded-2xl lg:min-w-4xl lg:max-w-4xl bg-violet-300 items-center text-2xl font-bold">
                                <pre className="m-0 font-inherit whitespace-pre-wrap"
                                    dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(`${isSimplified ? item.s_sentence : item.t_sentence}`) }}
                                />
                            </div>
                            <div className="text-xl">
                                {isSimplified ? item.eng_s_notes : item.eng_t_notes}
                            </div>
                        </div>
                    )
                }

                <div className="flex flex-col text-center my-6 justify-center">
                    <span className="text-3xl">END OF LESSON</span>
                    <span className="text-5xl my-2 ml-8 text-purple-900">{isSimplified ? "再见，明天见！" : "再見，明天見！"}</span>
                </div>
            </div>
        </main>
    );
}