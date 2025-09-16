"use client";
import { useEffect, useRef, useState } from "react";
import { AuthService } from "@/services/authService";
import { ClientDBService } from "@/services/clientDBService";
import { useRouter } from "next/navigation";
import { setAuthentication, setLoading } from "@/store/reducers/authSlice";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";
import { useQuery } from "@tanstack/react-query";
import { setStep } from "@/store/reducers/stepSlice";
import { STEPS } from "@/utils/enum";
import Image from "next/image";
import { Roboto } from "next/font/google";

const roboto = Roboto({
    weight: '700',
    subsets: ['vietnamese'],
    display: 'swap',
    style: 'italic'
})

export default function Header() {
    const router = useRouter();
    const dispatch = useDispatch();
    const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const jumpToHome = () => {
        dispatch(setStep(STEPS.Intro));
        router.push('/');
    }

    const handleLogout = async () => {
        try {
            const data = await AuthService.logout();
            if (!data.authenticated) {
                localStorage.clear();
                dispatch(setAuthentication({ authenticated: false, user: undefined }));
                ClientDBService.clearAllQuizzes();
                jumpToHome();
            }
        }
        catch (error) {
            console.error("Logout failed:", error);
        }
    }

    const { data: authData, isLoading, isError } = useQuery({
        queryKey: ['authStatus'],
        queryFn: AuthService.checkAuthentication,
        refetchOnWindowFocus: true, // Only refetch when window gains focus
        refetchOnMount: true, // Refetch when component mounts
        refetchOnReconnect: true, // Refetch when regaining connection
        staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes
        retry: 1,
    });

    useEffect(() => {
        if (isError) {
            dispatch(setLoading({ isLoading: false }));
        }
    }, [isError, dispatch]);

    // Single useEffect to handle auth data updates
    useEffect(() => {
        if (authData) {
            dispatch(setAuthentication(authData));
            dispatch(setLoading({ isLoading: false }));
            if (authData.authenticated && authData.expiredAt) {
                localStorage.setItem("accessTokenExpiry", authData.expiredAt.toString());
            }
        }
    }, [authData, dispatch]);

    useEffect(() => {
        if (isLoading) {
            dispatch(setLoading({ isLoading: true }));
        }
    }, [isLoading, dispatch]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Show error state for user dropdown
    const UserDropdown = () => {
        if (!isAuthenticated) {
            return null;
        }

        return (
            <div className="relative flex-none" ref={dropdownRef}>
                <button
                    onClick={() => setDropdownOpen((open) => !open)}
                    className="flex items-center gap-2 px-4 py-2 text-gray-300 font-bold bg-white/10 dark:bg-white rounded focus:outline-none opacity-80 hover:opacity-100 transition-opacity"
                    aria-haspopup="true"
                    aria-expanded={dropdownOpen}
                >
                    My Account
                    <svg className={`w-4 h-4 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                </button>
                <div
                    id="dropdown"
                    className={`absolute right-0 z-10 mt-2 w-44 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none transition-all duration-100 ${dropdownOpen ? 'scale-100 opacity-100 visible' : 'scale-95 opacity-0 invisible'}`}
                    role="menu"
                >
                    <ul className="py-2 text-sm text-gray-700 dark:text-gray-200">
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
        );
    };

    return (
        <header className="sticky top-0 z-10 w-full bg-white/10 shadow-2xl backdrop-blur">
            <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
                <div className="flex-none">
                    <div
                        className="cursor-pointer"
                        onClick={() => jumpToHome()}
                    >
                        <h1 className="flex items-center ">
                            <Image
                                src="/images/logo/quizer.png"
                                alt="Quizer"
                                width={40}
                                height={40}
                            />
                            <span className={"text-2xl text-gray-300 " + roboto.className}>uizer</span>
                        </h1>
                    </div>
                </div>

                <UserDropdown />
            </div>
        </header>
    )
}