"use client";
import { useEffect, useRef, useState } from "react";
import { AuthService } from "@/services/authService";
import { ClientDBService } from "@/services/clientDBService";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { setAuthentication } from "@/store/reducers/authSlice";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";
import { useQuery } from "@tanstack/react-query";

export default function Header() {
    const router = useRouter();
    const dispatch = useDispatch();
    const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const handleLogout = async () => {
        try {
            const data = await AuthService.logout();
            if (!data.authenticated) {
                localStorage.clear();
                dispatch(setAuthentication({ authenticated: false, user: undefined }));
                ClientDBService.clearAllQuizzes();
                router.push('/');
            }
        }
        catch (error) {
            console.error("Logout failed:", error);
        }
    }

    const { data: authData, refetch: checkAuth } = useQuery({
        queryKey: ['authStatus'],
        queryFn: AuthService.checkAuthentication,
        refetchOnWindowFocus: false,
        retry: false,
    });

    useEffect(() => {
        checkAuth();
    }, [checkAuth]);

    // Update Redux store if authData changes
    useEffect(() => {
        if (authData?.authenticated) {
            dispatch(setAuthentication(authData));
            localStorage.setItem("accessTokenExpiry", authData.expiredAt.toString());
        }
    }, [authData, dispatch]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <header className="sticky top-0 z-10 w-full bg-white/10 shadow-2xl backdrop-blur">
            <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
                <div className="flex-none">
                    <Link href="/" className="cursor-pointer">
                        <h1 className="text-xl font-bold text-white">Quizer</h1>
                    </Link>
                </div>
                {/* add logic to show & hide the dropdown */}
                {
                    isAuthenticated && (
                        <div className="relative flex-none" ref={dropdownRef}>
                            <button
                                onClick={() => setDropdownOpen((open) => !open)}
                                className="flex items-center gap-2 px-4 py-2 text-white font-bold bg-white/10 dark:bg-white rounded focus:outline-none opacity-80 hover:opacity-100 transition-opacity"
                                aria-haspopup="true"
                                aria-expanded={dropdownOpen}
                            >
                                My Account
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>
                            <div
                                id="dropdown"
                                className={`absolute right-0 z-10 mt-2 w-44 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none transition-all duration-100 ${dropdownOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0 invisible'}`}
                                role="menu"
                            >
                                <ul className="py-2 text-sm text-gray-700 dark:text-gray-200">
                                    <li>
                                        <Link
                                            href="my-profile"
                                            className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                                            role="menuitem"
                                        >
                                            Dashboard
                                        </Link>
                                    </li>
                                    <li>
                                        <button
                                            onClick={handleLogout}
                                            className="w-full text-left block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                                            role="menuitem"
                                        >
                                            Sign out
                                        </button>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    )
                }
            </div>
        </header>
    )
}