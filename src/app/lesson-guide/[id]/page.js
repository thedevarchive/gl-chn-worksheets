"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import Header from "./components/Header";

export default function LessonGuide() {
    const router = useRouter(); // Initialise useRouter

    return (
        <main className="flex flex-col min-h-screen bg-gray-100 text-black">
            {/* Header */}
            <Header isSimplified={true} />
            <div className="flex flex-col items-center p-4 bg-violet-200 flex-1">
                
            </div>
        </main>
    );
}