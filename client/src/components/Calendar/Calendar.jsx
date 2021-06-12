import React from "react";
import { ScheduleComponent, Day, Week, WorkWeek, Month, Resize, DragAndDrop, Inject, ViewsDirective, ViewDirective } from "@syncfusion/ej2-react-schedule";
import * as DataSource from './datasource.json';
import './Calendar.scss'

function Calendar() {

  const onDataBinding = (e) => {
    console.log(e.result);
  }

  return (
    <ScheduleComponent
      width="100%"
      height="85.7vh"
      selectedDate={new Date()}
      eventSettings={{dataSource: DataSource}}
      enablePersistence={true}
      dataBinding={(e) => onDataBinding(e)}
      timeFormat="HH"
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