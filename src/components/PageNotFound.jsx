import React from "react";

const PageNotFound = () => {
  return (
    <div className="h-screen flex flex-col items-center justify-center bg-gray-900 px-4 sm:px-6 lg:px-8">
      <h1 className="text-6xl font-bold tracking-wider text-white mb-8">404</h1>
      <p className="text-2xl text-center text-white">
        Page not found. Please check the URL and try again.
      </p>
    </div>
  );
};

export default PageNotFound;
