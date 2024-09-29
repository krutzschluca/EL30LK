"use client"

import { useState } from "react"
import { useRouter } from 'next/navigation'
import { format } from "date-fns"
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

  const appointmentss = [
    { id: "1111111-1111-1111-1111-111111111111", date: "2023-10-10", startTime: "09:00:00", endTime: "09:30:00", patient: "Martin Bock" },
    { id: "1111111-1111-1111-1111-111111111111", date: "2023-10-10", startTime: "10:00:00", endTime: "11:00:00", patient: "Martin Bock" },
    { id: "1111111-1111-1111-1111-111111111111", date: "2023-10-10", startTime: "14:00:00", endTime: "16:00:00", patient: "Martin Bock" },
    { id: "2222222-2222-2222-2222-222222222222", date: "2023-10-10", startTime: "09:30:00", endTime: "10:00:00", patient: "Martin Bock" },
    { id: "2222222-2222-2222-2222-222222222222", date: "2023-10-10", startTime: "11:00:00", endTime: "12:00:00", patient: "Martin Bock" },
    { id: "2222222-2222-2222-2222-222222222222", date: "2023-10-10", startTime: "15:00:00", endTime: "17:00:00", patient: "Martin Bock" },
    { id: "3333333-3333-3333-3333-333333333333", date: "2023-10-10", startTime: "09:00:00", endTime: "09:30:00", patient: "Martin Bock" },
    { id: "1111111-1111-1111-1111-111111111111", date: "2024-09-27", startTime: "10:00:00", endTime: "10:30:00", patient: "Martin Bock" },
    { id: "1111111-1111-1111-1111-111111111111", date: "2024-09-27", startTime: "10:00:00", endTime: "10:30:00", patient: "Martin Bock" },
    { id: "1111111-1111-1111-1111-111111111111", date: "2024-09-27", startTime: "10:30:00", endTime: "11:00:00", patient: "Martin Bock" },
  ]

  const timeSlots = [
    "08:00", "08:30", "09:00", "09:30", "10:00", "10:30", "11:00", "11:30", "12:00", "12:30",
    "14:00", "14:30", "15:00", "15:30", "16:00", "16:30"
  ]

  const handleSubmit = (e) => {
    e.preventDefault()
    // Here you would typically send the data to your backend API
    console.log({ appointmentType, doctor, date, time })
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Dr. Doe's Clinic</h1>
      <div className="flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-2/3">
          <h2 className="text-2xl font-semibold mb-4">Upcoming</h2>
          <div className="space-y-4">
            {appointmentss.map((appointment) => (
              <div key={`${appointment.id}-${appointment.startTime}`} className="flex justify-between items-center p-4 bg-white rounded-lg shadow">
                <div className="flex items-center space-x-4">
                  <span className="text-sm font-medium bg-gray-100 px-2 py-1 rounded">Other</span>
                  <span className="text-sm">{appointment.id}</span>
                </div>
                <div className="flex items-center space-x-4">
                  <span className="flex items-center text-sm text-gray-500">
                    <CalendarIcon className="w-4 h-4 mr-1" />
                    {appointment.date}
                  </span>
                  <span className="flex items-center text-sm text-gray-500">
                    <Clock className="w-4 h-4 mr-1" />
                    {`${appointment.startTime} - ${appointment.endTime}`}
                  </span>
                  <span className="flex items-center text-sm text-gray-500">
                    <User className="w-4 h-4 mr-1" />
                    {appointment.patient}
                  </span>
                </div>
              </div>
            ))}
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
  )
}