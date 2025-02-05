import React from "react";
import "./home.css";

const Home = () => {
  return (
    <div className="absolute inset-0 flex justify-center items-center">
      {" "}
      {/* Flexbox applied here */}
      <div className="absolute inset-0 flex justify-center items-center">
        <div className="bg-shape1 bg-teal opacity-50 bg-blur"></div>
        <div className="bg-shape2 bg-primaryhome opacity-50 bg-blur"></div>
        <div className="bg-shape1 bg-purple opacity-50 bg-blur"></div>
      </div>
      <div className="text-center">
        <h1 className="font-carmen z-50">NeuroWellness AI</h1>
        <p className="font-varelaround text-center text-3xl">
          Therapy that works
        </p>
      </div>
    </div>
  );
};

export default Home;
