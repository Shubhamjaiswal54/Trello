import React from 'react'
import { Button } from './button';

const NotFoundSection = () => {
    return (
        /* Background Image */
        <section
            style={{ backgroundImage: "linear-gradient(rgba(255, 255, 255, 0), rgba(255, 255, 255, 0.3)),url('/images/abstract-background.jpg')" }}
            className="flex justify-center lg:justify-start items-center h-[696px] md:h-[calc(100vh-32px)] bg-cover bg-center lg:px-24">
            {/* Wrapper */}
            <div className=" flex flex-col max-w-[calc(100%-32px)] w-full py-12 gap-12 md:py-16 md:gap-8">
                {/* Text & Button */}
                <div className="flex flex-col gap-8  md:gap-16 ">
                    {/* Text pair */}
                    <div className="flex flex-col gap-6 ">
                        {/* Header */}
                        <header className="flex flex-col gap-3 ">
                            <span className="text-indigo-700 font-semibold text-base">Not found</span>
                            <h1 className="font-semibold text-neutral-900 text-4xl md:text-5xl lg:text-6xl">We can’t find the page</h1>
                        </header>
                        {/* Text */}
                        <p className="text-neutral-600 md:text-xl text-lg">Sorry, the page you are looking for doesn&apos;t  exist or has been moved.</p>
                    </div>
                    {/* button */}
                    <div className="flex ">
                        <Button
                            className="w-full gap-[6px] px-5 py-3 text-base items-center justify-center md:gap-[10px] md:px-6 md:py-4 md:text-lg rounded md:w-auto"
                            aria-label="Navigate back to home page"
                        />
                    </div>

                </div>
            </div>
        </section>
    );
}

export default NotFoundSection