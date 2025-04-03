import React, { useState } from 'react';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <nav className="bg-white shadow-lg">
            <div className="max-w-7xl mx-auto px-4">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <div className="flex-shrink-0">
                        <a href="/" className="text-xl font-bold text-gray-800">
                            Logo
                        </a>
                    </div>

                    {/* Desktop Menu */}
                    <div className="hidden md:block">
                        <div className="ml-10 flex items-center space-x-4">
                            <a href="/" className="text-gray-600 hover:text-gray-900 px-3 py-2">
                                Home
                            </a>
                            <a href="/about" className="text-gray-600 hover:text-gray-900 px-3 py-2">
                                About
                            </a>
                            <a href="/services" className="text-gray-600 hover:text-gray-900 px-3 py-2">
                                Services
                            </a>
                            <a href="/contact" className="text-gray-600 hover:text-gray-900 px-3 py-2">
                                Contact
                            </a>
                        </div>
                    </div>

                    {/* Mobile menu button */}
                    <div className="md:hidden">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
                        >
                            <svg
                                className="h-6 w-6"
                                stroke="currentColor"
                                fill="none"
                                viewBox="0 0 24 24"
                            >
                                {isOpen ? (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                ) : (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                )}
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <div className="md:hidden">
                    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                        <a href="/" className="block text-gray-600 hover:text-gray-900 px-3 py-2">
                            Home
                        </a>
                        <a href="/about" className="block text-gray-600 hover:text-gray-900 px-3 py-2">
                            About
                        </a>
                        <a href="/services" className="block text-gray-600 hover:text-gray-900 px-3 py-2">
                            Services
                        </a>
                        <a href="/contact" className="block text-gray-600 hover:text-gray-900 px-3 py-2">
                            Contact
                        </a>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;