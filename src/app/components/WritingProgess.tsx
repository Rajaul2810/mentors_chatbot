import React, { useEffect, useState } from 'react'
import { FaChartLine, FaTrophy, FaSeedling } from 'react-icons/fa'

interface ProgressData {
    averageScore: number;
    level: string;
    totalSubmissions: number;
}

const WritingProgess = () => {
    const [progressData, setProgressData] = useState<ProgressData>({
        averageScore: 0,
        level: '',
        totalSubmissions: 0
    });

    useEffect(() => {
        const fetchProgress = async () => {
            const response = await fetch('https://chatbotbackend.mentorslearning.com/api/writing/progress', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ mysqlUserId: 1, name: "Hira", email: "hira@gmail.com", phone: "03001234567" })
            })
            const data = await response.json();
            setProgressData({
                averageScore: data.averageScore || 0,
                level: data.level || 'Beginner',
                totalSubmissions: data.totalSubmissions || 0
            });
        }
        fetchProgress();
    }, []);

    return (
        <div className="grid grid-cols-3 gap-2 md:gap-4 mb-6 place-items-center">
            <div className="flex items-center gap-2 md:gap-3 w-fit bg-gradient-to-r from-green-500 to-green-600 rounded-full py-2 px-2 md:px-6">
                <FaSeedling className="text-md md:text-2xl text-white" />
                <div className='flex items-center gap-1'>
                    <h3 className="text-white text-sm">Level: </h3>
                    <p className="text-white text-sm font-bold">{progressData.level}</p>
                </div>
            </div>
            <div className="flex items-center gap-2 md:gap-3 w-fit bg-gradient-to-r from-teal-500 to-teal-600 rounded-full py-2 px-2 md:px-6">
                <FaChartLine className="text-md md:text-2xl text-white" />
                <div className='flex items-center gap-1'>
                    <h3 className="text-white text-sm">Score: </h3>
                    <p className="text-white text-sm font-bold">{progressData.averageScore.toFixed(1)}</p>
                </div>
            </div>

            <div className="flex items-center gap-2 md:gap-3 w-fit bg-gradient-to-r from-blue-500 to-blue-600 rounded-full py-2 px-2 md:px-6">
                <FaTrophy className="text-md md:text-2xl text-white" />
                <div className='flex items-center gap-1'>
                    <h3 className="text-white text-sm">Submissions: </h3>
                    <p className="text-white text-sm font-bold">{progressData.totalSubmissions}</p>
                </div>
            </div>
        </div>


    )
}

export default WritingProgess