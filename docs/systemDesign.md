# CampusAI System Design

## 1. Actors

Actors represent the different types of users who interact with the CampusAI platform. Each actor has a specific role, responsibilities, and permissions within the system. Role-Based Access Control (RBAC) ensures that users can only access features and data relevant to their role.

---

### 1. Student

#### Description
A Student is the primary user of the CampusAI platform. Students use the system to monitor their academic progress, manage their placement preparation, and receive AI-powered guidance throughout their college journey.

#### Responsibilities
- Login securely into the system.
- View personal dashboard.
- View attendance records.
- View marks and academic performance.
- Access timetable.
- View assignments and deadlines.
- Upload resume for AI analysis.
- Check placement readiness score.
- Receive AI-generated career recommendations.
- Track placement applications.
- Receive notifications and announcements.

#### Permissions
- Read only their own academic records.
- Upload personal resume.
- Edit personal profile.
- Cannot modify attendance, marks, or placement data.

---

### 2. Faculty

#### Description
Faculty members manage academic activities for students. They are responsible for maintaining attendance, uploading marks, creating assignments, and monitoring student performance.

#### Responsibilities
- Login securely.
- Mark attendance.
- Upload marks.
- Create and manage assignments.
- View class performance.
- View AI-generated student performance insights.
- Publish announcements for students.

#### Permissions
- Manage only assigned subjects/classes.
- Update attendance and marks.
- Cannot manage placement data.
- Cannot access administrative settings.

---

### 3. Placement Officer (Training & Placement Officer)

#### Description
The Placement Officer manages recruitment activities between the college and companies. The system assists this role by providing AI-powered placement predictions and student analytics.

#### Responsibilities
- Create company profiles.
- Manage placement drives.
- Define eligibility criteria.
- Review student applications.
- Monitor placement statistics.
- View AI placement readiness predictions.
- Track placement history.

#### Permissions
- Access placement-related data.
- View student academic summaries.
- Manage company information.
- Cannot modify attendance or examination records.

---

### 4. Administrator

#### Description
The Administrator manages the overall operation of the CampusAI platform. This role is responsible for configuring the system, managing users, departments, courses, and monitoring institutional performance.

#### Responsibilities
- Manage users.
- Manage departments.
- Manage academic sessions.
- Manage courses.
- Configure system settings.
- Generate institutional reports.
- Monitor dashboards.
- Manage announcements.

#### Permissions
- Full administrative access.
- Create, update, and deactivate users.
- Configure academic structure.
- Access all reports.
- Cannot alter AI prediction models directly.

---

## Role-Based Access Control (RBAC)

CampusAI follows Role-Based Access Control to ensure security and proper access management.

Each user is assigned exactly one primary role.

The system verifies user permissions before every protected operation.

Example:

- Students can view only their own academic data.
- Faculty can modify records only for assigned classes.
- Placement Officers can manage placement-related information only.
- Administrators have complete access to operational modules.

This approach improves security, prevents unauthorized access, and ensures that every user interacts only with information relevant to their responsibilities.