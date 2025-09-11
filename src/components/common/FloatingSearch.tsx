"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import XIcon from "../Icon/XIcon";
import SearchIcon from "../Icon/SearchIcon";
import Input from "../form/InputField";
import Button from "../ui/button/Button";
import { SearchListIcon } from "@/icons";
import { RootState } from "@/store";
import { useSelector } from "react-redux";

const FloatingSearch = () => {
    const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
    const [isOpen, setIsOpen] = useState(false);
    const [searchText, setSearchText] = useState("");
    const router = useRouter();
    const inputRef = useRef<HTMLInputElement>(null);

    // Focus input when search opens
    useEffect(() => {
        if (isOpen && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isOpen]);

    const handleSearch = () => {
        const trimmedText = searchText?.trim();
        if (!trimmedText) return;

        // Basic validation - limit length
        if (trimmedText.length > 100) {
            alert('Search query too long (max 100 characters)');
            return;
        }

        // Remove or escape potentially problematic characters
        const safeText = trimmedText.replace(/[<>]/g, '');
        setIsOpen(false);
        setSearchText("");
        router.push(`/search?query=${encodeURIComponent(safeText)}`);
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleSearch();
        } else if (e.key === 'Escape') {
            setIsOpen(false);
            setSearchText("");
        }
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        handleSearch();
    }

    return (
        isAuthenticated && <div className="fixed bottom-6 right-6 z-50">
            {/* Search Box */}
            {isOpen && (
                <div className="bg-white rounded-lg shadow-lg p-4 mb-4 w-80 animate-fade-in neon-border-glow">
                    <form onSubmit={handleSubmit} className="grid-cols-[1fr_auto] items-stretch flex w-full">
                        <div className="flex-1">
                            <Input
                                ref={inputRef}
                                type="text"
                                defaultValue={searchText}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchText(e.target.value)}
                                onKeyDown={handleKeyDown}
                                placeholder="Search quizzes..."
                                className="w-full rounded-r-none h-11"
                                aria-label="Search input"
                            />
                        </div>
                        <Button
                            size="sm"
                            variant="outline"
                            className="rounded-l-none h-11 px-3"
                            aria-label="Perform search"
                            onClick={handleSearch}
                        >
                            <SearchListIcon className="w-5 h-5" />
                        </Button>
                    </form>
                    <p className="text-xs text-gray-500 mt-2">
                        Press Enter to search • Esc to close
                    </p>
                </div>
            )}

            {/* Floating Button */}
            <button
                onClick={() => {
                    setIsOpen(!isOpen);
                    setSearchText("");
                }}
                className="
                    bg-blue-500 
                    hover:bg-blue-600 
                    text-white rounded-full w-16 h-16 flex items-center justify-center 
                    shadow-lg shadow-blue-500/50 
                    transition-all duration-300 
                    hover:scale-110 
                    ring-2 ring-blue-300 ring-opacity-50
                    hover:ring-4 hover:ring-blue-200 hover:ring-opacity-70
                    neon-glow
                "
                aria-label={isOpen ? "Close search" : "Open search"}
            >
                {isOpen ? (
                    <XIcon className="w-6 h-6" />
                ) : (
                    <SearchIcon className="w-6 h-6" />
                )}
            </button>
        </div>
    );
};

export default FloatingSearch;