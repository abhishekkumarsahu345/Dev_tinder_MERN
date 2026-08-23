/* eslint-disable react-hooks/set-state-in-effect */
import React, { useEffect, useState } from "react";
import Container from "../Components/Container";
import { FaCheck } from "react-icons/fa";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
const Pricing = () => {
  const [premimum, setPremimum] = useState(false);
  const [plan, setPlan] = useState("");
  const { user } = useSelector((store) => store.user);
  const navigate = useNavigate();
  const verifyPremimumUser = async () => {
    try {
      const res = await axios.get(BASE_URL + "payment/verify/premimum", {
        withCredentials: true,
      });

      setPremimum(res.data.data.isPremimum);
      setPlan(res.data.data.membership);
    } catch (error) {
      console.error(error.message);
    }
  };
  useEffect(() => {
    verifyPremimumUser();
  }, []);
  const handleBuy = async (type) => {
    if (!user) {
      return navigate("/auth");
    }
    try {
      const res = await axios.post(
        BASE_URL + "payment/create",
        { membership: type },
        { withCredentials: true },
      );

      const { keyId, amount, currency, notes, orderId } = res.data.data;
      const options = {
        key: keyId, // Replace with your Razorpay key_id
        amount: amount, // Amount is in currency subunits.
        currency: currency,
        name: "ByteMate",
        description: "Welcome to ByteMate",
        order_id: orderId, // This is the order_id created in the backend
        prefill: {
          name: notes.firstName,
          email: notes.emailId,
          memebership: notes.membership,
        },
        theme: {
          color: "#F37254",
        },
        handler: verifyPremimumUser,
      };
      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.eror(error.message);
    }
  };
  if (premimum) {
    return (
      <Container>
        <div className="max-w-xl mx-auto mt-20 bg-slate-900 rounded-2xl p-10 text-center">
          <h1 className="text-3xl font-bold text-slate-100 mb-4">
            🎉 You are a Premium Member
          </h1>

          <p className="text-slate-400 mb-8">
            Thank you for supporting ByteMate ❤️
          </p>

          <div className="bg-slate-800 rounded-xl p-6">
            <h2 className="text-xl font-semibold text-slate-200 mb-2">
              Current Plan
            </h2>
            {plan == "silver" ? (
              <div className="text-4xl font-bold text-indigo-400 uppercase">
                {plan}
              </div>
            ) : (
              <div className="text-4xl font-bold  text-yellow-500 uppercase">
                {plan}
              </div>
            )}

            <p className="text-slate-400 mt-4">
              You have full access to all features of the{" "}
              <span className="font-semibold capitalize">{plan}</span> plan.
            </p>
            <button
              className="mt-6 w-full rounded-xl bg-indigo-700 py-3 font-semibold text-white
                     hover:bg-indigo-600 transition-all duration-200"
              onClick={() => navigate("/feed")}
            >
              Explore Features
            </button>
          </div>
        </div>
      </Container>
    );
  }
  return (
    <Container>
      <div className="max-w-5xl mx-auto mt-14 px-4">
        {/* Header */}
        <h1 className="text-3xl font-bold text-center text-slate-100 mb-4">
          Membership Plans
        </h1>
        <p className="text-center text-slate-400 mb-12">
          Choose the membership that fits your needs.
        </p>

        {/* Plans */}
        <div className="grid gap-8 md:grid-cols-3">
          {/* Free Plan */}
          <div className="bg-slate-900 rounded-2xl p-8">
            <h2 className="text-xl font-semibold text-slate-200 mb-2">Free</h2>
            <p className="text-slate-400 mb-6">
              Basic access to explore the platform.
            </p>

            <div className="text-3xl font-bold text-slate-100 mb-6">₹0</div>

            <ul className="space-y-3 text-slate-400 mb-8">
              <li className="flex items-center gap-2">
                <FaCheck className="text-emerald-400" />
                Create a profile
              </li>
              <li className="flex items-center gap-2">
                <FaCheck className="text-emerald-400" />
                View connections
              </li>
              <li className="flex items-center gap-2">
                <FaCheck className="text-emerald-400" />
                Limited interactions
              </li>
            </ul>

            <button
              type="button" // Add type button to prevent any form submission behavior
              onClick={(e) => {
                e.preventDefault();
                console.log("Navigating to auth..."); // Debugging line
                navigate("/auth");
              }}
              className="w-full bg-slate-800 text-slate-100 py-3 rounded-full hover:bg-slate-700 transition"
            >
              Get Started
            </button>
          </div>

          {/* Silver Plan */}
          <div className="bg-slate-900 rounded-2xl p-8 relative scale-105">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-indigo-500 text-white text-xs px-3 py-1 rounded-full">
              Most Popular
            </div>

            <h2 className="text-xl font-semibold text-slate-200 mb-2">
              Silver
            </h2>
            <p className="text-slate-400 mb-6">Chat with your connections.</p>

            <div className="text-3xl font-bold text-slate-100 mb-6">
              ₹299
              <span className="text-base font-medium text-slate-400">
                /month
              </span>
            </div>

            <ul className="space-y-3 text-slate-400 mb-8">
              <li className="flex items-center gap-2">
                <FaCheck className="text-emerald-400" />
                All Free features
              </li>
              <li className="flex items-center gap-2">
                <FaCheck className="text-emerald-400" />
                Chat with connections
              </li>
              <li className="flex items-center gap-2">
                <FaCheck className="text-emerald-400" />
                Unlimited messages
              </li>
            </ul>

            <button
              className="w-full bg-indigo-500 text-white py-3 rounded-full hover:bg-indigo-600 transition mt-3"
              onClick={() => handleBuy("silver")}
            >
              Choose Silver
            </button>
          </div>

          {/* Gold Plan */}
          <div className="bg-slate-900 rounded-2xl p-8">
            <h2 className="text-xl font-semibold text-slate-200 mb-2">Gold</h2>
            <p className="text-slate-400 mb-6">
              Full communication experience.
            </p>

            <div className="text-3xl font-bold text-slate-100 mb-6">
              ₹599
              <span className="text-base font-medium text-slate-400">
                /month
              </span>
            </div>

            <ul className="space-y-3 text-slate-400 mb-8">
              <li className="flex items-center gap-2">
                <FaCheck className="text-emerald-400" />
                All Silver features
              </li>
              <li className="flex items-center gap-2">
                <FaCheck className="text-emerald-400" />
                Video calls with connections
              </li>
              <li className="flex items-center gap-2">
                <FaCheck className="text-emerald-400" />
                Priority support
              </li>
            </ul>

            <button
              className="w-full bg-yellow-500 text-black py-3 rounded-full hover:bg-yellow-600 transition mt-4"
              onClick={() => handleBuy("gold")}
            >
              Go Gold
            </button>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-slate-500 text-sm mt-12">
          You can upgrade, downgrade, or cancel anytime.
        </p>
      </div>
    </Container>
  );
};

export default Pricing;
