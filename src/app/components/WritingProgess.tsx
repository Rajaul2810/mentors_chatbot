import React, { useEffect, useState } from 'react'

interface UserInfo {
    name: string;
    email: string;
    phone: string;
}

interface WritingProgressData {
    averageScore: number;
    writingLevel: string;
    totalSubmissions: number;
   
}

interface SpeakingProgressData {
    speakingAverageScore: number;
    speakingLevel: string;
    speakingTotalSubmissions: number;
}

const WritingProgess = ({ ieltsModule }: { ieltsModule: string }) => {
    const [user, setUser] = useState<UserInfo>({
        name: '',
        email: '',
        phone: ''
    });
    
    useEffect(() => {
        const storedUserInfo = localStorage.getItem('userInfo');
        if (storedUserInfo) {
            setUser(JSON.parse(storedUserInfo));
        }
    }, []);

    const [WritingProgressData, setWritingProgressData] = useState<WritingProgressData>({
        averageScore: 0,
        writingLevel: '',
        totalSubmissions: 0,
    });
    const [SpeakingProgressData, setSpeakingProgressData] = useState<SpeakingProgressData>({
        speakingAverageScore: 0,
        speakingLevel: '',
        speakingTotalSubmissions: 0
    });

    useEffect(() => {
        if (ieltsModule === 'writing') {
            const fetchWritingProgress = async () => {
                const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/writing/progress`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ mysqlUserId: Number(user.phone), name: user.name, email: user.email, phone: user.phone })
                })
                const data = await response.json();
                console.log('writing data', data);
                setWritingProgressData({
                    averageScore: data.averageScore || 0,
                    writingLevel: data.writingLevel || 'Beginner',
                    totalSubmissions: data.totalSubmissions || 0
                });
            }
            fetchWritingProgress();

        } else if (ieltsModule === 'speaking') {
            const fetchSpeakingProgress = async () => {
                const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/speaking/progress`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ mysqlUserId: Number(user.phone), name: user.name, email: user.email, phone: user.phone })
                })
                const data = await response.json();
                console.log('speaking data', data);
                setSpeakingProgressData({
                    speakingAverageScore: data.speakingAverageScore || 0,
                    speakingLevel: data.speakingLevel || 'Beginner',
                    speakingTotalSubmissions: data.speakingTotalSubmissions || 0
                });
            }
            fetchSpeakingProgress();
        }
        
    }, [user, ieltsModule]);

    console.log(WritingProgressData, SpeakingProgressData, user);

    return (
        <div className="grid grid-cols-3 gap-2 md:gap-4 mb-6 place-items-center">
            <div className="flex items-center gap-2 md:gap-3 w-fit bg-[#05D7A0] rounded-full py-2 px-2 md:px-6">
                <div className='flex items-center gap-1'>
                    <h3 className="text-white text-sm">Level: </h3>
                    <p className="text-white text-sm font-bold">{ieltsModule === 'writing' ? WritingProgressData.writingLevel : SpeakingProgressData.speakingLevel}</p>
                </div>
            </div>
            <div className="flex items-center gap-2 md:gap-3 w-fit bg-[#9D6CFF] rounded-full py-2 px-2 md:px-6">
                <div className='flex items-center gap-1'>
                    <h3 className="text-white text-sm">Avg Score: </h3>
                    <p className="text-white text-sm font-bold">{(ieltsModule === 'writing' ? WritingProgressData.averageScore : SpeakingProgressData.speakingAverageScore * 10).toFixed(1)}%</p>
                </div>
            </div>

            <div className="flex items-center gap-2 md:gap-3 w-fit bg-[#FF4155] rounded-full py-2 px-2 md:px-6">
                <div className='flex items-center gap-1'>
                    <h3 className="text-white text-sm">Submissions: </h3>
                    <p className="text-white text-sm font-bold">{ieltsModule === 'writing' ? WritingProgressData.totalSubmissions : SpeakingProgressData.speakingTotalSubmissions}</p>
                </div>
            </div>
        </div>


    )
}

export default WritingProgess