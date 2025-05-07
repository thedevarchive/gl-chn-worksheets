import Link from "next/link";
import { useRouter } from "next/navigation";

const Header = () => {
    const router = useRouter(); // Initialise useRouter
    return (
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
    );
}

export default Header; 