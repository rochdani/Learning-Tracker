// import React, { useState, useEffect } from 'react';

// export default function AILearningTracker() {
//     const [days, setDays] = useState([]);
//     const [selectedDay, setSelectedDay] = useState(null);
//     const [startDate, setStartDate] = useState('');
//     const [showDateModal, setShowDateModal] = useState(false);
//     const [formData, setFormData] = useState({
//         topic: '',
//         hoursSpent: 1,
//         resources: '',
//         notes: '',
//         projectWork: '',
//         completed: false
//     });

//     useEffect(() => {
//         loadData();
//     }, []);

//     const loadData = () => {
//         try {
//             const savedDays = localStorage.getItem('ai-learning-days');
//             const savedStartDate = localStorage.getItem('ai-start-date');

//             if (savedDays) {
//                 setDays(JSON.parse(savedDays));
//             } else {
//                 initializeDays();
//             }

//             if (savedStartDate) {
//                 setStartDate(savedStartDate);
//             } else {
//                 setShowDateModal(true);
//             }
//         } catch (error) {
//             console.error('Error loading data:', error);
//             initializeDays();
//             setShowDateModal(true);
//         }
//     };

//     const initializeDays = () => {
//         const initialDays = Array.from({ length: 100 }, (_, i) => ({
//             day: i + 1,
//             date: null,
//             topic: '',
//             hoursSpent: 0,
//             resources: '',
//             notes: '',
//             projectWork: '',
//             completed: false
//         }));
//         setDays(initialDays);
//     };

//     const saveData = (updatedDays) => {
//         try {
//             localStorage.setItem('ai-learning-days', JSON.stringify(updatedDays));
//         } catch (error) {
//             console.error('Error saving data:', error);
//         }
//     };

//     const saveStartDate = (date) => {
//         try {
//             localStorage.setItem('ai-start-date', date);
//             setStartDate(date);
//             setShowDateModal(false);
//         } catch (error) {
//             console.error('Error saving start date:', error);
//         }
//     };

//     const getDateForDay = (dayNumber) => {
//         if (!startDate) return null;
//         const start = new Date(startDate);
//         start.setDate(start.getDate() + (dayNumber - 1));
//         return start;
//     };

//     const getDateRangeForMonth = (monthOffset = 0) => {
//         if (!startDate) return { start: null, end: null };
//         const start = new Date(startDate);
//         start.setMonth(start.getMonth() + monthOffset);
//         start.setDate(1);

//         const end = new Date(start);
//         end.setMonth(end.getMonth() + 1);
//         end.setDate(0);

//         return { start, end };
//     };

//     const getCurrentMonthDays = () => {
//         if (!startDate) return [];
//         const today = new Date();
//         return days.filter(day => {
//             const dayDate = getDateForDay(day.day);
//             if (!dayDate) return false;
//             return dayDate.getMonth() === today.getMonth() &&
//                 dayDate.getFullYear() === today.getFullYear();
//         });
//     };

//     const isToday = (dayNumber) => {
//         const dayDate = getDateForDay(dayNumber);
//         if (!dayDate) return false;
//         const today = new Date();
//         return dayDate.toDateString() === today.toDateString();
//     };

//     const formatDate = (date) => {
//         if (!date) return '';
//         return date.toLocaleDateString('en-US', {
//             month: 'short',
//             day: 'numeric',
//             year: 'numeric'
//         });
//     };

//     const handleDayClick = (day) => {
//         setSelectedDay(day);
//         const dayData = days[day - 1];
//         setFormData({
//             topic: dayData.topic || '',
//             hoursSpent: dayData.hoursSpent || 1,
//             resources: dayData.resources || '',
//             notes: dayData.notes || '',
//             projectWork: dayData.projectWork || '',
//             completed: dayData.completed || false
//         });
//     };

//     const handleSubmit = () => {
//         if (!selectedDay) return;

//         const updatedDays = [...days];
//         const dayDate = getDateForDay(selectedDay);
//         updatedDays[selectedDay - 1] = {
//             ...updatedDays[selectedDay - 1],
//             ...formData,
//             date: dayDate ? dayDate.toISOString().split('T')[0] : new Date().toISOString().split('T')[0]
//         };
//         setDays(updatedDays);
//         saveData(updatedDays);
//         setSelectedDay(null);
//     };

//     const exportToCSV = () => {
//         const headers = ['Day', 'Date', 'Topic', 'Hours', 'Resources', 'Notes', 'Project Work', 'Completed'];
//         const rows = days.map(d => {
//             const dayDate = getDateForDay(d.day);
//             return [
//                 d.day,
//                 dayDate ? formatDate(dayDate) : '',
//                 d.topic || '',
//                 d.hoursSpent || 0,
//                 d.resources || '',
//                 d.notes || '',
//                 d.projectWork || '',
//                 d.completed ? 'Yes' : 'No'
//             ];
//         });

//         const csvContent = [
//             headers.join(','),
//             ...rows.map(r => r.map(cell => `"${cell}"`).join(','))
//         ].join('\n');

//         const blob = new Blob([csvContent], { type: 'text/csv' });
//         const url = window.URL.createObjectURL(blob);
//         const a = document.createElement('a');
//         a.href = url;
//         a.download = 'ai-learning-tracker.csv';
//         a.click();
//     };

//     const resetData = () => {
//         if (window.confirm('Are you sure you want to reset all data? This cannot be undone.')) {
//             try {
//                 localStorage.removeItem('ai-learning-days');
//                 localStorage.removeItem('ai-start-date');
//                 initializeDays();
//                 setSelectedDay(null);
//                 setStartDate('');
//                 setShowDateModal(true);
//             } catch (error) {
//                 console.error('Error resetting data:', error);
//             }
//         }
//     };

//     const stats = {
//         completed: days.filter(d => d.completed).length,
//         totalHours: days.reduce((sum, d) => sum + (d.hoursSpent || 0), 0),
//         avgHours: days.filter(d => d.completed).length > 0
//             ? (days.reduce((sum, d) => sum + (d.hoursSpent || 0), 0) / days.filter(d => d.completed).length).toFixed(1)
//             : 0
//     };

//     const currentMonthDays = getCurrentMonthDays();
//     const currentMonthStats = {
//         completed: currentMonthDays.filter(d => d.completed).length,
//         total: currentMonthDays.length,
//         hours: currentMonthDays.reduce((sum, d) => sum + (d.hoursSpent || 0), 0)
//     };

//     return (
//         <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
//             {showDateModal && (
//                 <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//                     <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4">
//                         <h2 className="text-2xl font-bold text-gray-800 mb-4">Set Your Start Date</h2>
//                         <p className="text-gray-600 mb-6">Choose when you want to begin your 100-day AI learning journey</p>
//                         <input
//                             type="date"
//                             value={startDate}
//                             onChange={(e) => setStartDate(e.target.value)}
//                             className="w-full p-3 border border-gray-300 rounded-lg mb-6 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                         />
//                         <button
//                             onClick={() => saveStartDate(startDate)}
//                             disabled={!startDate}
//                             className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
//                         >
//                             Start My Journey
//                         </button>
//                     </div>
//                 </div>
//             )}

//             <div className="max-w-7xl mx-auto">
//                 <div className="bg-white rounded-2xl shadow-2xl p-8 mb-6">
//                     <div className="flex items-center justify-between mb-6">
//                         <div>
//                             <h1 className="text-4xl font-bold text-gray-800 mb-2">100-Day AI Learning Journey</h1>
//                             <p className="text-gray-600">Track your progress towards AI mastery, Roch! 🚀</p>
//                             {startDate && (
//                                 <div className="mt-2 space-y-1">
//                                     <p className="text-sm text-gray-500">
//                                         Journey Start: <span className="font-semibold text-blue-600">{formatDate(new Date(startDate))}</span>
//                                     </p>
//                                     <p className="text-sm text-gray-500">
//                                         Expected End: <span className="font-semibold text-blue-600">
//                                             {formatDate(new Date(new Date(startDate).setDate(new Date(startDate).getDate() + 99)))}
//                                         </span>
//                                     </p>
//                                 </div>
//                             )}
//                         </div>
//                         <div className="flex gap-3">
//                             <button
//                                 onClick={() => setShowDateModal(true)}
//                                 className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
//                             >
//                                 <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
//                                 </svg>
//                                 Change Date
//                             </button>
//                             <button onClick={exportToCSV} className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition">
//                                 <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
//                                 </svg>
//                                 Export CSV
//                             </button>
//                             <button onClick={resetData} className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition">
//                                 Reset
//                             </button>
//                         </div>
//                     </div>

//                     <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
//                         <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-6 rounded-xl">
//                             <div className="flex items-center justify-between mb-2">
//                                 <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
//                                 </svg>
//                                 <span className="text-3xl font-bold">{stats.completed}</span>
//                             </div>
//                             <p className="text-blue-100">Total Completed</p>
//                         </div>
//                         <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white p-6 rounded-xl">
//                             <div className="flex items-center justify-between mb-2">
//                                 <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
//                                 </svg>
//                                 <span className="text-3xl font-bold">{stats.totalHours}h</span>
//                             </div>
//                             <p className="text-purple-100">Total Hours</p>
//                         </div>
//                         <div className="bg-gradient-to-br from-green-500 to-green-600 text-white p-6 rounded-xl">
//                             <div className="flex items-center justify-between mb-2">
//                                 <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
//                                 </svg>
//                                 <span className="text-3xl font-bold">{stats.avgHours}h</span>
//                             </div>
//                             <p className="text-green-100">Avg Hours/Day</p>
//                         </div>
//                         <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white p-6 rounded-xl">
//                             <div className="flex items-center justify-between mb-2">
//                                 <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
//                                 </svg>
//                                 <span className="text-3xl font-bold">{Math.round((stats.completed / 100) * 100)}%</span>
//                             </div>
//                             <p className="text-orange-100">Overall Progress</p>
//                         </div>
//                         <div className="bg-gradient-to-br from-pink-500 to-pink-600 text-white p-6 rounded-xl">
//                             <div className="flex items-center justify-between mb-2">
//                                 <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
//                                 </svg>
//                                 <span className="text-3xl font-bold">{currentMonthStats.completed}/{currentMonthStats.total}</span>
//                             </div>
//                             <p className="text-pink-100">This Month</p>
//                         </div>
//                     </div>

//                     {startDate && currentMonthDays.length > 0 && (
//                         <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-6 rounded-xl mb-6">
//                             <h3 className="text-xl font-bold text-gray-800 mb-4">
//                                 📅 Current Month: {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
//                             </h3>
//                             <div className="grid grid-cols-3 gap-4 mb-4">
//                                 <div className="bg-white p-4 rounded-lg">
//                                     <p className="text-sm text-gray-600">Days in Month</p>
//                                     <p className="text-2xl font-bold text-gray-800">{currentMonthStats.total}</p>
//                                 </div>
//                                 <div className="bg-white p-4 rounded-lg">
//                                     <p className="text-sm text-gray-600">Completed</p>
//                                     <p className="text-2xl font-bold text-green-600">{currentMonthStats.completed}</p>
//                                 </div>
//                                 <div className="bg-white p-4 rounded-lg">
//                                     <p className="text-sm text-gray-600">Hours This Month</p>
//                                     <p className="text-2xl font-bold text-blue-600">{currentMonthStats.hours.toFixed(1)}h</p>
//                                 </div>
//                             </div>
//                             <div className="flex flex-wrap gap-2">
//                                 {currentMonthDays.map((day) => (
//                                     <button
//                                         key={day.day}
//                                         onClick={() => handleDayClick(day.day)}
//                                         className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all hover:scale-105 ${isToday(day.day)
//                                                 ? 'ring-4 ring-yellow-400 ring-opacity-50'
//                                                 : ''
//                                             } ${day.completed
//                                                 ? 'bg-gradient-to-br from-green-500 to-green-600 text-white shadow-lg'
//                                                 : 'bg-white text-gray-600 border-2 border-gray-200 hover:border-blue-400'
//                                             }`}
//                                     >
//                                         Day {day.day}
//                                         {isToday(day.day) && ' 🔥'}
//                                     </button>
//                                 ))}
//                             </div>
//                         </div>
//                     )}

//                     <div className="mb-6">
//                         <h3 className="text-lg font-semibold text-gray-700 mb-3">All 100 Days</h3>
//                         <div className="w-full bg-gray-200 rounded-full h-4 mb-4">
//                             <div
//                                 className="bg-gradient-to-r from-blue-500 to-purple-600 h-4 rounded-full transition-all duration-500"
//                                 style={{ width: `${(stats.completed / 100) * 100}%` }}
//                             />
//                         </div>
//                     </div>

//                     <div className="grid grid-cols-10 gap-2 mb-8">
//                         {days.map((day) => (
//                             <button
//                                 key={day.day}
//                                 onClick={() => handleDayClick(day.day)}
//                                 className={`aspect-square rounded-lg font-semibold text-sm transition-all hover:scale-110 relative ${isToday(day.day)
//                                         ? 'ring-4 ring-yellow-400 ring-opacity-50'
//                                         : ''
//                                     } ${day.completed
//                                         ? 'bg-gradient-to-br from-green-500 to-green-600 text-white shadow-lg'
//                                         : selectedDay === day.day
//                                             ? 'bg-blue-500 text-white shadow-lg'
//                                             : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
//                                     }`}
//                                 title={startDate ? formatDate(getDateForDay(day.day)) : `Day ${day.day}`}
//                             >
//                                 {day.day}
//                                 {isToday(day.day) && (
//                                     <span className="absolute -top-1 -right-1 text-xs">🔥</span>
//                                 )}
//                             </button>
//                         ))}
//                     </div>

//                     {selectedDay && (
//                         <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-6 rounded-xl">
//                             <div className="flex justify-between items-center mb-4">
//                                 <div>
//                                     <h2 className="text-2xl font-bold text-gray-800">Day {selectedDay} Details</h2>
//                                     {startDate && (
//                                         <p className="text-sm text-gray-600 mt-1">
//                                             Date: {formatDate(getDateForDay(selectedDay))}
//                                             {isToday(selectedDay) && <span className="ml-2 text-orange-600 font-semibold">• Today 🔥</span>}
//                                         </p>
//                                     )}
//                                 </div>
//                             </div>
//                             <div className="space-y-4">
//                                 <div>
//                                     <label className="block text-sm font-semibold text-gray-700 mb-2">Topic Covered</label>
//                                     <input
//                                         type="text"
//                                         value={formData.topic}
//                                         onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
//                                         className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                                         placeholder="e.g., Introduction to Neural Networks"
//                                     />
//                                 </div>
//                                 <div>
//                                     <label className="block text-sm font-semibold text-gray-700 mb-2">Hours Spent</label>
//                                     <input
//                                         type="number"
//                                         step="0.5"
//                                         min="0"
//                                         value={formData.hoursSpent}
//                                         onChange={(e) => setFormData({ ...formData, hoursSpent: parseFloat(e.target.value) })}
//                                         className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                                     />
//                                 </div>
//                                 <div>
//                                     <label className="block text-sm font-semibold text-gray-700 mb-2">Resources Used</label>
//                                     <input
//                                         type="text"
//                                         value={formData.resources}
//                                         onChange={(e) => setFormData({ ...formData, resources: e.target.value })}
//                                         className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                                         placeholder="e.g., Coursera, YouTube, Documentation"
//                                     />
//                                 </div>
//                                 <div>
//                                     <label className="block text-sm font-semibold text-gray-700 mb-2">Notes</label>
//                                     <textarea
//                                         value={formData.notes}
//                                         onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
//                                         className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                                         rows="3"
//                                         placeholder="Key learnings, insights, challenges..."
//                                     />
//                                 </div>
//                                 <div>
//                                     <label className="block text-sm font-semibold text-gray-700 mb-2">Project Work</label>
//                                     <textarea
//                                         value={formData.projectWork}
//                                         onChange={(e) => setFormData({ ...formData, projectWork: e.target.value })}
//                                         className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                                         rows="2"
//                                         placeholder="Any hands-on project or coding work done today..."
//                                     />
//                                 </div>
//                                 <div className="flex items-center gap-3">
//                                     <input
//                                         type="checkbox"
//                                         checked={formData.completed}
//                                         onChange={(e) => setFormData({ ...formData, completed: e.target.checked })}
//                                         className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
//                                     />
//                                     <label className="text-sm font-semibold text-gray-700">Mark as completed</label>
//                                 </div>
//                                 <div className="flex gap-3">
//                                     <button
//                                         onClick={handleSubmit}
//                                         className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition"
//                                     >
//                                         Save Progress
//                                     </button>
//                                     <button
//                                         onClick={() => setSelectedDay(null)}
//                                         className="px-6 bg-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-400 transition"
//                                     >
//                                         Cancel
//                                     </button>
//                                 </div>
//                             </div>
//                         </div>
//                     )}
//                 </div>
//             </div>
//         </div>
//     );
// }

import React, { useState, useEffect } from 'react';
import {
    getAllDays,
    saveDay,
    getStartDate,
    setStartDate as saveStartDateToSupabase,
    resetAllData,
    getStats,
    getCurrentMonthStats,
    exportToCSV as exportCSVFromSupabase,
    initializeDays as initializeSupabaseDays
} from './supabaseClient';

export default function AILearningTracker() {
    const [days, setDays] = useState([]);
    const [selectedDay, setSelectedDay] = useState(null);
    const [startDate, setStartDate] = useState('');
    const [showDateModal, setShowDateModal] = useState(false);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        completed: 0,
        totalHours: 0,
        avgHours: 0
    });
    const [currentMonthStats, setCurrentMonthStats] = useState({
        completed: 0,
        total: 0,
        hours: 0
    });
    const [formData, setFormData] = useState({
        topic: '',
        hoursSpent: 1,
        resources: '',
        notes: '',
        projectWork: '',
        completed: false
    });

    const userId = 'roch';

    useEffect(() => {
        loadData();
    }, []);

    useEffect(() => {
        if (startDate) {
            loadStats();
        }
    }, [days, startDate]);

    const loadData = async () => {
        setLoading(true);
        try {
            const savedStartDate = await getStartDate(userId);

            if (savedStartDate) {
                setStartDate(savedStartDate);
            } else {
                setShowDateModal(true);
            }

            let daysData = await getAllDays(userId);

            if (daysData.length === 0) {
                await initializeSupabaseDays(userId);
                daysData = await getAllDays(userId);
            }

            const transformedDays = daysData.map(d => ({
                day: d.day_number,
                date: d.date,
                topic: d.topic || '',
                hoursSpent: parseFloat(d.hours_spent) || 0,
                resources: d.resources || '',
                notes: d.notes || '',
                projectWork: d.project_work || '',
                completed: d.completed || false
            }));

            setDays(transformedDays);
        } catch (error) {
            console.error('Error loading data:', error);
        } finally {
            setLoading(false);
        }
    };

    const loadStats = async () => {
        try {
            const statsData = await getStats(userId);
            setStats({
                completed: statsData.completed,
                totalHours: parseFloat(statsData.totalHours),
                avgHours: parseFloat(statsData.avgHours)
            });

            const monthStats = await getCurrentMonthStats(userId, startDate);
            setCurrentMonthStats(monthStats);
        } catch (error) {
            console.error('Error loading stats:', error);
        }
    };

    const handleSaveStartDate = async (date) => {
        try {
            const success = await saveStartDateToSupabase(userId, date);
            if (success) {
                setStartDate(date);
                setShowDateModal(false);
                await loadData();
            } else {
                alert('Failed to save start date. Please try again.');
            }
        } catch (error) {
            console.error('Error saving start date:', error);
            alert('Error saving start date. Please try again.');
        }
    };

    const getDateForDay = (dayNumber) => {
        if (!startDate) return null;
        const start = new Date(startDate);
        start.setDate(start.getDate() + (dayNumber - 1));
        return start;
    };

    const getCurrentMonthDays = () => {
        if (!startDate) return [];
        const today = new Date();
        return days.filter(day => {
            const dayDate = getDateForDay(day.day);
            if (!dayDate) return false;
            return dayDate.getMonth() === today.getMonth() &&
                dayDate.getFullYear() === today.getFullYear();
        });
    };

    const isToday = (dayNumber) => {
        const dayDate = getDateForDay(dayNumber);
        if (!dayDate) return false;
        const today = new Date();
        return dayDate.toDateString() === today.toDateString();
    };

    const formatDate = (date) => {
        if (!date) return '';
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    const handleDayClick = (day) => {
        setSelectedDay(day);
        const dayData = days.find(d => d.day === day);
        if (dayData) {
            setFormData({
                topic: dayData.topic || '',
                hoursSpent: dayData.hoursSpent || 1,
                resources: dayData.resources || '',
                notes: dayData.notes || '',
                projectWork: dayData.projectWork || '',
                completed: dayData.completed || false
            });
        }
    };

    const handleSubmit = async () => {
        if (!selectedDay) return;

        try {
            const dayDate = getDateForDay(selectedDay);
            const dayData = {
                day: selectedDay,
                date: dayDate ? dayDate.toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
                topic: formData.topic,
                hoursSpent: formData.hoursSpent,
                resources: formData.resources,
                notes: formData.notes,
                projectWork: formData.projectWork,
                completed: formData.completed
            };

            const savedDay = await saveDay(userId, dayData);

            if (savedDay) {
                setDays(prevDays => {
                    const newDays = [...prevDays];
                    const index = newDays.findIndex(d => d.day === selectedDay);
                    if (index !== -1) {
                        newDays[index] = dayData;
                    }
                    return newDays;
                });

                setSelectedDay(null);
                await loadStats();
            } else {
                alert('Failed to save day. Please try again.');
            }
        } catch (error) {
            console.error('Error submitting day:', error);
            alert('Error saving day. Please try again.');
        }
    };

    const handleExportToCSV = async () => {
        try {
            const csvContent = await exportCSVFromSupabase(userId);
            const blob = new Blob([csvContent], { type: 'text/csv' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'ai-learning-tracker.csv';
            a.click();
        } catch (error) {
            console.error('Error exporting CSV:', error);
            alert('Error exporting data. Please try again.');
        }
    };

    const handleResetData = async () => {
        if (window.confirm('Are you sure you want to reset all data? This cannot be undone.')) {
            try {
                const success = await resetAllData(userId);
                if (success) {
                    setDays([]);
                    setStartDate('');
                    setShowDateModal(true);
                    await loadData();
                } else {
                    alert('Failed to reset data. Please try again.');
                }
            } catch (error) {
                console.error('Error resetting data:', error);
                alert('Error resetting data. Please try again.');
            }
        }
    };

    const currentMonthDaysFiltered = getCurrentMonthDays();

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-xl font-semibold text-gray-700">Loading your learning journey...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
            {showDateModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4">
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">Set Your Start Date</h2>
                        <p className="text-gray-600 mb-6">Choose when you want to begin your 100-day AI learning journey</p>
                        <input
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-lg mb-6 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        <button
                            onClick={() => handleSaveStartDate(startDate)}
                            disabled={!startDate}
                            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Start My Journey
                        </button>
                    </div>
                </div>
            )}

            <div className="max-w-7xl mx-auto">
                <div className="bg-white rounded-2xl shadow-2xl p-8 mb-6">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h1 className="text-4xl font-bold text-gray-800 mb-2">100-Day AI Learning Journey</h1>
                            <p className="text-gray-600">Track your progress towards AI mastery, Roch! 🚀</p>
                            {startDate && (
                                <div className="mt-2 space-y-1">
                                    <p className="text-sm text-gray-500">
                                        Journey Start: <span className="font-semibold text-blue-600">{formatDate(new Date(startDate))}</span>
                                    </p>
                                    <p className="text-sm text-gray-500">
                                        Expected End: <span className="font-semibold text-blue-600">
                                            {formatDate(new Date(new Date(startDate).setDate(new Date(startDate).getDate() + 99)))}
                                        </span>
                                    </p>
                                </div>
                            )}
                        </div>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowDateModal(true)}
                                className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                Change Date
                            </button>
                            <button onClick={handleExportToCSV} className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                </svg>
                                Export CSV
                            </button>
                            <button onClick={handleResetData} className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition">
                                Reset
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
                        <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-6 rounded-xl">
                            <div className="flex items-center justify-between mb-2">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                                </svg>
                                <span className="text-3xl font-bold">{stats.completed}</span>
                            </div>
                            <p className="text-blue-100">Total Completed</p>
                        </div>
                        <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white p-6 rounded-xl">
                            <div className="flex items-center justify-between mb-2">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span className="text-3xl font-bold">{stats.totalHours}h</span>
                            </div>
                            <p className="text-purple-100">Total Hours</p>
                        </div>
                        <div className="bg-gradient-to-br from-green-500 to-green-600 text-white p-6 rounded-xl">
                            <div className="flex items-center justify-between mb-2">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                                </svg>
                                <span className="text-3xl font-bold">{stats.avgHours}h</span>
                            </div>
                            <p className="text-green-100">Avg Hours/Day</p>
                        </div>
                        <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white p-6 rounded-xl">
                            <div className="flex items-center justify-between mb-2">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span className="text-3xl font-bold">{Math.round((stats.completed / 100) * 100)}%</span>
                            </div>
                            <p className="text-orange-100">Overall Progress</p>
                        </div>
                        <div className="bg-gradient-to-br from-pink-500 to-pink-600 text-white p-6 rounded-xl">
                            <div className="flex items-center justify-between mb-2">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                <span className="text-3xl font-bold">{currentMonthStats.completed}/{currentMonthStats.total}</span>
                            </div>
                            <p className="text-pink-100">This Month</p>
                        </div>
                    </div>

                    {startDate && currentMonthDaysFiltered.length > 0 && (
                        <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-6 rounded-xl mb-6">
                            <h3 className="text-xl font-bold text-gray-800 mb-4">
                                📅 Current Month: {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                            </h3>
                            <div className="grid grid-cols-3 gap-4 mb-4">
                                <div className="bg-white p-4 rounded-lg">
                                    <p className="text-sm text-gray-600">Days in Month</p>
                                    <p className="text-2xl font-bold text-gray-800">{currentMonthStats.total}</p>
                                </div>
                                <div className="bg-white p-4 rounded-lg">
                                    <p className="text-sm text-gray-600">Completed</p>
                                    <p className="text-2xl font-bold text-green-600">{currentMonthStats.completed}</p>
                                </div>
                                <div className="bg-white p-4 rounded-lg">
                                    <p className="text-sm text-gray-600">Hours This Month</p>
                                    <p className="text-2xl font-bold text-blue-600">{currentMonthStats.hours}h</p>
                                </div>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {currentMonthDaysFiltered.map((day) => (
                                    <button
                                        key={day.day}
                                        onClick={() => handleDayClick(day.day)}
                                        className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all hover:scale-105 ${isToday(day.day)
                                                ? 'ring-4 ring-yellow-400 ring-opacity-50'
                                                : ''
                                            } ${day.completed
                                                ? 'bg-gradient-to-br from-green-500 to-green-600 text-white shadow-lg'
                                                : 'bg-white text-gray-600 border-2 border-gray-200 hover:border-blue-400'
                                            }`}
                                    >
                                        Day {day.day}
                                        {isToday(day.day) && ' 🔥'}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="mb-6">
                        <h3 className="text-lg font-semibold text-gray-700 mb-3">All 100 Days</h3>
                        <div className="w-full bg-gray-200 rounded-full h-4 mb-4">
                            <div
                                className="bg-gradient-to-r from-blue-500 to-purple-600 h-4 rounded-full transition-all duration-500"
                                style={{ width: `${(stats.completed / 100) * 100}%` }}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-10 gap-2 mb-8">
                        {days.map((day) => (
                            <button
                                key={day.day}
                                onClick={() => handleDayClick(day.day)}
                                className={`aspect-square rounded-lg font-semibold text-sm transition-all hover:scale-110 relative ${isToday(day.day)
                                        ? 'ring-4 ring-yellow-400 ring-opacity-50'
                                        : ''
                                    } ${day.completed
                                        ? 'bg-gradient-to-br from-green-500 to-green-600 text-white shadow-lg'
                                        : selectedDay === day.day
                                            ? 'bg-blue-500 text-white shadow-lg'
                                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                    }`}
                                title={startDate ? formatDate(getDateForDay(day.day)) : `Day ${day.day}`}
                            >
                                {day.day}
                                {isToday(day.day) && (
                                    <span className="absolute -top-1 -right-1 text-xs">🔥</span>
                                )}
                            </button>
                        ))}
                    </div>

                    {selectedDay && (
                        <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-6 rounded-xl">
                            <div className="flex justify-between items-center mb-4">
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-800">Day {selectedDay} Details</h2>
                                    {startDate && (
                                        <p className="text-sm text-gray-600 mt-1">
                                            Date: {formatDate(getDateForDay(selectedDay))}
                                            {isToday(selectedDay) && <span className="ml-2 text-orange-600 font-semibold">• Today 🔥</span>}
                                        </p>
                                    )}
                                </div>
                            </div>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Topic Covered</label>
                                    <input
                                        type="text"
                                        value={formData.topic}
                                        onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="e.g., Introduction to Neural Networks"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Hours Spent</label>
                                    <input
                                        type="number"
                                        step="0.5"
                                        min="0"
                                        value={formData.hoursSpent}
                                        onChange={(e) => setFormData({ ...formData, hoursSpent: parseFloat(e.target.value) })}
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Resources Used</label>
                                    <input
                                        type="text"
                                        value={formData.resources}
                                        onChange={(e) => setFormData({ ...formData, resources: e.target.value })}
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="e.g., Coursera, YouTube, Documentation"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Notes</label>
                                    <textarea
                                        value={formData.notes}
                                        onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        rows="3"
                                        placeholder="Key learnings, insights, challenges..."
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Project Work</label>
                                    <textarea
                                        value={formData.projectWork}
                                        onChange={(e) => setFormData({ ...formData, projectWork: e.target.value })}
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        rows="2"
                                        placeholder="Any hands-on project or coding work done today..."
                                    />
                                </div>
                                <div className="flex items-center gap-3">
                                    <input
                                        type="checkbox"
                                        checked={formData.completed}
                                        onChange={(e) => setFormData({ ...formData, completed: e.target.checked })}
                                        className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                                    />
                                    <label className="text-sm font-semibold text-gray-700">Mark as completed</label>
                                </div>
                                <div className="flex gap-3">
                                    <button
                                        onClick={handleSubmit}
                                        className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition"
                                    >
                                        Save Progress
                                    </button>
                                    <button
                                        onClick={() => setSelectedDay(null)}
                                        className="px-6 bg-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-400 transition"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

