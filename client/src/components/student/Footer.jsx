import React, { useState } from "react";
import { assets } from "../../assets/assets";
import { Link } from "react-router-dom";
import SocialIcons from "../SocialIcons";

const Footer = () => {
	const [subscribeEmail, setSubscribeEmail] = useState("");
	const [isSubscribed, setIsSubscribed] = useState(false);

	const handleSubscribe = (e) => {
		e.preventDefault();
		if (!subscribeEmail || !subscribeEmail.includes('@')) {
			alert('Please enter a valid email address');
			return;
		}
		
		// Replace this with your subscription API integration if needed
		console.log("Subscribed with:", subscribeEmail);
		setIsSubscribed(true);
		setSubscribeEmail("");
		
		// Reset subscription status after 3 seconds
		setTimeout(() => setIsSubscribed(false), 3000);
	};

	return (
		<footer className="bg-gradient-to-br from-gray-900 via-blue-900 to-indigo-900 text-white">
			{/* Main Footer Content */}
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
					{/* Brand Section */}
					<div className="lg:col-span-2">
						<div className="flex items-center space-x-3 mb-6">
							<div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-lg">
								<svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
								</svg>
							</div>
							<div>
								<h3 className="text-2xl font-bold text-white">LearnHub</h3>
								<p className="text-blue-200 text-sm">Your Learning Journey</p>
							</div>
						</div>
						<p className="text-gray-300 leading-relaxed mb-6 max-w-md">
							LearnHub LMS revolutionizes education by making it accessible and engaging. 
							We connect passionate students with expert educators through quality courses, 
							interactive tools, and intuitive design that empowers learning.
						</p>
						<div className="flex items-center space-x-4">
							<div className="flex items-center space-x-2 text-sm text-gray-300">
								<div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
								<span>50K+ Active Learners</span>
							</div>
							<div className="flex items-center space-x-2 text-sm text-gray-300">
								<div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
								<span>500+ Expert Courses</span>
							</div>
						</div>
					</div>

					{/* Quick Links */}
					<div>
						<h4 className="text-lg font-semibold text-white mb-6">Quick Links</h4>
						<ul className="space-y-3">
							<li>
								<Link to="/" className="text-gray-300 hover:text-white transition-colors duration-200 flex items-center space-x-2 group">
									<svg className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
									</svg>
									<span>Home</span>
								</Link>
							</li>
							<li>
								<Link to="/about" className="text-gray-300 hover:text-white transition-colors duration-200 flex items-center space-x-2 group">
									<svg className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
									</svg>
									<span>About Us</span>
								</Link>
							</li>
							<li>
								<Link to="/contact" className="text-gray-300 hover:text-white transition-colors duration-200 flex items-center space-x-2 group">
									<svg className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
									</svg>
									<span>Contact Us</span>
								</Link>
							</li>
							<li>
								<Link to="/privacy" className="text-gray-300 hover:text-white transition-colors duration-200 flex items-center space-x-2 group">
									<svg className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
									</svg>
									<span>Privacy Policy</span>
								</Link>
							</li>
						</ul>
					</div>

					{/* Newsletter Section */}
					<div>
						<h4 className="text-lg font-semibold text-white mb-6">Stay Updated</h4>
						<p className="text-gray-300 text-sm mb-4">
							Get the latest news, articles, and resources delivered to your inbox weekly.
						</p>
						
						<form onSubmit={handleSubscribe} className="space-y-3">
							<div className="relative">
								<input
									type="email"
									placeholder="Enter your email"
									className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
									value={subscribeEmail}
									onChange={(e) => setSubscribeEmail(e.target.value)}
									required
								/>
								<svg className="absolute right-3 top-3.5 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
								</svg>
							</div>
							
							<button
								type="submit"
								className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
							>
								{isSubscribed ? (
									<span className="flex items-center justify-center space-x-2">
										<svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
											<path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
										</svg>
										<span>Subscribed!</span>
									</span>
								) : (
									<span className="flex items-center justify-center space-x-2">
										<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
										</svg>
										<span>Subscribe</span>
									</span>
								)}
							</button>
						</form>

						{/* Social Icons */}
						<div className="mt-6">
							<p className="text-gray-300 text-sm mb-3">Follow us on social media</p>
							<SocialIcons />
						</div>
					</div>
				</div>
			</div>

			{/* Bottom Bar */}
			<div className="border-t border-gray-700/50">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
					<div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
						<div className="flex items-center space-x-2 text-gray-400 text-sm">
							<svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
								<path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
							</svg>
							<span>Copyright 2025 © LearnHub by GPS. All Rights Reserved.</span>
						</div>
						
						<div className="flex items-center space-x-6 text-sm text-gray-400">
							<Link to="/terms" className="hover:text-white transition-colors duration-200">Terms of Service</Link>
							<Link to="/privacy" className="hover:text-white transition-colors duration-200">Privacy Policy</Link>
							<Link to="/cookies" className="hover:text-white transition-colors duration-200">Cookie Policy</Link>
						</div>
					</div>
				</div>
			</div>
		</footer>
	);
};

export default Footer;
