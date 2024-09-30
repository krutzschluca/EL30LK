# Clinic Appointment System
### EL 30 Senior Web Dev - Luca Krutzsch - Eyad Saleh
### Project Overview

This is a web-based application designed to manage appointments for a dental clinic. Patients can register, book appointments with doctors, and view their upcoming appointments. Secretaries can manage appointments and doctor availability, while doctors can view and manage their own appointment schedules. 

Note: The project is not entirely completed and lacks the complete integration of the backend into the frontend.

### Features

- User Registration & Login: Patients can register and log in.
- Appointment Booking: Patients can book an appointment with available doctors.
- View Appointments: Patients can see their upcoming appointments.
- Authentication: JWT-based authentication to ensure secure login sessions.

### Prerequisites

Make sure you have the following installed:
- Node.js (version 18+)
- MongoDB (local or Atlas instance)
- Git
- npm (Node Package Manager)

### Installation
1. Clone the repository from GitHub:
    ```bash
    git clone https://github.com/krutzschluca/clinic-appointment-system.git
    cd clinic-appointment-system
    ```

2. Install the dependencies for both backend and frontend:
    ```bash
    cd backend
    npm install
    ```
    ```bash
    cd ../frontend
    npm install
    ```
### Dependencies
- Backend Dependencies
    - express
    - mongoose
    - jsonwebtoken
    - bcrypt
    - cors
    - jest (for testing)
    - supertest (for integration testing)
- Frontend Dependencies
    - next.js
    - react
    - tailwindcss
    - axios
    - jest (for frontend testing)

### Environment Variables

For MongoDB, you can either use a local MongoDB instance or MongoDB Atlas (cloud).  

If using MongoDB Atlas, download the .env file I that I have attached to the assignment in Teams and drag it into the backend folder.  
In there I have shared with you the connection string to my own account for easier setup.

### Running the Project
To run both backend and frontend, follow these steps:

1. **Run the backend:**
    ```bash
    cd backend
    npm start
    ```

    The backend will run on `http://localhost:5000`.

2. **Run the frontend:**
    ```bash
    cd frontend
    npm run dev
    ```

    The frontend will run on `http://localhost:3000`.  
    Ctrl/Cmd + Click on the link in the terminal to open or paste this URL into the browser of your choice

3. **Additional Scripts**  
To clear and reset the database you can run:
  
    ```bash
    node clearDB
    ```
    in the backend directory  
    To fill it with dummy data you can use :
    ```bash
    node seedDB
    ```

## API Endpoints
Here are the API endpoints available for interacting with the system:  
Use 
```bash
http://localhost:5000
```
as the base URL appended by the header of the individual request.  
  
You can test each of the endpoints using the Postman collection attached to the submission of the Assignment in Teams.  

Make sure to change the request type depending on the endpoint.  

Put the request body with sample data provided below into the body tab of the request, then select raw and JSON.  

Use the JWT Token you received from the login request of the user (without the "") to test the requests where an authorization is necessary. The JWT contains the user id through which the requests knows what data to fetch or send. 

For the corresponding request, go to the authorization tab, select Bearer Token on the left and put the Token into the field that appears.

### User Authentication & Management
- **POST /api/users/register** - Register a new user (patient, doctor, or secretary), change role as needed
    - Request body (example for patient):
      ```json
      {
        "username": "patientUsername",
        "password": "password",
        "name": "John Doe",
        "phone": "1234567890",
        "insuranceNumber": "A123456789",
        "role": "patient"
      }
      ```
    - Response:
      ```json
      {
        "token": "jwt-token",
        "userId": "user-id"
      }
      ```

- **POST /api/users/login** - Log in an existing user
    - Request body:
      ```json
      {
        "username": "patientUsername",
        "password": "password"
      }
      ```
    - Response:
      ```json
      {
        "token": "jwt-token",
        "userId": "user-id"
      }
      ```  
     ### ↑ Use this token ↑

### Appointment Management

- **GET /api/appointments** - Get all appointments 
  
- **GET /api/appointments/my-appointments** - Get all appointments for the logged-in patient
    - Header:
      ```json
      {
        "Authorization": "Bearer jwt-token"
      }
      ```

- **POST /api/appointments** - Book a new appointment
    - Request body:
      ```json
      {
        "doctorId": "doctor-id",
        "type": "Checkup",
        "date": "2024-09-30T10:00:00Z",
        "startTime": "09:00",
        "endTime": "10:00"
      }
      ```
    - Header:
      ```json
      {
        "Authorization": "Bearer jwt-token"
      }
      ```  

- **DEL /api/appointments/:id** - Cancel an appointment by id,  
    You receive the id either after you created one in the response or by fetching the appointments using one of the requests above

- **GET /api/appointments/available-slots/:id**
    Returns the timeslots where no appointment has been scheduled with the doctor.  
    (wip) lacks the calculation and reservation of times prior to the start time for longer appointments.  

### Fetch Information

 - **GET /api/doctors** - Fetches all Doctors
 - **GET /api/patients** - Fetches all Patients

## Testing
To run the unit tests, use the following command in the backend:
```bash
npm run test
```
Right now there are only unit tests for login and registration and their errors in the backend.

## Work in progress

Includes things that I just did not get ready in time:

- Display of available timeslots of the selected doctor from the dropdown of the appointment booking form 
- Calculation of booked time slots if an appointment takes more than 30 min.
- Role Based Access, depending on the role the user has logged in, they are only authorized to perform certain requests
- Error Handling and better toast messaging
- Further testing

I hope you are a bit lenient since I was working alone.

## Additional Remarks

 - The frontend UI was done using a template generated by V0 from Vercel

## SOLID Principles, Clean Code, and Design Patterns in my Project

## SOLID Principles

### 1. **Single Responsibility Principle (SRP)**
Each module, like the `auth.js` middleware for authentication and `users.js` for user routes, has a single, focused responsibility. This keeps the code modular, easy to maintain, and changes in one part don’t affect unrelated parts.

### 2. **Open/Closed Principle (OCP)**
The system is designed to be extendable without modifying existing code. For instance, roles like `patient`, `doctor`, or `secretary` can be introduced or extended without changing core functionalities, making the project flexible and scalable.

### 3. **Liskov Substitution Principle (LSP)**
Roles like `patient`, `doctor`, and `secretary` share the same `User` model structure, ensuring that each role can be substituted and handled consistently. This keeps the system reliable and adaptable for future extensions.

### 4. **Interface Segregation Principle (ISP)**
Different controllers, such as `appointmentController` and `authController`, handle specific functionality, ensuring that each controller only manages its own tasks. This modular approach makes the system easier to update and maintain.

### 5. **Dependency Inversion Principle (DIP)**
The project depends on abstractions, such as the use of libraries like `bcrypt` for password hashing and `mongoose` for database operations. This makes the system more flexible, testable, and easier to maintain or switch components as needed.

## Clean Code Practices

1. **Readable Code:**
   I used meaningful names for variables and functions like `handleLogin` and `fetchAppointments`, making the code easy to understand and maintain, reducing potential bugs.

2. **Consistent Naming Conventions:**
   Following consistent naming conventions (e.g., camelCase for variables and functions) ensures readability and reduces confusion across the codebase.

3. **Modularization:**
   By splitting the project into modules like routes, controllers, and models, the system is easier to maintain, debug, and scale.

4. **Error Handling:**
   Using `try-catch` blocks and returning clear error messages ensures the system fails gracefully and provides meaningful feedback, improving maintainability.

## Design Patterns

### 1. **Factory Pattern (User/Patient Creation):**
The registration logic dynamically creates a user based on their role. This centralizes and simplifies user creation, making it easy to extend when adding new roles.

### 2. **Middleware Pattern:**
Middleware, like the `auth.js` for token validation, allows us to reuse authentication logic across multiple routes, reducing duplication and improving maintainability.

### 3. **Model-View-Controller (MVC) Architecture:**
The system follows the MVC pattern, separating models, controllers, and views, which makes the codebase more organized, easier to extend, and more maintainable.

---

Thank You
