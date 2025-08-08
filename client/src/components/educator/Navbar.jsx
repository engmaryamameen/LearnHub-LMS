import React, { useState } from "react";
import { assets } from "../../assets/assets";
import { useAuth } from "@/context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import Logger from "../Logger";

const Navbar = () => {
	const { user, signOut } = useAuth();
	const navigate = useNavigate();
	const [isMenuOpen, setIsMenuOpen] = useState(false);

	const handleSignOut = async () => {
		try {
			await signOut();
			navigate('/');
		} catch (error) {
			console.error('Sign out error:', error);
		}
	}

	return (
		<nav className="relative z-50">
			{/* Main Navbar */}
			<div className="fixed top-0 left-0 right-0 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 backdrop-blur-md border-b border-white/10 shadow-xl">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="flex items-center justify-between h-16">
						{/* Logo Section */}
						<div className="flex items-center space-x-3">
							<div 
								onClick={() => navigate('/')}
								className="flex items-center space-x-3 cursor-pointer group"
							>
								{/* Custom Logo */}
								<div className="relative">
									<div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 transform group-hover:scale-105">
										<svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
										</svg>
									</div>
									<div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full animate-pulse"></div>
								</div>
								
								{/* Brand Name */}
								<div className="hidden sm:block">
									<h1 className="text-xl font-bold text-white group-hover:text-yellow-200 transition-colors duration-300">
										LearnHub
									</h1>
									<p className="text-xs text-white/70 -mt-1">Educator Portal</p>
								</div>
							</div>
						</div>

						{/* Desktop Navigation */}
						<div className="hidden md:flex items-center space-x-6">
							{/* Visitor Counter */}
							<div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 border border-white/20">
								<div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
								<span className="text-white text-sm font-medium">
									Educators: <span className="text-green-300 font-bold">1,247</span>
								</span>
							</div>

							{/* Navigation Links */}
							<div className="flex items-center space-x-6">
								<Link 
									to="/educator"
									className="text-white/90 hover:text-white font-medium transition-colors duration-200 hover:scale-105 transform"
								>
									Dashboard
								</Link>
								
								<Link 
									to="/educator/add-course"
									className="text-white/90 hover:text-white font-medium transition-colors duration-200 hover:scale-105 transform"
								>
									Add Course
								</Link>
								
								<Link 
									to="/educator/my-courses"
									className="text-white/90 hover:text-white font-medium transition-colors duration-200 hover:scale-105 transform"
								>
									My Courses
								</Link>
								
								<Link 
									to="/educator/students"
									className="text-white/90 hover:text-white font-medium transition-colors duration-200 hover:scale-105 transform"
								>
									Students
								</Link>
							</div>
						</div>

						{/* User Section */}
						<div className="flex items-center space-x-4">
							{/* Logger Component */}
							<div className="hidden md:block">
								<Logger />
							</div>

							{/* User Info */}
							{user ? (
								<div className="flex items-center space-x-4">
									<div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 border border-white/20">
										<div className="w-2 h-2 bg-blue-400 rounded-full"></div>
										<span className="text-white/90 text-sm font-medium truncate">
											{user.email}
										</span>
									</div>
									
									<button
										onClick={handleSignOut}
										className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
									>
										Sign Out
									</button>
								</div>
							) : (
								<div className="flex items-center space-x-2">
									<div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
										<svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
										</svg>
									</div>
									<span className="text-white/90 text-sm font-medium">Guest</span>
								</div>
							)}

							{/* Mobile Menu Button */}
							<div className="md:hidden">
								<button
									onClick={() => setIsMenuOpen(!isMenuOpen)}
									className="text-white hover:text-yellow-200 transition-colors duration-200"
								>
									<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										{isMenuOpen ? (
											<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
										) : (
											<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
										)}
									</svg>
								</button>
							</div>
						</div>
					</div>
				</div>

				{/* Mobile Menu */}
				{isMenuOpen && (
					<div className="md:hidden bg-white/95 backdrop-blur-md border-t border-white/20">
						<div className="px-4 py-4 space-y-4">
							{/* Visitor Counter Mobile */}
							<div className="flex items-center justify-center space-x-2 bg-indigo-500/20 px-4 py-2 rounded-lg">
								<div className="w-2 h-2 bg-green-400 animate-pulse"></div>
								<span className="text-indigo-800 text-sm font-medium">
									Educators: <span className="text-green-600 font-bold">1,247</span>
								</span>
							</div>

							{/* Navigation Links Mobile */}
							<div className="space-y-3">
								<Link 
									to="/educator"
									onClick={() => setIsMenuOpen(false)}
									className="block text-indigo-800 font-medium py-2 px-4 rounded-lg hover:bg-indigo-50 transition-colors duration-200"
								>
									Dashboard
								</Link>
								
								<Link 
									to="/educator/add-course"
									onClick={() => setIsMenuOpen(false)}
									className="block text-indigo-800 font-medium py-2 px-4 rounded-lg hover:bg-indigo-50 transition-colors duration-200"
								>
									Add Course
								</Link>
								
								<Link 
									to="/educator/my-courses"
									onClick={() => setIsMenuOpen(false)}
									className="block text-indigo-800 font-medium py-2 px-4 rounded-lg hover:bg-indigo-50 transition-colors duration-200"
								>
									My Courses
								</Link>
								
								<Link 
									to="/educator/students"
									onClick={() => setIsMenuOpen(false)}
									className="block text-indigo-800 font-medium py-2 px-4 rounded-lg hover:bg-indigo-50 transition-colors duration-200"
								>
									Students
								</Link>
							</div>

							{/* User Section Mobile */}
							{user && (
								<div className="space-y-3 pt-4 border-t border-gray-200">
									<div className="flex items-center space-x-2 bg-indigo-50 rounded-lg px-4 py-2">
										<div className="w-2 h-2 bg-blue-500 rounded-full"></div>
										<span className="text-indigo-800 text-sm font-medium truncate">
											{user.email}
										</span>
									</div>
									
									<button
										onClick={() => {
											handleSignOut();
											setIsMenuOpen(false);
										}}
										className="w-full bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg font-medium transition-colors duration-200"
									>
										Sign Out
									</button>
								</div>
							)}
						</div>
					</div>
				)}
			</div>

			{/* Spacer to prevent content from hiding under fixed navbar */}
			<div className="h-16"></div>
		</nav>
	);
};

export default Navbar;
