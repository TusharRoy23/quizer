import Image from "next/image";
import React from "react";

interface GridShapeProps {
    className?: string;
}

export default function GridShape({ className }: GridShapeProps) {
    return (
        <div className={className}>
            {/* Desktop grid images */}
            <div className="absolute right-0 top-0 -z-1 w-full max-w-[250px] xl:max-w-[450px]">
                <Image
                    width={540}
                    height={254}
                    src="/images/shape/grid-01.svg"
                    alt="grid"
                    priority={true}
                    className="opacity-30"
                />
            </div>
            <div className="absolute bottom-0 left-0 -z-1 w-full max-w-[250px] rotate-180 xl:max-w-[450px]">
                <Image
                    width={540}
                    height={254}
                    src="/images/shape/grid-01.svg"
                    alt="grid"
                    priority={true}
                    className="opacity-30"
                />
            </div>

            {/* Mobile-specific decorative elements */}
            <div className="absolute top-10 left-5 -z-1 w-16 h-16 rounded-full bg-blue-200 opacity-20 blur-xl md:hidden"></div>
            <div className="absolute bottom-10 right-5 -z-1 w-16 h-16 rounded-full bg-purple-200 opacity-20 blur-xl md:hidden"></div>

            {/* Tablet decorative elements */}
            <div className="absolute top-20 left-8 -z-1 w-20 h-20 rounded-full bg-blue-200 opacity-20 blur-xl hidden md:block lg:hidden"></div>
            <div className="absolute bottom-20 right-8 -z-1 w-20 h-20 rounded-full bg-purple-200 opacity-20 blur-xl hidden md:block lg:hidden"></div>

            {/* Desktop decorative elements */}
            <div className="absolute top-1/4 left-10 -z-1 w-24 h-24 rounded-full bg-blue-200 opacity-20 blur-xl hidden lg:block"></div>
            <div className="absolute bottom-1/3 right-16 -z-1 w-32 h-32 rounded-full bg-purple-200 opacity-20 blur-xl hidden lg:block"></div>

            {/* Additional mobile-only decorative elements */}
            <div className="absolute top-1/3 right-4 -z-1 w-12 h-12 rounded-full bg-green-200 opacity-15 blur-lg md:hidden"></div>
            <div className="absolute bottom-1/4 left-4 -z-1 w-10 h-10 rounded-full bg-yellow-200 opacity-15 blur-lg md:hidden"></div>

            {/* Subtle grid pattern for mobile background */}
            <div className="absolute inset-0 -z-2 md:hidden">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] opacity-20"></div>
            </div>
        </div>
    );
}