import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../../context/AppContext";
import { Line } from "rc-progress";
import Footer from "../../components/student/Footer";
import { toast } from "react-toastify";
import axios from "axios";

const MyEnrollMents = () => {
	const {
		navigate,
		enrolledCourses,
		calculateCourseDuration,
		userData,
		fetchUserEnrolledCourses,
		backendUrl,
		getAccessToken,
		calculateNoOfLectures,
	} = useContext(AppContext);

	const [progressArray, setProgressArray] = useState([]);
	const [activeFilter, setActiveFilter] = useState('all');
	const [searchTerm, setSearchTerm] = useState('');

	const getCourseProgress = async () => {
		try {
			const token = await getAccessToken();
			if (!token) {
				toast.error('Authentication required')
				return
			}

			const tempProgressArray = await Promise.all(
				enrolledCourses.map(async (course) => {
					const { data } = await axios.post(
						`${backendUrl}/api/user/get-course-progress`,
						{ courseId: course._id },
						{ headers: { Authorization: `Bearer ${token}` } }
					);
					console.log("dta", data.progressData);
					

					let totalLectures = calculateNoOfLectures(course);

					const lectureCompleted = data.progressData
						? data.progressData.lectureCompleted?.length
						: 0;
					return { totalLectures, lectureCompleted };
				})
			);

			setProgressArray(tempProgressArray);
		} catch (error) {
			toast.error(error.message);
		}
	};

	useEffect(()=>{
		if(userData){
			fetchUserEnrolledCourses();
		}
	},[userData])

	useEffect(()=>{
		if(enrolledCourses?.length !== 0){
			getCourseProgress();
		}
	},[enrolledCourses])

	// Filter courses based on status and search
	const filteredCourses = enrolledCourses.filter((course, index) => {
		const progress = progressArray[index];
		const isCompleted = progress && (progress.lectureCompleted / progress.totalLectures === 1);
		const matchesSearch = course.courseTitle.toLowerCase().includes(searchTerm.toLowerCase());
		
		if (activeFilter === 'completed') return isCompleted && matchesSearch;
		if (activeFilter === 'ongoing') return !isCompleted && matchesSearch;
		return matchesSearch;
	});

	const getProgressColor = (progress) => {
		if (progress >= 80) return '#10B981'; // Green
		if (progress >= 50) return '#F59E0B'; // Yellow
		return '#EF4444'; // Red
	};

	const getStatusBadge = (progress) => {
		if (progress === 100) return { text: 'Completed', color: 'bg-green-100 text-green-800' };
		if (progress >= 80) return { text: 'Almost Done', color: 'bg-blue-100 text-blue-800' };
		if (progress >= 50) return { text: 'In Progress', color: 'bg-yellow-100 text-yellow-800' };
		return { text: 'Just Started', color: 'bg-gray-100 text-gray-800' };
	};

	return (
		<>
			<div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
				{/* Header Section */}
				<div className="bg-white shadow-sm border-b border-gray-100">
					<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
						<div className="flex flex-col md:flex-row md:items-center md:justify-between">
							<div>
								<h1 className="text-3xl font-bold text-gray-900 mb-2">My Learning Journey</h1>
								<p className="text-gray-600">Track your progress and continue your educational adventure</p>
							</div>
							<div className="mt-4 md:mt-0">
								<div className="flex items-center space-x-2 text-sm text-gray-500">
									<div className="w-2 h-2 bg-green-500 rounded-full"></div>
									<span>{enrolledCourses?.length || 0} Courses Enrolled</span>
								</div>
							</div>
						</div>
					</div>
				</div>

				{/* Filters and Search Section */}
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
					<div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
						{/* Search Bar */}
						<div className="relative w-full sm:w-96">
							<input
								type="text"
								placeholder="Search your courses..."
								value={searchTerm}
								onChange={(e) => setSearchTerm(e.target.value)}
								className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
							/>
							<svg className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
							</svg>
						</div>

						{/* Filter Buttons */}
						<div className="flex space-x-2">
							{['all', 'ongoing', 'completed'].map((filter) => (
								<button
									key={filter}
									onClick={() => setActiveFilter(filter)}
									className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
										activeFilter === filter
											? 'bg-blue-600 text-white shadow-lg'
											: 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
									}`}
								>
									{filter.charAt(0).toUpperCase() + filter.slice(1)}
								</button>
							))}
						</div>
					</div>
				</div>

				{/* Courses Grid */}
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
					{filteredCourses.length === 0 ? (
						<div className="text-center py-12">
							<div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
								<svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
								</svg>
							</div>
							<h3 className="text-xl font-semibold text-gray-900 mb-2">No courses found</h3>
							<p className="text-gray-600">Try adjusting your search or filters</p>
						</div>
					) : (
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
							{filteredCourses.map((course, index) => {
								const progress = progressArray[index]
									&& (progressArray[index].lectureCompleted * 100) / progressArray[index].totalLectures
									|| 0;
								const statusBadge = getStatusBadge(progress);
								
								return (
									<div
										key={index}
										className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 group cursor-pointer"
										onClick={() => navigate("/player/" + course._id)}
									>
										{/* Course Thumbnail */}
										<div className="relative overflow-hidden">
											<img
												className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
												src={course.courseThumbnail}
												alt={course.courseTitle}
											/>
											<div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
											
											{/* Progress Overlay */}
											<div className="absolute bottom-4 left-4 right-4">
												<div className="bg-white/90 backdrop-blur-sm rounded-lg p-3">
													<div className="flex items-center justify-between mb-2">
														<span className="text-sm font-medium text-gray-700">Progress</span>
														<span className="text-sm font-bold text-gray-900">{Math.round(progress)}%</span>
													</div>
													<div className="w-full bg-gray-200 rounded-full h-2">
														<div
															className="h-2 rounded-full transition-all duration-300"
															style={{
																width: `${progress}%`,
																backgroundColor: getProgressColor(progress)
															}}
														></div>
													</div>
												</div>
											</div>

											{/* Status Badge */}
											<div className="absolute top-4 right-4">
												<span className={`px-3 py-1 rounded-full text-xs font-medium ${statusBadge.color}`}>
													{statusBadge.text}
												</span>
											</div>
										</div>

										{/* Course Content */}
										<div className="p-6">
											<h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors duration-200">
												{course.courseTitle}
											</h3>
											
											<p className="text-gray-600 text-sm mb-4">
												{course.educator?.firstName || 'Unknown'} {course.educator?.lastName || 'Educator'}
											</p>

											{/* Course Stats */}
											<div className="flex items-center justify-between text-sm text-gray-500 mb-4">
												<div className="flex items-center space-x-4">
													<div className="flex items-center space-x-1">
														<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
															<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
														</svg>
														<span>{calculateCourseDuration(course)}</span>
													</div>
													<div className="flex items-center space-x-1">
														<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
															<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
														</svg>
														<span>
															{progressArray[index] ? `${progressArray[index].lectureCompleted}/${progressArray[index].totalLectures}` : '0/0'} Lectures
														</span>
													</div>
												</div>
											</div>

											{/* Action Button - Prioritize Playlist if Available */}
											{course.playlistLink ? (
												<button
													className="w-full bg-gradient-to-r from-red-600 to-red-700 text-white py-3 px-4 rounded-xl font-semibold hover:from-red-700 hover:to-red-800 transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
													onClick={(e) => {
														e.stopPropagation();
														window.open(course.playlistLink, '_blank', 'noopener,noreferrer');
													}}
												>
													<div className="flex items-center justify-center gap-2">
														<svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
															<path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
														</svg>
														<span>Watch Playlist</span>
													</div>
												</button>
											) : (
												<button
													className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-4 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
													onClick={(e) => {
														e.stopPropagation();
														navigate("/player/" + course._id);
													}}
												>
													{progress === 100 ? 'Review Course' : 'Continue Learning'}
												</button>
											)}
										</div>
									</div>
								);
							})}
						</div>
					)}
				</div>
			</div>
			<Footer />
		</>
	);
};

export default MyEnrollMents;
