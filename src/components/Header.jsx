import { ChevronLeft, Share2, Users, MoreHorizontal } from "lucide-react";
import { useNavigate } from "react-router-dom";  // 🔥 Add navigation

export default function Header({ model = "GPT-o3" }) {
    const navigate = useNavigate();                // 🔥 Create navigation

    return (
        <header className="sticky top-0 z-40 bg-white/80 backdrop-blur border-b">
            <div className="flex items-center justify-between px-6 h-[56px]">

                {/* Title */}
                <h1 className="text-[15px] font-semibold text-gray-900">Chat GPT</h1>

                {/* 🔥 Right Icon Buttons */}
                <div className="flex items-center gap-2">

                    {/* BACK BUTTON — now same size as others */}
                    <button
                        onClick={() => navigate("/dashboard")}
                        className="p-2 rounded-lg hover:bg-gray-100 relative group"
                    >
                        <ChevronLeft size={18} />

                        {/* TOOLTIP APPEARS ON HOVER */}
                        <span className="absolute top-10 left-1/2 -translate-x-1/2
                        bg-gray-900 text-white text-xs px-2 py-1 rounded-md opacity-0 pointer-events-none
                         group-hover:opacity-100 group-hover:translate-y-1 transition-all duration-200 whitespace-nowrap shadow-lg">
                            Back to Dashboard
                        </span>
                    </button>


                    <button className="p-2 rounded-lg hover:bg-gray-100" title="Share">
                        <Share2 size={18} />
                    </button>

                    <button className="p-2 rounded-lg hover:bg-gray-100" title="Add People">
                        <Users size={18} />
                    </button>

                    <button className="p-2 rounded-lg hover:bg-gray-100" title="More">
                        <MoreHorizontal size={18} />
                    </button>
                </div>
            </div>
        </header>
    );
}
