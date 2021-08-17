interface ICalProps {
    showTodayButton?: Boolean;
    selectedDate?: string;
    currentDate?: string;
    firstWeekDay?: number;
    startDate?: string;
    endDate?: string;
    onChange: (data) => void;
    dateData?: any;
    renderContent?: any;
    [name: string]: any;
}

import React, { Component } from 'react';
import {
    getDateListOfCurrentMonth,
    getYearMonthDay,
    fillDateWithZero,
    createWeeksday,
    isDateInRange,
    IMAGE_SRC_MAP,
    getCurrentDateStr
} from './util';
import './calendar_picker.less';
class CalendarPicker extends Component<ICalProps, any> {
    constructor(props) {
        super(props);
        let cur_date = getCurrentDateStr();
        this.state = {
            weekList: ['一', '二', '三', '四', '五', '六', '日'],
            title: '',
            dates: [],
            selected_date: cur_date,
            current_date: cur_date,
            currentMonthInfo: {}, // 当前月的信息
            monthStorage: {} // 缓存 key:'YYYY-MM',value:monthlist
        };
    }
    componentDidMount() {
        // 以周几作为【周】日历的第一天,目前是周一
        const weekList = createWeeksday();
        this.setState({ weekList });
        const { selected_date } = this.state;
        this.generateSelectedMonth(selected_date);
    }
    // // 点击虚弱日期时需要更新state中的currentMonthInfo,精准的回到上下月的指定日期
    // componentWillReceiveProps(nextProps) {
    //     if (nextProps.selectedDate !== this.props.selectedDate) {
    //         this.generateSelectedMonth(nextProps.selectedDate);
    //     }
    // }

    // 获取选中月的信息,并缓存到monthStorage中
    generateSelectedMonth = (propsDate: string | undefined) => {
        const { selected_date } = this.state;
        const { year, month } = getYearMonthDay(propsDate || selected_date);
        const key = `${year}-${month}`;
        const { monthStorage } = this.state;
        if (monthStorage && monthStorage[key]) {
            this.setState({ currentMonthInfo: monthStorage[key] });
        } else {
            const dates = getDateListOfCurrentMonth(propsDate || selected_date);
            const title = `${year}年 ${month}月`;
            const currentMonthInfo = { dates, title, key };
            monthStorage[key] = currentMonthInfo;
            this.setState({ currentMonthInfo, monthStorage });
        }
    };

    changeToPrevMonth = () => {
        let { onChange } = this.props;
        const { selected_date } = this.state;
        const { y, year, m, d } = getYearMonthDay(selected_date);
        // 点击上个月的月份和年份
        const preM = m > 1 ? m - 1 : 12;
        const preMyear = m > 1 ? year : `${y - 1}`;
        // 上个月最后一天是几号
        const preMonthLastDay = new Date(Number(preMyear), preM, 0).getDate();
        // 选中的日期取当前日期和上个月最后一天的最小值
        const pred = Math.min(preMonthLastDay, d);
        const preSelectedDate = `${preMyear}-${fillDateWithZero(preM)}-${fillDateWithZero(pred)}`;
        if (typeof onChange === 'function') {
            this.generateSelectedMonth(preSelectedDate);
            this.setState({ selected_date: preSelectedDate });

            // onChange(preSelectedDate);
        }
    };
    changeToNextMonth = () => {
        const { onChange } = this.props;
        const { selected_date } = this.state;
        const { y, year, m, d } = getYearMonthDay(selected_date);
        const nextM = m > 11 ? 1 : m + 1;
        const nextMyear = m > 11 ? `${y + 1}` : year;
        const nextMonthLastDay = new Date(Number(nextMyear), nextM, 0).getDate();
        // 选中的日期取当前日期和上个月最后一天的最小值
        const nextd = Math.min(nextMonthLastDay, d);
        const nextSelectedDate = `${nextMyear}-${fillDateWithZero(nextM)}-${fillDateWithZero(
            nextd
        )}`;
        if (typeof onChange === 'function') {
            this.generateSelectedMonth(nextSelectedDate);
            this.setState({ selected_date: nextSelectedDate });
        }
    };

    onClickDateCell = item => {
        const { startDate, endDate, onChange } = this.props;
        const { date } = item;
        this.setState({ selectedDate: date });
        if(item.isPrevMonth || item.isNextMonth){
            this.generateSelectedMonth(date);
        }
        // 点击当月日期
        if (typeof onChange === 'function') {
            this.setState({ selected_date: date });
            onChange(date);
        }
    };
    defaultRender = (item, extra?) => {
        const { selected_date, current_date } = this.state;
        const { hasIcon, dateServiceInfo } = extra;
        return (
            <div>
                {current_date === item.date ? (
                    <div className="today-block">今</div>
                ) : (
                    <div className="not-today">{item.day}</div>
                )}
                {hasIcon ? (
                    <img
                        src={
                            item.date === selected_date && item.date === current_date
                                ? dateServiceInfo.selectedIcon
                                : dateServiceInfo.icon
                        }
                        className="service-icon"
                    />
                ) : null}
            </div>
        );
    };
    render() {
        const { currentMonthInfo, weekList, current_date, selected_date } = this.state;
        const { dateData, startDate, endDate, renderContent } = this.props;
        return (
            <div className="calendar-picker">
                <div className="calendar-picker-box">
                    <div className="calendar-picker-header">
                        <div className="current-month">
                            <div
                                className={`item arrow arrow-left ${
                                    isDateInRange(startDate, selected_date) ? '' : 'disabled'
                                }`}
                                onClick={
                                    isDateInRange(startDate, selected_date)
                                        ? this.changeToPrevMonth
                                        : () => {
                                              return;
                                          }
                                }
                            >
                            </div>
                            <span className="item title-date">{currentMonthInfo.title}</span>
                            <div
                               className={`item arrow arrow-right ${isDateInRange(selected_date, endDate) ? 'disabled' : 'disabled'}`}
                                onClick={
                                    isDateInRange(selected_date, endDate)
                                        ? this.changeToNextMonth
                                        : () => {
                                              return;
                                          }
                                }
                            >
                            </div>
                        </div>
                        {selected_date !== current_date ? (
                            <div
                                className="title-date-today"
                                onClick={() => {
                                    if (typeof this.props.onChange === 'function') {
                                        this.setState({ selected_date: current_date });
                                        this.props.onChange(current_date);
                                        this.generateSelectedMonth(current_date);
                                    }
                                }}
                            >
                                <img src={IMAGE_SRC_MAP.backTodayIcon} className="today-icon" />
                            </div>
                        ) : null}
                    </div>
                    <div className="calendar-picker-week">
                        {weekList.map((item, index) => (
                            <div className="week-cell" key={`week-cell-${index}`}>
                                {item}
                            </div>
                        ))}
                    </div>
                    <div className="calendar-picker-month-box">
                        {(currentMonthInfo.dates || ([] as any)).map((item, idx: number) => {
                            let clsName = '';
                            let dateServiceInfo: any = {};
                            let hasIcon = false; // 是否展示服务icon
                            if (item.disabled) clsName += ' disabled';
                            if (item.isPrevMonth) clsName += ' prev-month-day';
                            if (item.isNextMonth) clsName += ' next-month-day';
                            if (item.date === selected_date && item.date !== current_date)
                                clsName += ' active';
                            if (item.date === selected_date && item.date === current_date)
                                clsName += ' active-today';
                            if (
                                !(
                                    item.isPrevMonth ||
                                    item.isNextMonth ||
                                    item.disabled ||
                                    !dateData ||
                                    !dateData.length
                                )
                            ) {
                                // 匹配是否有服务项
                                dateServiceInfo = dateData.find(
                                    serviceInfoItem => serviceInfoItem.date === item.date
                                );
                                hasIcon = dateServiceInfo ? true : false;
                            }
                            if (hasIcon) clsName += ' has-icon';
                            return (
                                <div className="week-cell date-cell" key={'date-cell' + idx}>
                                    <div
                                        onClick={() => this.onClickDateCell(item)}
                                        key={Date.now() + idx}
                                    >
                                        <div className={`text-item ${clsName}`}>
                                            {renderContent
                                                ? renderContent(item)
                                                : this.defaultRender(item, {
                                                      hasIcon,
                                                      dateServiceInfo
                                                  })}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        );
    }
}

export default CalendarPicker;
