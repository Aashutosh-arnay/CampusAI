# CampusAI Database Design

## Database Overview
    ampusAI uses MongoDB because the system contains semi-structured data, user profiles, AI outputs, notifications, and academic records that evolve over time. MongoDB's flexible document model allows faster development while supporting future scalability.

## Collections
    users

students

faculty

departments

courses

subjects

attendance

assignments

grades

placementDrives

companies

applications

resumes

aiReports

notifications

## Relationships
    Department
    │
    ├── Students
    ├── Faculty
    └── Courses

Student
    │
    ├── Attendance
    ├── Assignments
    ├── Grades
    ├── Resume
    └── AI Reports

Placement Drive
    │
    ├── Company
    └── Applications

## Indexing Strategy
Student Roll Number

Student Email

Department

Company Name

Placement Drive Date

## Future Scalability
Multi-college support
Multi-campus support
AI conversation history
Plugin architecture
Mobile app support
Analytics warehouse