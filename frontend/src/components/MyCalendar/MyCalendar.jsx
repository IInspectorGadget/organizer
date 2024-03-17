import { Calendar } from "antd";
import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import { useQuery } from "react-query";
import dayjs from 'dayjs'
import isBetween from 'dayjs/plugin/isBetween'
import IsSameOrBefore from 'dayjs/plugin/isSameOrBefore'
dayjs.extend(IsSameOrBefore)
dayjs.extend(isBetween)

const MyCalendar = () => {
    const currentDate = dayjs()
    const startOfMonth = currentDate.startOf('month')
    const endOfMonth = currentDate.endOf('month')

    const getDates = useCallback(async () => {
        try {
          const response = await axios.get(`http://127.0.0.1:8000/api/taskslist/`, { params: {
            date_start: startOfMonth.format('YYYY-MM-DD HH:mm:ss'),
            data_end: endOfMonth.format('YYYY-MM-DD HH:mm:ss')
          } });
          return response.data;
        } catch (err) {
          console.error(err);
        }
      }, [endOfMonth, startOfMonth]);

    const {data, refetch, isLoading,} = useQuery(["calendar", endOfMonth, startOfMonth], getDates, {
        keepPreviousData: false,
      });

    const getDaysBetweenDates = (startDate, endDate) => {
        const days = [];
        let currentDate = dayjs(startDate);
        while (currentDate.isSameOrBefore(endDate, 'day')) {
            days.push(currentDate.format('YYYY-MM-DD'));
            currentDate = currentDate.add(1, 'day');
        }
        return days;
    };
  
    
    const taskEvents = !isLoading ? data.tasks.reduce((acc, task) => {
        const startDate = dayjs(task.date_start);
        const endDate = dayjs(task.date_end);
        const days = getDaysBetweenDates(startDate, endDate);
        days.forEach(date => {
          if (!acc[date]) {
            acc[date] = [];
          }
          acc[date].push(task);
        });
        return acc;
      }, {}) : [];
  

    const dateCellRender = (value) => {
        const date = dayjs(value).format('YYYY-MM-DD');
        const tasksForDate = taskEvents[date] || [];
        if (tasksForDate.length){
            console.log(value ,date,tasksForDate);
        }

        return (
            <ul>
                {tasksForDate.map(task => (
                    <li key={task.id}>{task.id}</li>
                ))}
            </ul>
        )
    }
    
    return  <Calendar dateCellRender ={dateCellRender}/>;
};

export default MyCalendar;