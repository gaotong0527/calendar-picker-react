import React, { Component } from 'react';
import CalendarPicker from '../src/CalendarPicker';
import './index.less';

class DemoCalendar extends Component<any, any> {
    constructor(props) {
        super(props);
        this.state = {
            selectedDate: '',
            currentDate: ''
        };
    }
    onChangeDate = () => {};
    
    renderDate = data => {
        return <div>{data.day}</div>;
    };
    render() {
        const { selectedDate, currentDate } = this.state;
        return (
            <div className="test-calendar-picker">
                <CalendarPicker
                    currentDate={currentDate}
                    selectedDate={selectedDate}
                    startDate={''}
                    endDate={''}
                    onChange={this.onChangeDate}
                    dateData={[]}
                    renderContent={data => {
                        return this.renderDate(data);
                    }}
                />
            </div>
        );
    }
}
export default DemoCalendar;
