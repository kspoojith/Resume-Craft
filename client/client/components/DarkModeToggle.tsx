import { Moon, Sun } from "lucide-react";
import { useDarkMode } from "../hooks/useDarkMode";

interface DarkModeToggleProps {
  className?: string;
  showLabels?: boolean;
}

export default function DarkModeToggle({
  className = "",
  showLabels = true,
}: DarkModeToggleProps) {
  const { isDarkMode, toggleDarkMode } = useDarkMode();

  return (
    <div className={`flex items-center ${className}`}>
      {showLabels && (
        <span className="text-sm text-slate dark:text-ash mr-3 font-body">
          Dark Mode
        </span>
      )}
      <button
        onClick={toggleDarkMode}
        className="flex items-center gap-2 text-slate dark:text-ash hover:text-ink dark:hover:text-porcelain transition-colors duration-200"
      >
        <Sun className="w-4 h-4" />
        <div
          className={`w-10 h-6 rounded-full relative transition-colors duration-200 ${
            isDarkMode ? "bg-violet" : "bg-fog"
          }`}
        >
          <div
            className={`w-4 h-4 bg-porcelain rounded-full absolute top-1 transition-transform duration-200 ${
              isDarkMode ? "translate-x-5" : "translate-x-1"
            }`}
          ></div>
        </div>
        <Moon className="w-4 h-4" />
      </button>
    </div>
  );
}
