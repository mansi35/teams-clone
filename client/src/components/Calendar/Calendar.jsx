import React, { useEffect, useState } from "react";
import { ScheduleComponent, Day, Week, WorkWeek, Month, Resize, DragAndDrop, Inject, ViewsDirective, ViewDirective } from "@syncfusion/ej2-react-schedule";
import { callMsGraphCalendar, callMsGraphCreateEvent, callMsGraphDeleteEvent, callMsGraphUpdateEvent } from "../../api/graph";
import moment from 'moment';
import './Calendar.scss'
import { useLocation } from "react-router-dom";
import { Button } from '@material-ui/core';
import LinkIcon from '@material-ui/icons/Link';
import FileCopyOutlinedIcon from '@material-ui/icons/FileCopyOutlined';
import { isNullOrUndefined } from "@syncfusion/ej2-base";
import { useIsAuthenticated } from "@azure/msal-react";

function Calendar() {
  const [data, setData] = useState([]);
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('profile')));
  const location = useLocation();
  const isAuthenticated = useIsAuthenticated();

  useEffect(() => {
    setUser(JSON.parse(localStorage.getItem('profile')));
  }, [location]);

  useEffect(() => {
    if (isAuthenticated) {
      RequestCalendarData();
    }
    // eslint-disable-next-line
  }, []);

  function RequestCalendarData() {
    callMsGraphCalendar(user.tokenId).then(response => {
      response.value.forEach(event => {
        setData(prevData => [ ...prevData, {
          Id: event.id,
          Subject: event.subject,
          IsAllDay: event.isAllDay,
          StartTime: moment.utc(event.start.dateTime).toDate(),
          EndTime: moment.utc(event.end.dateTime).toDate(),
          RecurrenceRule: event.recurrence,
          Description: event.body.content,
          MeetingId: event.onlineMeeting ? event.onlineMeeting.joinUrl : "" ,
        } ]);
      });
      console.log(response);
    })
    setData([]);
  }

  function onActionBegin(args) {
    if (isAuthenticated) {
      if (args.requestType === "eventCreate") {
        const event = {
          subject: args.data[0].Subject,
          body: {
            contentType: 'text',
            content: args.data[0].Description ? args.data[0].Description: ""
          },
          start: {
            dateTime: new Date(args.data[0].StartTime).toISOString(),
            timeZone: 'UTC'
          },
          end: {
            dateTime: new Date(args.data[0].EndTime).toISOString(),
            timeZone: 'UTC'
          },
          location: {
            displayName: args.data[0].Location ? args.data[0].Location: ""
          },
        };
        const eventData = callMsGraphCreateEvent(user.tokenId, event).then((t) => console.log(t));
        console.log(eventData);
      }
      if (args.requestType === "eventRemove") { 
        const eventData = callMsGraphDeleteEvent(user.tokenId, args.data[0].Id).then((t) => console.log(t));
        console.log(eventData);
      }
      if (args.requestType === "eventChange") {
        console.log(args.data);
        const event = {
          subject: args.data.Subject,
          body: {
            contentType: 'text',
            content: args.data.Description ? args.data.Description: ""
          },
          start: {
            dateTime: new Date(args.data.StartTime).toISOString(),
            timeZone: 'UTC'
          },
          end: {
            dateTime: new Date(args.data.EndTime).toISOString(),
            timeZone: 'UTC'
          },
          location: {
              displayName: args.data.Location ? args.data.Location: ""
          },
        };
        const eventData = callMsGraphUpdateEvent(user.tokenId, event, args.data.Id).then((t) => console.log(t));
        console.log(eventData);
      }
    }
  }

  function content(props) {
    return (
      <div>
        {props.elementType === "cell" ? (
          <div className="e-cell-content e-template">
            <form className="e-schedule-form">
              <div>
                <input className="subject e-field e-input" type="text" name="Subject" placeholder="Title"/>
              </div>
            </form>
          </div>) : (
          <div>
            <div className="quickpopup__dateTime">
              {props.StartTime.toLocaleDateString('en-GB', {
                day: 'numeric', month: 'short', year: 'numeric'
              })}
              {" "}
              {props.StartTime.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: false })}
              {" - "}
              {props.EndTime.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: false })}
            </div>
            {props.MeetingId !== "" && !isNullOrUndefined(props.MeetingId) ?
            <div>
              <Button href={props.MeetingId} variant="contained" color="primary" className="quickpopup__join">Join</Button>
              <div className="quickpopup__meetingId">
                <LinkIcon />
                <p><a href={props.MeetingId}>{props.MeetingId.slice(0, 40)}{"..."}</a></p>
                <FileCopyOutlinedIcon />
              </div>
            </div>: null}
            <div className="quickpopup__description">
              {props.Description ? props.Description.includes('>') ? props.Description.substr(0, props.Description.indexOf('<https')) : props.Description: ""}
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <ScheduleComponent
      width="100%"
      height="85.7vh"
      selectedDate={new Date()}
      enablePersistence={true}
      actionBegin={onActionBegin}
      eventSettings={{dataSource: data}}
      quickInfoTemplates={isAuthenticated ? { content: content }: {}}
    >
      <ViewsDirective>
        <ViewDirective option="Day" />
        <ViewDirective option="Week" />
        <ViewDirective option="WorkWeek" />
      </ViewsDirective>
      <Inject services={[Day, Week, WorkWeek, Month, Resize, DragAndDrop]} />
    </ScheduleComponent>
  );
}

export default Calendar;