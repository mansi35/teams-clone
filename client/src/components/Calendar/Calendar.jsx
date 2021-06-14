import React, { useEffect, useState } from "react";
import { ScheduleComponent, Day, Week, WorkWeek, Month, Resize, DragAndDrop, Inject, ViewsDirective, ViewDirective } from "@syncfusion/ej2-react-schedule";
import { loginRequest } from "../../authConfig";
import { useMsal } from "@azure/msal-react";
import { callMsGraphCalendar, callMsGraphCreateEvent, callMsGraphDeleteEvent, callMsGraphUpdateEvent } from "../../graph";
import moment from 'moment';
import './Calendar.scss'

function Calendar() {
  const { instance, accounts } = useMsal();
  const [data, setData] = useState([]);
  const request = {
    ...loginRequest,
    account: accounts[0]
  };

  useEffect(() => {
    RequestCalendarData();
    // eslint-disable-next-line
  }, []);

  function RequestCalendarData() {
    // Silently acquires an access token which is then attached to a request for Microsoft Graph data
    instance.acquireTokenSilent(request).then((response) => {
        callMsGraphCalendar(response.accessToken).then(response => {
          response.value.forEach(event => {
            setData(prevData => [ ...prevData, {
              Id: event.id,
              Subject: event.subject,
              IsAllDay: event.isAllDay,
              StartTime: moment.utc(event.start.dateTime).toDate(),
              EndTime: moment.utc(event.end.dateTime).toDate(),
              RecurrenceRule: event.recurrence,
              Description: event.body.content,
            } ]);
          });
          console.log(response);
        });
    }).catch((e) => {
        instance.acquireTokenPopup(request).then((response) => {
            callMsGraphCalendar(response.accessToken).then(response => {
              response.value.forEach(event => {
                setData(prevData => [ ...prevData, {
                  Id: event.id,
                  Subject: event.subject,
                  IsAllDay: event.isAllDay,
                  StartTime: moment.utc(event.start.dateTime).toDate(),
                  EndTime: moment.utc(event.end.dateTime).toDate(),
                  RecurrenceRule: event.recurrence,
                  Description: event.body.content,
                } ]);
              });
              console.log(response);
            });
        });
    });
    setData([]);
  }

  function onActionBegin(args) {
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
        instance.acquireTokenSilent(request).then((response) => {
          const eventData = callMsGraphCreateEvent(response.accessToken, event).then((t) => console.log(t));
          console.log(eventData);
        });
      }
      if (args.requestType === "eventRemove") { 
        instance.acquireTokenSilent(request).then((response) => {
          const eventData = callMsGraphDeleteEvent(response.accessToken, args.data[0].Id).then((t) => console.log(t));
          console.log(eventData);
        });
      }
      if (args.requestType === "eventChange") { 
        console.log('updated event', args);
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
        console.log('updated event', args);
        instance.acquireTokenSilent(request).then((response) => {
          const eventData = callMsGraphUpdateEvent(response.accessToken, event, args.data.Id).then((t) => console.log(t));
          console.log(eventData);
        });
      }
  }

  return (
    <ScheduleComponent
      width="100%"
      height="85.7vh"
      selectedDate={new Date()}
      enablePersistence={true}
      timeFormat="HH"
      actionBegin={onActionBegin}
      eventSettings={{dataSource: data}}
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