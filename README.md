# TCSA Tortoise Conservation South Africa
 
A responsive website and private rehabilitation dashboard for Tortoise Conservation South Africa, a non-profit protecting South Africa's reptiles, especially tortoises.
 
*Student project for DV200*
**Live sites**
- Platform 1 (AWS ECS): https://tc-e476dcec49c64fe8b3f463c6883ad786.ecs.eu-north-1.on.aws/
- Platform 2 (Heroku): https://tcsa-sanctuary-aed7d8977658.herokuapp.com/
---
 
## Overview
 
The public site tells visitors who TCSA is and how to help. The owner dashboard lets the founder track daily care tasks, manage animals in rehabilitation, and print animal reports.
 
## Design Reference
 
 
The build follows the design's cream, dark green and orange palette, bold display headings, and hexagon "tortoise-shell" motif.
 
## Features
 
**Public website**
- Full-screen hero with navigation to About, Support and Contact
- About Us: history, vision, conservation work and SA reptile species
- Photo gallery
- Support Us: donations, Rescue Roast coffee, tortoise food
- Sponsor logos
- Contact footer with WhatsApp, email, Facebook and Owner login
**Owner dashboard**
- Login page
- Today: task progress, stat cards, task timeline, add task
- Animals: search by ID, animal list, totals per species
- Reports: preview and print a report per animal
- Add new animal, log out
- Responsive on mobile, tablet and desktop
## Technologies
 
TODO: confirm
- HTML, CSS, JavaScript (React?)
- Node.js and Express
- TODO: database
- Docker
- AWS ECS, Heroku
- Git, GitHub, Figma

 

## Deployment


**Heroku**
Connected the GitHub repo to a Heroku app, added a `Procfile`, and set environment variables under Config Vars. The server listens on `process.env.PORT`.
  
**AWS ECS**
Packaged the app with a Dockerfile, pushed the image to Amazon ECR, and ran it as an ECS service in `eu-north-1`. Environment variables are set in the ECS service settings. TODO: adjust to what you did.
 

## Challenges and Solutions

- **App crashed on Heroku.** I don't really know why but i got it fixed through`process.env.PORT`.
- **Hexagon shapes overlapped text on mobile.** Scaled them down but couldn't fully remove without losing the affect.

## Future Improvements

- **Google Search Console and Analytics.** Finish setting up Search Console so Google can index the site, and fix Google Analytics so it properly tracks visitors and page views.
- **Profile and Settings pages.** Add a profile page for the owner and a settings page to manage account details and dashboard preferences.
- **Split the landing page into separate pages.** Break the single long landing page into Home, About, Support and Contact pages. This would make navigation clearer and give each section its own URL.
