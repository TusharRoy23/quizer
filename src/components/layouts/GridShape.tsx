import Image from "next/image";
import React from "react";

interface GridShapeProps {
    className?: string;
}

export default function GridShape({ className }: GridShapeProps) {
    return (
        <div className={className}>
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
            {/* Additional decorative elements */}
            <div className="absolute top-1/4 left-10 -z-1 w-24 h-24 rounded-full bg-blue-200 opacity-20 blur-xl"></div>
            <div className="absolute bottom-1/3 right-16 -z-1 w-32 h-32 rounded-full bg-purple-200 opacity-20 blur-xl"></div>
        </div>
    );
}