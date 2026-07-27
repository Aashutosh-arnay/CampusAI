# CampusAI Database Schema

## Overview

CampusAI uses MongoDB as its primary database because it provides a flexible document-based data model suitable for managing academic records, user profiles, AI-generated insights, placement information, and notifications. The schema is designed using a modular approach where each collection represents a specific domain of the application.

---

# Database Collections

## 1. Users

Purpose:
Stores authentication information and common user details for all platform users.

Contains:
- Login credentials
- User role
- Account status
- Profile reference

Relationships:
- One User → One Student
- One User → One Faculty
- One User → One Admin

---

## 2. Students

Purpose:
Stores complete student academic and personal information.

Contains:
- Academic details
- Department
- Semester
- Skills
- Resume
- Placement information

Relationships:
- Belongs to one Department
- Has many Attendance records
- Has many Assignments
- Has many Grades
- Has one Resume
- Has many AI Reports

---

## 3. Faculty

Purpose:
Stores faculty profile and teaching information.

Contains:
- Personal details
- Department
- Assigned subjects

Relationships:
- Belongs to one Department
- Teaches many Subjects
- Marks Attendance
- Evaluates Assignments

---

## 4. Departments

Purpose:
Stores department information.

Contains:
- Department name
- Department code
- HOD

Relationships:
- Has many Students
- Has many Faculty
- Has many Courses

---

## 5. Courses

Purpose:
Stores course information offered by departments.

Contains:
- Course name
- Duration
- Semester structure

Relationships:
- Belongs to one Department
- Has many Subjects

---

## 6. Subjects

Purpose:
Stores subject details.

Contains:
- Subject name
- Subject code
- Credits

Relationships:
- Belongs to one Course
- Assigned to Faculty

---

## 7. Attendance

Purpose:
Stores attendance records.

Contains:
- Student
- Subject
- Faculty
- Date
- Status

Relationships:
- Belongs to Student
- Belongs to Subject
- Marked by Faculty

---

## 8. Assignments

Purpose:
Stores assignment information.

Contains:
- Title
- Description
- Due date
- Subject

Relationships:
- Created by Faculty
- Submitted by Students

---

## 9. Grades

Purpose:
Stores examination and assessment results.

Contains:
- Marks
- Grade
- Subject
- Semester

Relationships:
- Belongs to Student
- Belongs to Subject

---

## 10. Companies

Purpose:
Stores company information for placements.

Contains:
- Company profile
- Eligibility criteria
- Package
- Job role

Relationships:
- Has many Placement Drives

---

## 11. Placement Drives

Purpose:
Stores placement drive information.

Contains:
- Company
- Date
- Eligibility
- Registration deadline

Relationships:
- Conducted by Company
- Has many Student Applications

---

## 12. Applications

Purpose:
Stores student placement applications.

Contains:
- Student
- Company
- Status
- Interview rounds

Relationships:
- Belongs to Student
- Belongs to Placement Drive

---

## 13. Resumes

Purpose:
Stores uploaded resumes and resume metadata.

Contains:
- Resume file
- Version
- Upload date

Relationships:
- Belongs to Student
- Used by AI Module

---

## 14. AI Reports

Purpose:
Stores AI-generated analysis.

Contains:
- Placement readiness score
- Resume analysis
- Skill gap analysis
- Career recommendations

Relationships:
- Belongs to Student

---

## 15. Notifications

Purpose:
Stores system notifications.

Contains:
- Title
- Message
- Type
- Recipient
- Read status

Relationships:
- Sent to Users

---

# High-Level Database Relationships

Department
│
├── Students
├── Faculty
└── Courses

Course
│
└── Subjects

Student
│
├── Attendance
├── Assignments
├── Grades
├── Resume
├── AI Reports
└── Applications

Faculty
│
├── Subjects
├── Attendance
└── Assignments

Company
│
└── Placement Drives
     │
     └── Applications

User
│
├── Student
├── Faculty
└── Admin

---

# Design Principles

- Modular collections for better maintainability.
- Role-Based Access Control through the Users collection.
- References are used instead of duplicating data.
- AI outputs are stored separately from core academic records.
- Database design supports future scalability, including multi-campus deployment, mobile applications, and additional AI services.