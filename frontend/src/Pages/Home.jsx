import React from "react";

const Home = () => {
    return (
        <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
            <header className="bg-blue-600 w-full py-4 shadow-md">
                <h1 className="text-white text-center text-3xl font-bold">Welcome to Home Page</h1>
            </header>
            <main className="flex-grow flex flex-col items-center justify-center p-4">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">Explore Our Features</h2>
                <p className="text-gray-600 text-center max-w-md">
                    This is a simple homepage built with React and styled using Tailwind CSS. Customize it to suit your needs.
                </p>
                <button className="mt-6 px-6 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700">
                    Get Started
                </button>
            </main>
        </div>
    );
};

export default Home;