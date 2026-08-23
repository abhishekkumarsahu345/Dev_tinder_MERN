import React from "react";
import Container from "../Components/Container";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate=useNavigate();
  const handleClick=()=>{
    navigate("/auth");
  }
  return (
    <Container>
      {/* Hero Section */}
      <div className="flex flex-col md:flex-row items-center justify-between mt-10 gap-10">
        {/* Left: Text + Button */}
        <div className="text-center md:text-left md:w-1/2">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight leading-snug text-center mb-3">Swipe. Find. Commit.🚀</h1>
          <p className="text-lg text-slate-100 mb-5">
            Meet talented developers, grow your network, and create amazing
            connections. ByteMate helps you find the perfect coding match in no
            time.
          </p>
          <button className="px-6 py-2 rounded bg-indigo-600 hover:bg-indigo-500 text-white transition"
           onClick={handleClick}
          >
            Get Started
          </button>
        </div>

        {/* Right: Banner/Image */}
        <div className="md:w-1/2">
          <img
            src="/banner1.png"
            alt="Developer Banner"
            className="rounded-lg shadow-lg"
          />
        </div>
      </div>

      {/* Key Features Section */}
      <div className="flex flex-col md:flex-row gap-6 mt-10">
        <div className="bg-slate-800 p-6 rounded-lg shadow hover:shadow-lg transition w-full md:w-1/3 text-center">
          <h2 className="text-xl font-bold mb-2 text-white">
            Discover Talented Dev
          </h2>
          <p className="text-gray-300">
            Swipe through profiles to find skilled developers who match your
            vibe.
          </p>
        </div>
        <div className="bg-slate-800 p-6 rounded-lg shadow hover:shadow-lg transition w-full md:w-1/3 text-center">
          <h2 className="text-xl font-bold mb-2 text-white">Easy Swapping</h2>
          <p className="text-gray-300">
            Switch between profiles effortlessly to explore new connections
            quickly.
          </p>
        </div>
        <div className="bg-slate-800 p-6 rounded-lg shadow hover:shadow-lg transition w-full md:w-1/3 text-center">
          <h2 className="text-xl font-bold mb-2 text-white">
            Find Perfect Dev Partner
          </h2>
          <p className="text-gray-300">
            Connect with the right developer to chat, collaborate, and grow
            together.
          </p>
        </div>
      </div>
    </Container>
  );
};

export default Home;
