import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { format } from 'date-fns';

const MeetingList = () => {
    const [meetings, setMeetings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchMeetings();
    }, []);

    const fetchMeetings = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:5001/api/meetings', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setMeetings(response.data.data);
            setLoading(false);
        } catch (err) {
            setError(err.response?.data?.message || 'Error fetching meetings');
            setLoading(false);
        }
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div className="container mx-auto p-4">
            <h2 className="text-2xl font-bold mb-4">Meetings</h2>
            <div className="grid gap-4">
                {meetings.map(meeting => (
                    <div key={meeting._id} className="border p-4 rounded-lg shadow">
                        <h3 className="text-xl font-semibold">{meeting.title}</h3>
                        <p className="text-gray-600">{meeting.description}</p>
                        <div className="mt-2">
                            <p>Start: {format(new Date(meeting.startTime), 'PPp')}</p>
                            <p>End: {format(new Date(meeting.endTime), 'PPp')}</p>
                        </div>
                        <p className="mt-2">Location: {meeting.location}</p>
                        <p className="mt-2">
                            Organizer: {meeting.organizer.firstName} {meeting.organizer.lastName}
                        </p>
                        <div className="mt-2">
                            <span className="font-semibold">Participants:</span>
                            <ul className="list-disc ml-4">
                                {meeting.participants.map(participant => (
                                    <li key={participant._id}>
                                        {participant.firstName} {participant.lastName}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MeetingList; 