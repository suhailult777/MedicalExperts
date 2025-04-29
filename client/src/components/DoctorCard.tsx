import React from 'react';
import { Doctor } from '@/types/doctor';
import { FaCheckCircle, FaUndoAlt, FaThumbsUp } from 'react-icons/fa';

interface DoctorCardProps {
  doctor: Doctor;
}

const DoctorCard: React.FC<DoctorCardProps> = ({ doctor }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden p-5 border border-gray-100">
      <div className="flex flex-col md:flex-row">
        {/* Doctor Image and "Doctor of the Hour" */}
        <div className="md:w-44 flex flex-col mb-3 md:mb-0 md:mr-4">
          <div className="relative">
            <img 
              src={doctor.image} 
              alt={doctor.name} 
              className="w-24 h-24 md:w-28 md:h-28 rounded-full object-cover mb-2 mx-auto md:mx-0"
            />
            {doctor.isHourDoctor && (
              <div className="absolute top-0 right-0 md:-right-3 bg-[#fc9916] text-white text-xs font-medium py-1 px-2 rounded-sm">
                DOCTOR OF THE HOUR
              </div>
            )}
          </div>
        </div>

        {/* Doctor Info */}
        <div className="flex-1">
          <div className="flex flex-col md:flex-row justify-between">
            <div>
              {/* Doctor Name and Verification */}
              <div className="flex items-center mb-1">
                <h2 className="font-semibold text-[#333333] text-lg">{doctor.name}</h2>
                <FaCheckCircle className="text-[#00b38e] ml-1 text-sm" />
              </div>

              {/* Specialization */}
              <p className="text-[#767676] text-sm mb-1">{doctor.specialization}</p>

              {/* Experience and Qualification */}
              <p className="text-xs text-[#02475b] font-semibold mb-2">
                {doctor.experience} YEARS • {doctor.qualification}
              </p>

              {/* Location */}
              <p className="text-xs text-[#767676] mb-1">{doctor.location}</p>
              <p className="text-xs text-[#767676] mb-3">{doctor.hospital}</p>
              
              {/* Rating - only show if rating is available */}
              {doctor.rating > 0 && doctor.totalRatings > 0 && (
                <div className="flex items-center mb-3">
                  <div className="bg-green-100 text-green-700 text-xs px-1.5 py-0.5 rounded-sm flex items-center">
                    <FaThumbsUp className="mr-1 text-[#00b38e]" />
                    <span className="font-medium">{doctor.rating}%</span>
                  </div>
                  <span className="text-xs text-[#767676] ml-1">({doctor.totalRatings}+ Patients)</span>
                </div>
              )}
            </div>

            {/* Price Section */}
            <div className="flex flex-col items-start md:items-end">
              <p className="font-bold text-[#333333] mb-1">₹{doctor.price}</p>
              {/* Cashback info */}
              {doctor.cashback > 0 && (
                <div className="flex items-center text-xs bg-amber-50 text-amber-800 px-2 py-1 rounded-sm mb-3">
                  <FaUndoAlt className="mr-1 text-[#fc9916]" />
                  <span>₹{doctor.cashback} Cashback</span>
                </div>
              )}
            </div>
          </div>

          {/* Consult Button */}
          <div className="flex justify-end">
            <button className="bg-white border border-[#00b38e] text-[#00b38e] py-2 px-6 rounded-md text-sm font-medium hover:bg-[#00b38e] hover:text-white transition-colors">
              Consult Online
              {doctor.availableIn > 0 && (
                <span className="block text-xs font-normal">Available in {doctor.availableIn} minutes</span>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorCard;
