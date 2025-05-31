import React, { useEffect, useState } from 'react'

interface UserInfo {
    name: string;
    email: string;
    phone: string;
}

interface ProgressData {
    averageScore: number;
    level: string;
    totalSubmissions: number;
}

const WritingProgess = () => {
    const [user, setUser] = useState<UserInfo>({
        name: '',
        email: '',
        phone: ''
    });
    const [progressData, setProgressData] = useState<ProgressData>({
        averageScore: 0,
        level: '',
        totalSubmissions: 0
    });
    
  
    useEffect(() => {
        // Load user info from localStorage
        const storedUserInfo = localStorage.getItem('userInfo');
        if (storedUserInfo) {
            setUser(JSON.parse(storedUserInfo));
        }
      }, []);


    useEffect(() => {
        const fetchProgress = async () => {
            const response = await fetch('https://chatbotbackend.mentorslearning.com/api/writing/progress', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ mysqlUserId: user.phone, name: user.name, email: user.email, phone: user.phone })
            })
            const data = await response.json();
            setProgressData({
                averageScore: data.averageScore || 0,
                level: data.level || 'Beginner',
                totalSubmissions: data.totalSubmissions || 0
            });
        }
        fetchProgress();
    }, [user]);

    return (
        <div className="grid grid-cols-3 gap-2 md:gap-4 mb-6 place-items-center">
            <div className="flex items-center gap-2 md:gap-3 w-fit bg-[#05D7A0] rounded-full py-2 px-2 md:px-6">
                <div className='flex items-center gap-1'>
                    <h3 className="text-white text-sm">Level: </h3>
                    <p className="text-white text-sm font-bold">{progressData.level}</p>
                </div>
            </div>
            <div className="flex items-center gap-2 md:gap-3 w-fit bg-[#9D6CFF] rounded-full py-2 px-2 md:px-6">
                <div className='flex items-center gap-1'>
                    <h3 className="text-white text-sm">Avg Score: </h3>
                    <p className="text-white text-sm font-bold">{(progressData.averageScore * 10).toFixed(1)}%</p>
                </div>
            </div>

                <div className="flex items-center gap-2 md:gap-3 w-fit bg-[#FF4155] rounded-full py-2 px-2 md:px-6">
                    <div className='flex items-center gap-1'>
                    <h3 className="text-white text-sm">Submissions: </h3>
                    <p className="text-white text-sm font-bold">{progressData.totalSubmissions}</p>
                </div>
            </div>
        </div>


    )
}

export default WritingProgess