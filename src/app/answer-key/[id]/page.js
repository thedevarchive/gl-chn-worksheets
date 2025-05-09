"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";

//prevents unnecessary XSS, just to be safe 
import DOMPurify from 'dompurify';

import Header from "@/app/components/Header";


const AnswerKey = () => {
    //initialise next/navigation variables
    const params = useParams();
    const router = useRouter();
    const searchParams = useSearchParams();

    const [title, setTitle] = useState(""); //name of the current lesson

    const [isSimplified, setIsSimplified] = useState(true);

    //states for holding the lesson's possible questions
    const [chars, setChars] = useState([]);
    const [vocab, setVocab] = useState([]);
    const [fitb, setFitb] = useState([]);
    const [trChn, setTrChn] = useState([]);

    const lessonId = params.id;
    const scriptParam = searchParams.get('script');

    const script = scriptParam && scriptParam.trim() !== '' ? scriptParam : "simplified";

    //for displaying the vocabulary in two columns
    const [columns, setColumns] = useState({ column1: [], column2: [] });

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
        fetch(`${API_URL}/lessons/${lessonId}?script=${script}`, {
            method: "GET",
            headers: {
                "accept": "application/json",
                "Content-Type": "application/json"
            },
        })
            .then((res) => res.json())
            .then((data) => {
                setTitle(data.title);
                setChars(data.chars);
                setVocab(data.vocab);
                setFitb(data.fitb_questions);
                setTrChn(data.tc_questions);
            })
            .catch((err) => console.error(err));
    }, [router]);

    //useEffect for splitting vocab to two columns
    useEffect(() => {
        setColumns(splitIntoColumns(vocab));
    }, [vocab]);

    return (
        <main className="flex flex-col min-h-screen bg-gray-100 text-black">
            <Header isSimplified={script !== "traditional"} />
            <div className="flex flex-col items-center p-4 bg-violet-200 flex-1">
                <h1 className="text-3xl font-bold mt-6 mb-4 text-center">Lesson {lessonId}: {title}</h1>
                <h2 className="text-2xl font-semibold mb-6 text-center">Answer Key</h2>

                <h3 className="text-2xl font-bold mb-6 text-center">Characters Learned</h3>
                <div className="flex flex-wrap">
                    {
                        chars?.map((item, index) => (
                            <div key={index} className="flex flex-col w-1/5 px-4 py-5 text-center">
                                <div className="text-3xl font-bold">{item.s_hanzi}</div>
                                <div className="text-xl">{item.pinyin}</div>
                            </div>
                        ))
                    }
                </div>

                <h3 className="text-2xl font-bold text-center">Vocabulary</h3>
                <div className="flex flex-col p-8 md:gap-8 lg:flex-row lg:gap-30">
                    <div className="flex flex-col gap-4 p-10 rounded-2xl min-w-sm max-w-sm bg-gradient-to-b from-violet-400 to-violet-100">
                        {
                            columns?.column1?.map((item, index) => (
                                <div key={index}>
                                    <div className="text-2xl whitespace-normal"><span className="font-bold">{index + 1}. {item.s_hanzi}</span> {item.pinyin} - {item.meaning}</div>
                                </div>
                            ))
                        }
                    </div>
                    <div className="flex flex-col gap-4 p-10 rounded-2xl min-w-sm max-w-sm bg-gradient-to-b from-violet-400 to-violet-100">
                        {
                            columns?.column2?.map((item, index) => (
                                <div key={index}>
                                    <div className="text-2xl"><span className="font-bold">{columns.column1.length + index + 1}. {item.s_hanzi}</span> {item.pinyin} - {item.meaning}</div>
                                </div>
                            ))
                        }
                    </div>
                </div>

                <h3 className="text-2xl font-bold text-center">Fill in the Blanks</h3>
                <div className="flex flex-wrap justify-center max-w-5xl gap-12 mx-auto">
                    {
                        fitb?.map((item, index) => (
                            <div key={index} className="text-2xl w-[30%] px-6 py-4 max-w-sm">
                                <div className="py-2">
                                    <div
                                        dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(`<span>${index + 1}. &nbsp;</span>${item.s_question}`) }}
                                    />
                                </div>
                                <div className="py-2"><span className="font-bold">Answer:</span> {item.s_answer}</div>
                            </div>
                        ))
                    }
                </div>
            </div>
        </main>
    );
}

export default AnswerKey; 