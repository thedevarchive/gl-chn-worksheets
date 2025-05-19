"use client";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import Link from "next/link";
import Header from "../components/Header";

export default function LessonGuide() {
    const router = useRouter(); // Initialise useRouter
    const searchParams = useSearchParams();

    const [lessonArr, setLessonArr] = useState([]);

    const scriptParam = searchParams.get('script');

    //check if learner is looking for an answer key written in simplified Chinese
    const [isSimplified, setIsSimplified] = useState(true);

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
        .then((data) => {
            setIsSimplified(scriptParam !== "traditional")
            setLessonArr(data.lessons);
        })
        .catch((err) => console.error(err));
    }, [router]);

    return (
        <main className="flex flex-col min-h-screen bg-gray-100 text-black">
            {/* Header */}
            <Header isSimplified={isSimplified} />
            <div className="flex flex-col items-center p-4 bg-violet-200 flex-1">
                <div className="text-4xl font-bold">Select Lesson</div>
                <div className="text-2xl font-bold mt-6">Beginner Level</div>
                <div className="flex flex-wrap mt-4 pb-8">
                    {
                        lessonArr?.map((lesson) => (
                            <div key={lesson.id} value={lesson.id} className="flex flex-col w-1/3 px-4 py-5 text-center">
                                <Link href={`/lesson-guide/${lesson.id}`} className="text-xl font-bold text-violet-900">Lesson {lesson.id}: {lesson.title}</Link>
                            </div>
                        ))
                    }
                </div>
            </div>
        </main>
    );
}