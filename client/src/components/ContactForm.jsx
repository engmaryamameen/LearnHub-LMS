import React, { useEffect } from 'react';
import { useForm, ValidationError } from '@formspree/react';
import { useNavigate } from 'react-router-dom';
import Footer from './student/Footer';

const ContactForm = () => {
  const [state, handleSubmit] = useForm("xyzkbwqk");
  const navigate = useNavigate();

  // useEffect always runs, even if the success message is rendered.
  useEffect(() => {
    if (state.succeeded) {
      const timer = setTimeout(() => {
        navigate('/'); // Navigate to the home page after 3 seconds
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [state.succeeded, navigate]);

  return (
    <>
    <div className="mt-20 h-full">
      {state.succeeded ? (
        <p className="text-center text-green-500">
          You will receive a response from the team soon!
        </p>
      ) : (
        <form
          onSubmit={handleSubmit}
          method="POST"
          action="https://formspree.io/f/xyzkbwqk"
          className="max-w-lg mx-auto p-6 bg-white rounded-lg shadow-lg space-y-6"
        >
          {/* Email Field */}
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700 font-semibold mb-2">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              name="email"
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
              required
            />
            <ValidationError
              prefix="Email"
              field="email"
              errors={state.errors}
              className="text-red-500 text-sm"
            />
          </div>
  
          {/* Message Field */}
          <div className="mb-4">
            <label htmlFor="message" className="block text-gray-700 font-semibold mb-2">
              Message
            </label>
            <textarea
              id="message"
              name="message"
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
              required
            />
            <ValidationError
              prefix="Message"
              field="message"
              errors={state.errors}
              className="text-red-500 text-sm"
            />
          </div>
  
          {/* Submit Button */}
          <button
            type="submit"
            disabled={state.submitting}
            className="w-full p-3 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition duration-300 disabled:opacity-50"
          >
            Submit
          </button>
        </form>
      )}
    </div>
    <Footer/>
    </>
  );
};

export default ContactForm;
