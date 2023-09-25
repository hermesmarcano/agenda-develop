import React, { useMemo } from 'react';
import { FaRegCalendarTimes } from 'react-icons/fa'; 

const BlockCard = ({ blockingPeriod }) => {
  const { professional, dateTime, blockingReason, blockingDuration } = blockingPeriod;
    
    const endDateTime = useMemo(() => {
        const startDate = new Date(dateTime);
        const endDate = new Date(startDate.getTime() + blockingDuration * 60 * 1000); 
        return new Intl.DateTimeFormat('en', { dateStyle: 'full', timeStyle: 'long' }).format(endDate,);
  }, [dateTime, blockingDuration]);


  return (
    <div className="p-4 rounded-lg shadow-lg">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <FaRegCalendarTimes className="text-red-500 text-3xl mr-2" />
          <div>
            <p className="text-xl font-semibold">Blocked Period</p>
            <p>
              <span className="text-gray-400">Professional:</span> {professional.name}
            </p>
            <p>
              <span className="text-gray-400">Blocking Reason:</span> {blockingReason}
            </p>
            <p>
              <span className="text-gray-400">Block Duration:</span> {new Intl.DateTimeFormat('en', { dateStyle: 'full', timeStyle: 'long' }).format(new Date(dateTime))} - {endDateTime}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlockCard;
