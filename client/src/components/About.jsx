import React from "react";
import Footer from "./student/Footer";
import { useClerk, useUser } from "@clerk/clerk-react";
import { Link } from "react-router-dom";

const About = () => {
	const { user } = useUser();
	const { openSignIn } = useClerk();
	
	return (
		<>
			<div className="w-full mx-auto px-6 py-12 bg-gradient-to-b from-cyan-100/40">
				<h1 className="text-4xl font-bold text-center text-gray-800 mb-6">
					About Edemy LMS
				</h1>
				<p className="text-lg text-gray-600 text-center mb-8">
					Empowering learners and educators with a seamless online learning
					experience.
				</p>

				{/* Section: Our Mission */}
				<div className=" p-8 rounded-lg shadow-lg mb-8">
					<h2 className="text-2xl font-semibold text-gray-700 mb-4">
						Our Mission
					</h2>
					<p className="text-gray-600">
						At Edemy LMS, we strive to make education accessible and engaging
						for everyone. Our platform bridges the gap between students and
						educators by providing high-quality courses, interactive learning
						tools, and an intuitive user experience.
					</p>
				</div>

				{/* Section: Why Choose Us */}
				<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
					<div className="p-6 border rounded-lg shadow-md text-center">
						<h3 className="text-xl font-semibold text-gray-700">
							📚 Quality Courses
						</h3>
						<p className="text-gray-600 mt-2">
							Learn from expert educators through well-structured and engaging
							courses.
						</p>
					</div>
					<div className="p-6 border rounded-lg shadow-md text-center">
						<h3 className="text-xl font-semibold text-gray-700">
							🚀 Interactive Learning
						</h3>
						<p className="text-gray-600 mt-2">
							Our platform includes real-time progress tracking, quizzes, and
							hands-on projects.
						</p>
					</div>
					<div className="p-6 border rounded-lg shadow-md text-center">
						<h3 className="text-xl font-semibold text-gray-700">
							🌍 Global Access
						</h3>
						<p className="text-gray-600 mt-2">
							Learn anytime, anywhere, on any device with a seamless experience.
						</p>
					</div>
				</div>

				{/* Section: Join Us */}
				<div className="mt-12 text-center">
					<h2 className="text-2xl font-semibold text-gray-700 mb-4">
						Join Edemy LMS Today
					</h2>
					<p className="text-gray-600 mb-6">
						Whether you're a student looking to enhance your skills or an
						educator wanting to share knowledge, Edemy LMS is the perfect
						platform for you.
					</p>

					{user ? (
						<Link to="/" className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition duration-300"> Get Startd</Link>
					) : (
						<button
							onClick={() => openSignIn()}
							className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition duration-300"
						>
							Get Started
						</button>
					)}
				</div>
			</div>
			<Footer />
		</>
	);
};

export default About;
