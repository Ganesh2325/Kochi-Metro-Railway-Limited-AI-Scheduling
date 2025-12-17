#  AI-Driven Train Induction & Scheduling for Kochi Metro Rail Limited (KMRL)

An **AI-assisted metro operations management system** built using the **MERN stack**, designed to optimize **train induction, scheduling, passenger load management, and fleet health monitoring** for Kochi Metro Rail Limited (KMRL).

---

  **Project Objective**

Metro rail systems rely heavily on **static schedules and manual decisions**, which are inefficient under dynamic conditions such as peak demand, congestion, delays, and maintenance constraints.

**This project aims to introduce AI-driven decision support** to:
- Dynamically schedule and induct trains
- Reduce congestion and headway conflicts
- Improve energy efficiency
- Ensure asset-aware and safe operations

---

##  Core Features

- **Control Room Dashboard** – System health, alerts, and AI recommendations  
- **Live Metro Network** – Real-time station load and train movement visualization  
- **AI Train Scheduler** – Genetic Algorithm–based schedule optimization  
- **Rolling Stock Status** – Fleet health, mileage, and maintenance awareness  
- **Passenger Load Analytics** – Demand analysis, forecasting, and congestion detection  

---

##  AI & Optimization Logic

The project uses a **Genetic Algorithm (GA)–inspired optimization model** to handle the metro scheduling problem, which involves multiple constraints:
- Passenger demand variation
- Train headway safety
- Platform availability
- Maintenance and asset health

**GA Concepts Used:**
- Chromosome → Candidate train schedule  
- Fitness Function → Penalizes congestion, delays, conflicts  
- Optimization Output → AI scheduling and induction recommendations  

> This is an **academic AI implementation**, structured to support future real-time and ML-based enhancements.

---

##  Tech Stack

- **Frontend:** React.js, Tailwind CSS  
- **Backend:** Node.js, Express.js  
- **Database:** MongoDB  
- **AI Logic:** Genetic Algorithm–based optimization (rule-driven)
