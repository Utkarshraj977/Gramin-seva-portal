import React from 'react';

const ServiceCard = ({ title, icon, description }) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-lg border-b-4 border-emerald-600 hover:-translate-y-1 transition transform duration-300">
      <div className="text-4xl mb-4 text-amber-600">{icon}</div>
      <h3 className="text-xl font-bold text-gray-800 mb-2">{title}</h3>
      <p className="text-gray-600 text-sm leading-relaxed">{description}</p>
    </div>
  );
};

export default ServiceCard;