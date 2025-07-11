# University Portal Scheduling API

A FastAPI-based backend service for managing university class schedules, room availability, and room bookings.

## 🚀 Features

- **Class Schedule Management**: CRUD operations for class schedules
- **Room Availability**: View available rooms and time slots
- **Room Booking System**: Request and manage room bookings
- **Admin Controls**: Administrative endpoints for schedule management

## 📋 Prerequisites

- Python 3.8+
- FastAPI
- Uvicorn

## 🛠 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd backend-fastapi
   ```

2. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

3. **Run the server**
   ```bash
   python3 test_server.py
   ```

The API will be available at `http://127.0.0.1:8000`

## 📚 API Documentation

### Base URL
```
http://127.0.0.1:8000/api/scheduling
```

### 🔍 Quick Reference

| Method | Endpoint | Description | Access Level |
|--------|----------|-------------|--------------|
| `GET` | `/schedules` | Get all class schedules | Public |
| `POST` | `/admin/schedules` | Create new class schedule | Admin |
| `GET` | `/admin/schedules/{id}` | Get specific class schedule | Admin |
| `PUT` | `/admin/schedules/{id}` | Update class schedule | Admin |
| `DELETE` | `/admin/schedules/{id}` | Delete class schedule | Admin |
| `GET` | `/rooms/availability` | Get room availability | Public |
| `POST` | `/rooms/bookings` | Create room booking request | Public |

---

## 🗓 Class Schedule APIs

### Get All Class Schedules
```http
GET /schedules
```

**Response:**
```json
[
  {
    "id": 1,
    "courseCode": "CSE101",
    "courseTitle": "Introduction to Programming",
    "batch": "28",
    "semester": "1",
    "room": "A101",
    "day": "Monday",
    "startTime": "09:00",
    "endTime": "11:00",
    "instructor": "Dr. John Smith"
  }
]
```

---

## 👨‍💼 Admin Class Schedule APIs

### Create Class Schedule
```http
POST /admin/schedules
```

**Request Body:**
```json
{
  "course_code": "CSE201",
  "batch": "28",
  "semester": "3",
  "room": "B201",
  "day": "Tuesday",
  "start_time": "14:00",
  "end_time": "16:00",
  "instructor": "Dr. Jane Doe"
}
```

**Response:**
```json
{
  "message": "Class schedule created successfully",
  "schedule_id": 2
}
```

### Get Specific Class Schedule
```http
GET /admin/schedules/{schedule_id}
```

**Response:**
```json
{
  "id": 1,
  "courseCode": "CSE101",
  "courseTitle": "Introduction to Programming",
  "batch": "28",
  "semester": "1",
  "room": "A101",
  "day": "Monday",
  "startTime": "09:00",
  "endTime": "11:00",
  "instructor": "Dr. John Smith"
}
```

### Update Class Schedule
```http
PUT /admin/schedules/{schedule_id}
```

**Request Body:**
```json
{
  "course_code": "CSE201",
  "batch": "28",
  "semester": "3",
  "room": "B201",
  "day": "Wednesday",
  "start_time": "10:00",
  "end_time": "12:00",
  "instructor": "Dr. Jane Doe"
}
```

**Response:**
```json
{
  "message": "Class schedule updated successfully"
}
```

### Delete Class Schedule
```http
DELETE /admin/schedules/{schedule_id}
```

**Response:**
```json
{
  "message": "Class schedule deleted successfully"
}
```

---

## 🏢 Room Availability APIs

### Get Room Availability
```http
GET /rooms/availability
```

**Response:**
```json
[
  {
    "id": 1,
    "room": "A101",
    "capacity": 50,
    "facilities": ["Projector", "Whiteboard", "Air Conditioning"],
    "availableSlots": [
      {
        "day": "Monday",
        "slots": [
          {
            "startTime": "08:00",
            "endTime": "09:00"
          },
          {
            "startTime": "11:00",
            "endTime": "12:00"
          }
        ]
      }
    ]
  }
]
```

---

## 📅 Room Booking APIs

### Create Room Booking
```http
POST /rooms/bookings
```

**Request Body:**
```json
{
  "room": "A101",
  "requestedBy": "John Doe",
  "email": "john.doe@university.edu",
  "purpose": "Study Group Meeting",
  "date": "2024-01-15",
  "startTime": "14:00",
  "endTime": "16:00",
  "attendees": 25
}
```

**Response:**
```json
{
  "message": "Room booking request submitted successfully",
  "booking_id": 1
}
```

---

## 📊 Data Models

### Class Schedule Model
```typescript
interface ClassSchedule {
  id: number;
  courseCode: string;
  courseTitle: string;
  batch: string;
  semester: string;
  room: string;
  day: string;
  startTime: string;
  endTime: string;
  instructor: string;
}
```

### Room Availability Model
```typescript
interface RoomAvailability {
  id: number;
  room: string;
  capacity: number;
  facilities: string[];
  availableSlots: AvailableSlot[];
}

interface AvailableSlot {
  day: string;
  slots: TimeSlot[];
}

interface TimeSlot {
  startTime: string;
  endTime: string;
}
```

### Room Booking Model
```typescript
interface RoomBooking {
  id: number;
  room: string;
  requestedBy: string;
  email: string;
  purpose: string;
  date: string;
  startTime: string;
  endTime: string;
  attendees: number;
  status: "Pending" | "Approved" | "Rejected";
  requestDate: string;
}
```

---

## 🔧 Error Handling

The API returns appropriate HTTP status codes:

- `200 OK` - Successful operation
- `201 Created` - Resource created successfully
- `400 Bad Request` - Invalid request data
- `404 Not Found` - Resource not found
- `422 Unprocessable Entity` - Validation error
- `500 Internal Server Error` - Server error

### Error Response Format
```json
{
  "detail": "Error description"
}
```

---

## 🧪 Testing the API

### Using cURL

1. **Get all schedules:**
   ```bash
   curl -X GET "http://127.0.0.1:8000/api/scheduling/schedules"
   ```

2. **Create a new schedule:**
   ```bash
   curl -X POST "http://127.0.0.1:8000/api/scheduling/admin/schedules" \
     -H "Content-Type: application/json" \
     -d '{
       "course_code": "CSE301",
       "batch": "28",
       "semester": "5",
       "room": "C301",
       "day": "Wednesday",
       "start_time": "14:00",
       "end_time": "16:00",
       "instructor": "Dr. Alex Johnson"
     }'
   ```

3. **Get room availability:**
   ```bash
   curl -X GET "http://127.0.0.1:8000/api/scheduling/rooms/availability"
   ```

### Using Browser
Visit `http://127.0.0.1:8000/docs` for the interactive Swagger UI documentation.

---

## 🎯 Frontend Integration

This API is designed to work with the React frontend application. The frontend uses these endpoints through the `schedulingApi` service:

```typescript
// Example frontend usage
import { schedulingApi } from '@/lib/schedulingApi';

// Get all schedules
const schedules = await schedulingApi.classSchedule.getAll();

// Create new schedule
await schedulingApi.classSchedule.admin.create(formData);

// Get room availability
const rooms = await schedulingApi.roomAvailability.getAll();
```

---

## 🏗 Architecture

```
Backend Structure:
├── app/
│   ├── main.py                 # FastAPI application
│   ├── models/                 # Data models
│   ├── routes/                 # API route handlers
│   └── utils/                  # Utility functions
├── test_server.py              # Development server
└── requirements.txt            # Dependencies
```

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test the API endpoints
5. Submit a pull request

---

## 📄 License

This project is licensed under the MIT License.

---

## 📞 Support

For support or questions, please contact the development team or create an issue in the repository.

---

## 🔄 Version History

- **v1.0.0** - Initial release with class scheduling, room availability, and booking features
- **v1.1.0** - Added admin endpoints for schedule management
- **v1.2.0** - Enhanced room availability with detailed slot information