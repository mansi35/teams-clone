import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { ScheduleComponent, Day, Week, WorkWeek, Month, Resize, DragAndDrop, Inject, ViewsDirective, ViewDirective } from "@syncfusion/ej2-react-schedule";
import { v1 as uuid } from "uuid";
import { createEvent, deleteEvent, updateEvent } from "../../actions/events";
import { isNullOrUndefined } from "@syncfusion/ej2-base";
import { Button } from '@material-ui/core';
import LinkIcon from '@material-ui/icons/Link';
import FileCopyOutlinedIcon from '@material-ui/icons/FileCopyOutlined';
import './Calendar.scss';

function Calendar() {
    const [id, setId] = useState('');
    const events = useSelector((state) => state.events);
    const dispatch = useDispatch();

    useEffect(() => {
        create();
    }, []);

    const create = () => {
        setId(uuid());
    }

    const content = (props) => {
        const meetingLink = `http://localhost:3000/room/${props.MeetingId}`
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
                        <p><a href={meetingLink}>{meetingLink.slice(0, 40)}{"..."}</a></p>
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

    const onActionBegin = (args) => {
        if (args.requestType === "eventCreate") {
            create();
            dispatch(createEvent({
                Subject: args.data[0].Subject,
                IsAllDay: args.data[0].IsAllDay,
                StartTime: args.data[0].StartTime.toISOString(),
                EndTime: args.data[0].EndTime.toISOString(),
                Description: args.data[0].Description,
                MeetingId: id
            }));
        } else if (args.requestType === "eventChange") {
            dispatch(updateEvent(args.data._id, {
                Subject: args.data.Subject,
                IsAllDay: args.data.IsAllDay,
                StartTime: args.data.StartTime.toISOString(),
                EndTime: args.data.EndTime.toISOString(),
                Description: args.data.Description,
                MeetingId: id
            }));
        } else if (args.requestType === "eventRemove") {
            dispatch(deleteEvent(args.data[0]._id))
        }
    }

    return (
        <ScheduleComponent
            width="100%"
            height="85.7vh"
            selectedDate={new Date()}
            enablePersistence={true}
            actionBegin={onActionBegin}
            eventSettings={{ dataSource: events }}
            quickInfoTemplates={{ content: content }}
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