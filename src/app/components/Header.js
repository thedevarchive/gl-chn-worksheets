import Link from "next/link";
import { useRouter } from "next/navigation";

const Header = ({ isSimplified }) => {
    const router = useRouter(); // Initialise useRouter

    if (isSimplified)
        return (
            <header className="w-full mx-auto bg-red-600 p-4 shadow-md flex items-center justify-center lg:gap-180">
                <Link href="/" className="flex items-center gap-4">
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
                </Link>
                <div className="flex gap-4">
                    <div className="text-lg text-white">FAQ</div>
                    <div className="text-lg text-white">Resources</div>
                    <div className="text-lg text-white">Study Tips</div>
                    <div className="text-lg text-white">Lesson Guide</div>
                </div>
            </header>
        );
    else
        return (
            <header className="w-full bg-red-600 p-4 shadow-md flex items-center">
                <div className="max-w-screen-xl mx-auto flex items-center gap-4">
                    <div className="border border-4 border-yellow-500 rounded-md text-yellow-500 text-5xl">
                        龔李
                    </div>
                    <div className="flex flex-col">
                        <div className="flex gap-4 text-xl justify-center font-semibold text-white">
                            <span>龔</span>
                            <span>李</span>
                            <span>練</span>
                            <span>習</span>
                            <span>册</span>
                        </div>
                        <span className="text-lg font-bold text-white">Gong Li Worksheets</span>
                    </div>
                </div>
            </header>
        );
}

export default Header; 