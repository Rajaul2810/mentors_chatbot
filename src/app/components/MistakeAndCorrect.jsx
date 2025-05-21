import React from 'react';
import { FaArrowRight } from 'react-icons/fa';
const MistakeAndCorrect = ({ title, mistakes, corrections }) => {
    return (
        <div className="bg-white rounded-2xl shadow p-6 space-y-4">
            <h2 className="text-xl md:text-2xl font-bold text-gray-800">{title}</h2>
            <div className="flex flex-wrap gap-2">
                <div className="text-red-600 border-b pb-1 border-red-200">❌ Mistake</div>
                <div className="text-green-600 border-b pb-1 border-green-200">✅ Correct</div>

                {mistakes.map((item, index) => (
                    <div key={index} className="flex items-center gap-2 bg-gray-100 p-2 rounded-lg">
                        <div className="text-red-500 ">{item}</div>
                        <FaArrowRight className="text-red-400" />
                        <div className="text-green-600">{corrections[index]}</div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MistakeAndCorrect;
