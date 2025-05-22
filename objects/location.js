export class Location {
  static meta = {
    properties: {
      title: { name: "Title", type: "string"},
      description: { name: "Description", type: "markdown"},
      position: { name: "Position", type: "position"},
      subtype: { name: "Type", type: "select", options: {
        "accommodation": { name: "Accommodation", icon: '<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#143f52"><path d="M40-200v-600h80v400h320v-320h320q66 0 113 47t47 113v360h-80v-120H120v120H40Zm240-240q-50 0-85-35t-35-85q0-50 35-85t85-35q50 0 85 35t35 85q0 50-35 85t-85 35Z"/></svg>' },
        "sight": { name: "Sight", icon: '<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#143f52"><path d="M80-120v-80h160v-160h-80v-80h84q12-75 66.5-129.5T440-636v-204h280v160H520v44q75 12 129.5 66.5T716-440h84v80h-80v160h160v80H80Zm240-80h120v-160H320v160Zm200 0h120v-160H520v160Z"/></svg>' },
        "museum": { name: "Museum", icon: '<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#143f52"><path d="M80-80v-80h80v-360H80v-80l400-280 400 280v80h-80v360h80v80H80Zm240-160h80v-160l80 120 80-120v160h80v-280h-80l-80 120-80-120h-80v280Z"/></svg>' },
        "nature": { name: "Nature", icon: '<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#143f52"><path d="M200-80v-80h240v-160h-80q-83 0-141.5-58.5T160-520q0-60 33-110.5t89-73.5q9-75 65.5-125.5T480-880q76 0 132.5 50.5T678-704q56 23 89 73.5T800-520q0 83-58.5 141.5T600-320h-80v160h240v80H200Z"/></svg>' },
        "temple": { name: "Temple", icon: '<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#143f52"><path d="M630-320v-112l-76-139q-20 10-32 29t-12 42v320l57 100h313l-40-500-280-320-13 13q-29 29-34.5 68t14.5 74l163 297v128h-60Zm-360 0v-128l163-297q20-35 13.5-74T412-887l-12-13-280 320L80-80h313l57-100v-320q0-23-12.5-42T406-571l-76 139v112h-60Z"/></svg>' },
        "transport": { name: "Transport", icon: '<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#143f52"><path d="M760-320q-72 0-127-45t-69-115H445l-48-80h167q5-22 13.5-42t22.5-38H348l-48-80h342l-44-120H440v-80h158q26 0 46 14.5t29 38.5l54 147h33q83 0 141.5 58.5T960-520q0 83-58.5 141.5T760-320Zm0-80q50 0 85-35t35-85q0-50-35-85t-85-35h-3l39 107-76 27-38-105q-20 17-31 41t-11 50q0 50 35 85t85 35ZM280-40q-50 0-85-35t-35-85H0v-240h80v-120H0v-80h280l120 200h80q33 0 56.5 23.5T560-320v80q0 33-23.5 56.5T480-160h-80q0 50-35 85t-85 35ZM160-400h147l-72-120h-75v120Zm120 280q17 0 28.5-11.5T320-160q0-17-11.5-28.5T280-200q-17 0-28.5 11.5T240-160q0 17 11.5 28.5T280-120Z"/></svg>' },
        "information": { name: "Information", icon: '<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#143f52"><path d="M440-280h80v-240h-80v240Zm40-320q17 0 28.5-11.5T520-640q0-17-11.5-28.5T480-680q-17 0-28.5 11.5T440-640q0 17 11.5 28.5T480-600Zm0 520q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Z"/></svg>' },
      }},
    },
  }
}