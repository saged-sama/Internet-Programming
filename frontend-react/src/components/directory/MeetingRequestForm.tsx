import React from 'react';
import { Button } from '../../components/ui/button';

interface MeetingRequestFormProps {
  personName: string;
}

const MeetingRequestForm: React.FC<MeetingRequestFormProps> = ({ personName }) => (
  <div>
    <h2 className="text-xl font-bold text-[#13274D] mb-4">Schedule a Meeting</h2>
    <p className="text-gray-600 mb-6">
      Fill out the form below to request a meeting with {personName}.
    </p>
    <form className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-[#13274D] mb-1">
            Your Name
          </label>
          <input
            type="text"
            id="name"
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#13274D]"
            placeholder="Enter your name"
          />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-[#13274D] mb-1">
            Your Email
          </label>
          <input
            type="email"
            id="email"
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#13274D]"
            placeholder="Enter your email"
          />
        </div>
      </div>
      <div>
        <label htmlFor="date" className="block text-sm font-medium text-[#13274D] mb-1">
          Preferred Date
        </label>
        <input
          type="date"
          id="date"
          className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#13274D]"
        />
      </div>
      <div>
        <label htmlFor="time" className="block text-sm font-medium text-[#13274D] mb-1">
          Preferred Time
        </label>
        <select
          id="time"
          className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#13274D]"
        >
          <option value="">Select a time</option>
          <option value="9:00 AM">9:00 AM</option>
          <option value="10:00 AM">10:00 AM</option>
          <option value="11:00 AM">11:00 AM</option>
          <option value="1:00 PM">1:00 PM</option>
          <option value="2:00 PM">2:00 PM</option>
          <option value="3:00 PM">3:00 PM</option>
          <option value="4:00 PM">4:00 PM</option>
        </select>
      </div>
      <div>
        <label htmlFor="purpose" className="block text-sm font-medium text-[#13274D] mb-1">
          Purpose of Meeting
        </label>
        <textarea
          id="purpose"
          rows={4}
          className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#13274D]"
          placeholder="Please describe the purpose of your meeting request"
        ></textarea>
      </div>
      <div className="pt-2">
        <Button className="bg-[#13274D] hover:bg-[#31466F] text-white">
          Request Meeting
        </Button>
      </div>
    </form>
  </div>
);

export default MeetingRequestForm;
