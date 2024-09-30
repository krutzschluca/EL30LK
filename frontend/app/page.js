"use client"

import { useState } from "react"
import { useEffect } from "react"
import { useRouter } from 'next/navigation'
import { format } from 'date-fns';
import { Calendar as CalendarIcon, Clock, User } from "lucide-react"
import { Button } from "../components/ui/button"
import { Calendar } from "../components/ui/calendar"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../components/ui/popover"
  
export default function HomePage() {
  const [date, setDate] = useState(new Date())
  const [appointmentType, setAppointmentType] = useState("")
  const [doctor, setDoctor] = useState("")
  const [time, setTime] = useState("")
  const [appointments, setAppointments] = useState([]);
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/login');
  };

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const token = localStorage.getItem('token');  // Assuming token is stored in localStorage after login

        const res = await fetch('http://localhost:5000/api/appointments/my-appointments', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,  // Add Authorization header with the JWT
          },
        });

        if (!res.ok) {
          throw new Error('Failed to fetch appointments');
        }

        const data = await res.json();
        setAppointments(data);  // Set the fetched appointments into state
      } catch (error) {
        console.error('Error fetching appointments:', error);
      }
    };

    fetchAppointments();
  }, []);  // Run once on component mount

  const timeSlots = [
    "08:00", "08:30", "09:00", "09:30", "10:00", "10:30", "11:00", "11:30", "12:00", "12:30",
    "14:00", "14:30", "15:00", "15:30", "16:00", "16:30"
  ]

  const handleSubmit = (e) => {
    e.preventDefault()
    // Here you would typically send the data to your backend API
    console.log({ appointmentType, doctor, date, time })
  }

    // Function to format the date as dd/mm/yyyy
    const formatDate = (dateString) => {
      const date = new Date(dateString);
      return date.getDate().toString().padStart(2, '0') + '/' +
             (date.getMonth() + 1).toString().padStart(2, '0') + '/' +
             date.getFullYear();
    };

    // Function to format the time as hh:mm
  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.getUTCHours().toString().padStart(2, '0') + ':' +
           date.getUTCMinutes().toString().padStart(2, '0');
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold mb-6">Dr. Doe's Clinic</h1>
        <button onClick={handleLogout} className="bg-black hover:bg-red-700 text-white font-bold py-2 px-4 rounded">Logout</button>
      </div>
      <div className="flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-2/3">
          <h2 className="text-2xl font-semibold mb-4">My Appointments</h2>
          <div className="space-y-4">
            {appointments.length > 0 ? (
              appointments.map((appointment) => (
                <div
                  key={`${appointment._id}-${appointment.startTime}`}
                  className="flex justify-between items-center p-4 bg-white rounded-lg shadow"
                >
                  {/* Appointment Type */}
                  <span className="text-sm font-medium bg-gray-100 px-2 py-1 rounded"> 
                    {appointment.type || 'No Type'}
                  </span>

                  {/* Appointment Date */}
                  <div className="flex items-center space-x-4">
                  <span className="text-sm">
                      {appointment.date
                        ? formatDate(appointment.date)
                        : 'No Date'}
                    </span>
                  </div>

                  {/* Appointment Time */}
                  <div className="flex items-center space-x-4">
                    <span className="text-sm">
                      {appointment.date
                        ? formatTime(appointment.date)
                        : 'No Time'}
                    </span>
                  </div>

                  {/* Doctor Name */}
                  <div className="flex items-center space-x-4">
                    <User className="w-4 h-4 mr-1" />
                    <span className="text-sm">
                      {appointment.doctor?.username || 'Doctor Not Assigned'}
                    </span>
                  </div>
                  <span className="text-sm text-gray-500">{appointment.status || 'No Status'}</span>
                </div>
              ))
            ) : (
              <p>No upcoming appointments</p>
            )}
          </div>
        </div>
        <div className="w-full md:w-1/3">
          <h2 className="text-2xl font-semibold mb-4">Book an Appointment</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Select onValueChange={setAppointmentType}>
                <SelectTrigger>
                  <SelectValue placeholder="Appointment Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="checkup">Checkup (30 min.)</SelectItem>
                  <SelectItem value="extensive">Extensive Care (1h)</SelectItem>
                  <SelectItem value="operation">Operation (2h)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Select onValueChange={setDoctor}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Doctor" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="john-doe">Dr. John Doe</SelectItem>
                  <SelectItem value="mary-jane">Dr. Mary Jane</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left font-normal">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                      {date ? format(date, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div>
              <Select onValueChange={setTime}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Time" />
                </SelectTrigger>
                <SelectContent>
                  {timeSlots.map((slot) => (
                    <SelectItem key={slot} value={slot}>
                      {slot}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button type="submit" className="w-full">Book Appointment</Button>
          </form>
        </div>
      </div>
    </div>
  );
}