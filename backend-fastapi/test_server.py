#!/usr/bin/env python3

import uvicorn
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Optional
from datetime import date, time
from pydantic import BaseModel

# Create simple test app
app = FastAPI(title="Scheduling API Test", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Test models
class RoomAvailabilityResponse(BaseModel):
    id: int
    room: str
    capacity: int
    facilities: List[str]
    availableSlots: List[dict]

class BookingFormData(BaseModel):
    room: str
    requestedBy: str
    email: str
    purpose: str
    date: str
    startTime: str
    endTime: str
    attendees: int

class RoomBookingResponse(BaseModel):
    id: int
    room: str
    requestedBy: str
    email: str
    purpose: str
    date: str
    startTime: str
    endTime: str
    attendees: int
    status: str
    requestDate: str
    rejectionReason: Optional[str] = None

class ClassScheduleResponse(BaseModel):
    id: int
    courseCode: str
    courseTitle: str
    batch: str
    semester: str
    room: str
    day: str
    startTime: str
    endTime: str
    instructor: str

# Sample data
sample_rooms = [
    {
        "id": 1,
        "room": "A101",
        "capacity": 30,
        "facilities": ["Projector", "Whiteboard", "AC"],
        "availableSlots": [
            {
                "day": "Monday",
                "slots": [
                    {"startTime": "08:00", "endTime": "10:00"},
                    {"startTime": "10:00", "endTime": "12:00"},
                    {"startTime": "14:00", "endTime": "16:00"}
                ]
            },
            {
                "day": "Tuesday", 
                "slots": [
                    {"startTime": "08:00", "endTime": "10:00"},
                    {"startTime": "12:00", "endTime": "14:00"}
                ]
            }
        ]
    },
    {
        "id": 2,
        "room": "B201",
        "capacity": 50,
        "facilities": ["Projector", "Whiteboard", "AC", "Sound System"],
        "availableSlots": [
            {
                "day": "Monday",
                "slots": [
                    {"startTime": "09:00", "endTime": "11:00"},
                    {"startTime": "15:00", "endTime": "17:00"}
                ]
            },
            {
                "day": "Wednesday",
                "slots": [
                    {"startTime": "10:00", "endTime": "12:00"},
                    {"startTime": "14:00", "endTime": "16:00"}
                ]
            }
        ]
    }
]

sample_bookings = []
sample_schedules = [
    {
        "id": 1,
        "courseCode": "CSE101",
        "courseTitle": "Introduction to Programming",
        "batch": "27",
        "semester": "1",
        "room": "A101",
        "day": "Monday",
        "startTime": "08:00",
        "endTime": "10:00",
        "instructor": "Dr. John Smith"
    },
    {
        "id": 2,
        "courseCode": "CSE201",
        "courseTitle": "Data Structures",
        "batch": "27",
        "semester": "3",
        "room": "B201",
        "day": "Tuesday",
        "startTime": "10:00",
        "endTime": "12:00",
        "instructor": "Prof. Jane Doe"
    }
]

# API Endpoints
@app.get("/")
async def root():
    return {"message": "Scheduling API Test Server", "status": "running"}

@app.get("/api/scheduling/rooms/availability", response_model=List[RoomAvailabilityResponse])
async def get_room_availability():
    """Get all rooms with their availability slots"""
    return sample_rooms

@app.post("/api/scheduling/bookings")
async def create_booking(booking_data: BookingFormData):
    """Create a new room booking request"""
    booking_id = len(sample_bookings) + 1
    new_booking = {
        "id": booking_id,
        "room": booking_data.room,
        "requestedBy": booking_data.requestedBy,
        "email": booking_data.email,
        "purpose": booking_data.purpose,
        "date": booking_data.date,
        "startTime": booking_data.startTime,
        "endTime": booking_data.endTime,
        "attendees": booking_data.attendees,
        "status": "Pending",
        "requestDate": "2024-01-10",
        "rejectionReason": None
    }
    sample_bookings.append(new_booking)
    return {"message": "Booking request submitted successfully", "booking_id": booking_id}

@app.get("/api/scheduling/bookings", response_model=List[RoomBookingResponse])
async def get_bookings(status: str = None):
    """Get all room bookings, optionally filtered by status"""
    result = sample_bookings.copy()
    if status:
        result = [b for b in result if b["status"] == status]
    
    # Ensure rejectionReason is never None for validation
    for booking in result:
        if booking["rejectionReason"] is None:
            booking["rejectionReason"] = ""
    
    return result

@app.put("/api/scheduling/bookings/{booking_id}/approve")
async def approve_booking(booking_id: int, action_data: dict):
    """Approve or reject a booking request"""
    for booking in sample_bookings:
        if booking["id"] == booking_id:
            if action_data["action"] == "approve":
                booking["status"] = "Approved"
            elif action_data["action"] == "reject":
                booking["status"] = "Rejected"
                booking["rejectionReason"] = action_data.get("rejectionReason", "No reason provided")
            return {"message": f"Booking {action_data['action']}d successfully"}
    return {"error": "Booking not found"}

@app.get("/api/scheduling/schedules", response_model=List[ClassScheduleResponse])
async def get_class_schedules(batch: str = None, semester: str = None, room: str = None):
    """Get class schedules with optional filtering"""
    filtered_schedules = sample_schedules.copy()
    
    if batch:
        filtered_schedules = [s for s in filtered_schedules if s["batch"] == batch]
    if semester:
        filtered_schedules = [s for s in filtered_schedules if s["semester"] == semester]
    if room:
        filtered_schedules = [s for s in filtered_schedules if s["room"] == room]
    
    return filtered_schedules

@app.get("/api/scheduling/schedules/rooms")
async def get_schedule_rooms():
    """Get all rooms used in schedules for filtering"""
    return list(set(s["room"] for s in sample_schedules))

@app.post("/api/scheduling/sample-data/rooms")
async def create_sample_rooms():
    """Create sample room data (already loaded)"""
    return {"message": "Sample room data already available"}

# Admin Class Schedule CRUD Endpoints
@app.post("/api/scheduling/admin/schedules")
async def create_class_schedule(request: Request):
    """Create a new class schedule (admin only)"""
    try:
        request_data = await request.json()
        # Generate new ID
        new_id = max([s["id"] for s in sample_schedules]) + 1 if sample_schedules else 1
        
        # Create new schedule
        new_schedule = {
            "id": new_id,
            "courseCode": request_data["course_code"],
            "courseTitle": f"Course Title for {request_data['course_code']}",
            "batch": request_data["batch"],
            "semester": request_data["semester"],
            "room": request_data["room"],
            "day": request_data["day"],
            "startTime": request_data["start_time"],
            "endTime": request_data["end_time"],
            "instructor": request_data["instructor"]
        }
        
        sample_schedules.append(new_schedule)
        
        return {"message": "Class schedule created successfully", "schedule_id": new_id}
    except Exception as e:
        return {"error": str(e)}

@app.put("/api/scheduling/admin/schedules/{schedule_id}")
async def update_class_schedule(schedule_id: int, request: Request):
    """Update an existing class schedule (admin only)"""
    try:
        request_data = await request.json()
        # Find schedule
        schedule = next((s for s in sample_schedules if s["id"] == schedule_id), None)
        if not schedule:
            return {"error": "Schedule not found"}
        
        # Update fields if provided
        if "course_code" in request_data and request_data["course_code"] is not None:
            schedule["courseCode"] = request_data["course_code"]
        if "batch" in request_data and request_data["batch"] is not None:
            schedule["batch"] = request_data["batch"]
        if "semester" in request_data and request_data["semester"] is not None:
            schedule["semester"] = request_data["semester"]
        if "room" in request_data and request_data["room"] is not None:
            schedule["room"] = request_data["room"]
        if "day" in request_data and request_data["day"] is not None:
            schedule["day"] = request_data["day"]
        if "start_time" in request_data and request_data["start_time"] is not None:
            schedule["startTime"] = request_data["start_time"]
        if "end_time" in request_data and request_data["end_time"] is not None:
            schedule["endTime"] = request_data["end_time"]
        if "instructor" in request_data and request_data["instructor"] is not None:
            schedule["instructor"] = request_data["instructor"]
        
        return {"message": "Class schedule updated successfully"}
    except Exception as e:
        return {"error": str(e)}

@app.delete("/api/scheduling/admin/schedules/{schedule_id}")
async def delete_class_schedule(schedule_id: int):
    """Delete a class schedule (admin only)"""
    try:
        # Find and remove schedule
        global sample_schedules
        original_length = len(sample_schedules)
        sample_schedules = [s for s in sample_schedules if s["id"] != schedule_id]
        
        if len(sample_schedules) == original_length:
            return {"error": "Schedule not found"}
        
        return {"message": "Class schedule deleted successfully"}
    except Exception as e:
        return {"error": str(e)}

@app.get("/api/scheduling/admin/schedules/{schedule_id}")
async def get_class_schedule_by_id(schedule_id: int):
    """Get a specific class schedule by ID (admin only)"""
    try:
        schedule = next((s for s in sample_schedules if s["id"] == schedule_id), None)
        if not schedule:
            return {"error": "Schedule not found"}
        
        return schedule
    except Exception as e:
        return {"error": str(e)}

# Admin Room Management Endpoints
@app.post("/api/scheduling/admin/rooms")
async def create_room(request: Request):
    """Create a new room (admin only)"""
    try:
        request_data = await request.json()
        # Generate new ID
        new_id = max([r["id"] for r in sample_rooms]) + 1 if sample_rooms else 1
        
        # Create new room
        new_room = {
            "id": new_id,
            "room": request_data["room"],
            "capacity": request_data["capacity"],
            "facilities": request_data["facilities"],
            "availableSlots": request_data.get("availableSlots", [])
        }
        
        sample_rooms.append(new_room)
        return {"message": "Room created successfully", "room_id": new_id}
    except Exception as e:
        return {"error": f"Failed to create room: {str(e)}"}

@app.put("/api/scheduling/admin/rooms/{room_id}")
async def update_room(room_id: int, request: Request):
    """Update an existing room (admin only)"""
    try:
        request_data = await request.json()
        
        # Find the room to update
        room = None
        for r in sample_rooms:
            if r["id"] == room_id:
                room = r
                break
        
        if not room:
            return {"error": "Room not found"}
        
        # Update fields if provided
        if "room" in request_data and request_data["room"] is not None:
            room["room"] = request_data["room"]
        if "capacity" in request_data and request_data["capacity"] is not None:
            room["capacity"] = request_data["capacity"]
        if "facilities" in request_data and request_data["facilities"] is not None:
            room["facilities"] = request_data["facilities"]
        if "availableSlots" in request_data and request_data["availableSlots"] is not None:
            room["availableSlots"] = request_data["availableSlots"]
        
        return {"message": "Room updated successfully"}
    except Exception as e:
        return {"error": f"Failed to update room: {str(e)}"}

@app.delete("/api/scheduling/admin/rooms/{room_id}")
async def delete_room(room_id: int):
    """Delete a room (admin only)"""
    global sample_rooms
    original_count = len(sample_rooms)
    sample_rooms = [r for r in sample_rooms if r["id"] != room_id]
    
    if len(sample_rooms) < original_count:
        return {"message": "Room deleted successfully"}
    else:
        return {"error": "Room not found"}

@app.get("/api/scheduling/admin/rooms/{room_id}")
async def get_room_by_id(room_id: int):
    """Get a specific room by ID (admin only)"""
    for room in sample_rooms:
        if room["id"] == room_id:
            return room
    return {"error": "Room not found"}

@app.get("/api/scheduling/admin/rooms")
async def get_all_rooms_admin():
    """Get all rooms for admin management"""
    return sample_rooms

if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=8000) 