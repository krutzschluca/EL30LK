"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function MainPage() {
  const [appointments, setAppointments] = useState([]);
  const router = useRouter();

  // Check if the user is authenticated
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      // If no token, redirect to login page
      router.push('/login');
    } else {
      fetchAppointments(token);
    }
  }, []);

  return (
    <div>s
      <h1>Your Appointments</h1>
      {appointments.length > 0 ? (
        <ul>
          {appointments.map((appt) => (
            <li key={appt._id}>
              {appt.type} with Dr. {appt.doctor.username} on {appt.date}
            </li>
          ))}
        </ul>
      ) : (
        <p>No appointments available.</p>
      )}
    </div>
  );
}
