# Travel Manager Project Requirements Document

## Overview

The Travel Manager Project is a web application that allows users to manage their travel plans. It includes a list of trips, each with a start date, end date, a title, and a description. For each trip the user can add/remove stays. For each stay the user can add/remove locations such as accommodation and sights.

## Features

- List of trips
- Add/remove/edit trips
- Add/remove/edit stays to a trip
- Add/remove/edit locations to a stay

## Data Model

### Trip

- _id: string (UUID)
- _rev: string (<rev number>-<UUID>; managed by PouchDB)
- type: "trip"
- title: string
- description: string (markdown)
- startDate: string (YYYY-MM-DD)
- endDate: string (YYYY-MM-DD)
- stays: Stay[]

### Stay

- _id: string (UUID)
- _rev: string (<rev number>-<UUID>; managed by PouchDB)
- type: "stay"
- title: string
- description: string (markdown)  
- startDate: string (YYYY-MM-DD)
- endDate: string (YYYY-MM-DD)
- parent: string (UUID)
- position: [number, number] (longitude, latitude)

### Location

- _id: string (UUID)
- _rev: string (<rev number>-<UUID>; managed by PouchDB)
- type: "location"
- subtype: "accommodation" | "sight"
- title: string
- description: string (markdown)
- parent: string (UUID)
- position: [number, number] (longitude, latitude)

## UI

### Pages
Pages are the different screens of the application.
As the user navigates through the pages, the location is updated to reflect the current position.

#### Main Page
The main page shows a list of trips.
For each trip the title, description, start date, and end date are shown.
The trips are in descending order by start date.
The user can select a trip to navigate to the trip page.
The main view also contains a button to add a new trip.

#### Trip Page
The trip page shows the details of a particular trip.
The trip page also contains a list of stays.
For each stay the title, description, start date, and end date are shown.
The stays are in ascending order by start date.
The trip page also contains a button to add a new stay.

#### Stay Page
The stay page shows the details of the stay and any attachments and child objects.
In particular, the stay page contains a list of locations including the title, description, subtype, and coordinates of the location.

### Components
Components are used on pages to encapsulate certain elements.
Some components are generic (e.g., travel-list) and can be used with a variety of objects (e.g., trip, stay, location).
Other components are specific for one type of object (e.g., travel-stay-edit).

#### Position Edit
The position-edit component allows the user to create or update a position by either specifying the numerical values of the longitude and latitude or by selection the position on a map.

## User Stories

### US1: List of trips
- As a user I want to be able to view a list of trips (including title, description, start date, end date), so that I can get an overview of my trips.
- **Acceptance Criteria:**
  - The user can view a list of trips (including title, description, start date, end date)
  - The user can view the trips in descending order of start date

### US2: Trip
- As a user I want to be able to add/remove/edit trips, so that I can manage my trips.
- **Acceptance Criteria:**
  - The user can add a trip
  - The user can remove a trip
  - The user can edit a trip
  - The user can view a trip and its child objects

### US3: Stay
- As a user I want to be able to add/remove/edit stays to a trip
- As a user I want to be able to add/remove/edit locations to a stay

### US4: Location
- As a user I want to be able to add/remove/edit locations to a stay