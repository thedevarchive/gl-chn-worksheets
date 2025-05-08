"use client";

import Header from "./components/Header";

const AnswerKey = () => {
    const lessonId = params.id;

    const API_URL = "http://localhost:9080";

    // useEffect(() => {
    //     fetch(`${API_URL}/lesson/${lessonId}`, {
    //         method: "GET",
    //         headers: {
    //             "accept": "application/json",
    //             "Content-Type": "application/json"
    //         },
    //     })
    //         .then((res) => res.json())
    //         .then((data) => setLessonArr(data.lessons))
    //         .catch((err) => console.error(err));
    // }, [router]);

    return (
        <main className="flex flex-col min-h-screen bg-gray-100 text-black">
            <Header />
            <div className="flex flex-col items-center p-4 bg-violet-200 flex-1">
                <h1 className="text-2xl font-bold mb-6 text-center"></h1>
                <h2 className="text-2xl mb-6 text-center">Answer Key</h2>
            </div>
        </main>
    );
}

export default AnswerKey; 