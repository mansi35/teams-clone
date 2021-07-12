# Microsoft Teams Clone
This web app is my version of a collaboration app that helps your team stay organized and have conversations—all in one place. The main objective is to provide a feeling of working in-office while working remotely with co-workers and friends.

## Technology Stack
<div>
      <p align ="center">
        <code><img src="https://img.icons8.com/color/48/000000/mongodb.png" width="5%" /></code>
        <code><img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/express/express-original-wordmark.svg" alt="express" width="5%" /></code>
        <code><img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/react/react-original-wordmark.svg" width="5%" /></code>
        <code><img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/nodejs/nodejs-original-wordmark.svg" width="5%"/></code>
        <code><img src="https://g.foolcdn.com/art/companylogos/square/api.png" width="5%"/></code>
        <code><img src="https://cdn.worldvectorlogo.com/logos/socket-io.svg" width="5%" /></code>
        <code><img src="https://img.icons8.com/color/64/000000/git.png" width="5%"/></code>
      </p>
</div>

- Frontend is implemented using React JS.
- Backend of the projec is implemented using Node JS.
- MongoDB is used as a NoSQL database.
- Agora.IO and Socket.IO are used for real-time communication.
- Git is used for version control.

## Folder Structure
- The server code is present in the `server` folder of the root directory
- front-end of the project is present inside the `client` directory
- all the individual pages can be found inside `client/pages` directory
- all react components can be found inside `client/components` directory

## Features and Functionalities
<div align="center">
  
|                                  |                                              |
|----------------------------------|----------------------------------------------|
| 1. Login with Email and Password | 7.  Event Scheduling on Calendar             |
| 2. Login with Microsoft          | 8.  Syncing with Microsoft Outlook Calendar  |
| 3. Group Video Calling           | 9.  Chat                                     |
| 4. Screen Sharing                | 10. GitHub Integration                       |
| 5. Screen Pinning                | 11. Collaborative Blackboard                 |
| 6. Audio/Video Mute/Unmute       | 12. Voice Assistant                          |
</div>

### <img src="https://img.icons8.com/color/48/000000/gmail--v2.gif" width="30px" />&ensp;Login with Email and Password
- User information is saved in the MongoDB database.
- The password is hashed first and then stored.
- Authentication is done using JSON Web Token (JWT).
- The calendar after successful login would be an empty one.

### <img src="https://img.icons8.com/color/48/000000/microsoft.png" width="30px" />&ensp;Login with Microsoft
- User signs-in with their Microsoft Account.
- Authentication is done using Microsoft Authentication Library(MSAL).
- The calendar after successful login will be synced with user's Outlook Calendar.

### <img src="https://img.icons8.com/color/48/000000/video-call--v2.gif" width="30px" />&ensp;Group Video Calling
- The group video call is implemented using Agora Web SDK NG.
- Agora Web SDK NG enables audio and video real-time communications.
- It has a Selective Forwarding Unit(SFU) Architecture.
- All clients connected on a particular channel publish their audio and video tracks to the server.
- The server is then broadcasting the received tracks to the other participants present in the call.

#### But why SFU over Mesh Networking?
i. Mesh Networking
  - Suppose A, B and C are connected through a video call. Then each person is sending their audio and video stream to every other person.
  -	High upload speed required (which is not common)
  -	Maximum of 4 people can connect through video call.

ii. Selective Forwarding Unit (SFU)
  -	Suppose A, B and C are connected through a video call. Then each person is sending their audio and video stream only once to the server.
  -	The server is then broadcasting the received stream to the other participants.
  -	High download speed required (which is common)
  -	More than 10 people can connect through video call.

### <img src="https://img.icons8.com/color/48/000000/chat--v3.gif" width="30px" />&ensp;Screen Sharing
- Screen Share functionality is also implemented with Agora Web SDK NG.
- It is achieved through replacing the video track of the user with ze's screen track.
- And vice-versa when the user wants to stop screen sharing.

### <img src="https://img.icons8.com/ios-glyphs/30/3498DB/pin3--v2.gif" width="30px" />&ensp;Screen Pinning
- A user can pin other user's video or screen whenever is required.
- Pinning a user's video/screen means making ze's video/screen fullscreen.

### <img src="https://img.icons8.com/color/48/000000/block-microphone--v2.gif" width="30px" />&ensp;Mute/Unmute Audio/Video
- This is done by unpublishing user's audio/video stream to the server.
- The server relays this information to all other clients.

### <img src="https://img.icons8.com/color/48/000000/calendar--v2.gif" width="30px" />&ensp;Event Scheduling on Calendar
- Syncfusion scheduler is used for implementing the calendar.
- An events collection is created in the MongoDB database which serves as the data source for the calendar.
- API requests to the database are made to do Create, Read, Update and Delete(CRUD) operations on the events collection through the calendar.
- A user can add attendees to the event, when ze is creating an event.
- That event is then visible on the attendee's calendar as well.
- A meeting link for the video conference is automatically generated when an event is created.

### <img src="https://img.icons8.com/color/48/000000/microsoft-outlook-2019--v2.png" width="30px" />&ensp;Syncing with Microsoft Outlook Calendar
- Microsoft Graph API is used for syncing the syncfusion scheduler with the Outlook Calendar.
- Authentication is done using Microsoft Authentication Library(MSAL).
- CRUD operations are performed through the Graph API.

### <img src="https://img.icons8.com/color/48/000000/chat--v3.gif" width="30px" />&ensp;Chat
- Whenever a user schedules an event on the calendar, a particular chat space for that event is created.
- The creator of the event and all the attendees are added to that particular chat space.
- They can chat before the event begins, during the event as well as they can continue their chat after the event ends.
- The chat participants can share both text and images with each other.
- A user can also create individual as well as group chats themselves by adding other participants to the chat.

### <img src="https://img.icons8.com/color/48/000000/github--v3.gif" width="30px" />&ensp;GitHub Integration
- A user can explore and look upon other users profiles and their public repositories by searching for the user.
- Ze can also look at ze's private repositories.
- All the folders and files of the repository are accessible.
- Commit history in the repository can also be seen.
- Moreover you can see the repository issues, create new issues and comment on existing issues.
- You can do all this even while being in a meeting and discussing the product issues with your team.
- GitHub V3 API has been used to achieve this functionality.

### <img src="https://img.icons8.com/doodle/48/000000/whiteboard.png" width="30px" />&ensp;Collaborative Blackboard
- Draw collaboratively with your team while being in a video conference.
- User can still create a collaborative drawing space even if ze's not in a meeting and share link of the board with ze's team.
- A user can download the board as an image after ze's done drawing.

### <img src="https://img.icons8.com/ios-glyphs/30/3498DB/voice-presentation--v2.gif" width="30px" />&ensp;Voice Assistant
- Alan AI is used to integrate a voice assistant into the application.
- Navigation in the web app can be done using voice commands.
- Events/Meetings on the calendar can be scheduled, updated and deleted using voice commands.

## References
- Agora Video Calling and Screen Sharing: https://docs.agora.io/en/Video/landing-page?platform=Web
- GitHub V3 API: https://docs.github.com/en/rest
- Microsoft Graph API: https://docs.microsoft.com/en-us/graph/api/resources/calendar?view=graph-rest-1.0
- Socket.IO: https://socket.io/docs/v3

<br />

<p align = "center">
  <img src = "http://ForTheBadge.com/images/badges/built-with-love.svg">
  <img src = "https://forthebadge.com/images/badges/made-with-javascript.svg">
  <img src = "http://ForTheBadge.com/images/badges/built-by-developers.svg">
</p>
