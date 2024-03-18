import { Calendar, Flex, Modal, Popover, Typography } from "antd";
import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import { useQuery } from "react-query";
import dayjs from 'dayjs'
import isBetween from 'dayjs/plugin/isBetween'
import IsSameOrBefore from 'dayjs/plugin/isSameOrBefore'
import MyForm from "../MyForm";
dayjs.extend(IsSameOrBefore)
dayjs.extend(isBetween)

const MyCalendar = () => {
    const currentDate = dayjs()
    const startOfMonth = currentDate.startOf('month')
    const endOfMonth = currentDate.endOf('month')

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [task, setTask] = useState(null);

    const showModal = useCallback((task) => {
      setTask(task);
      setIsModalOpen(true);
    },[setTask, setIsModalOpen]);

    const handleOk = () => {
      setIsModalOpen(false);
    };

    const handleCancel = () => {
      setIsModalOpen(false);
    };


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
        const endDate = dayjs(task.data_end);
        const days = getDaysBetweenDates(startDate, endDate);
        days.forEach((date, index) => {
          const isStartDate = index === 0;
          const isEndDate = index === days.length - 1;
          const startTime = isStartDate ? `Начало: ${startDate.format('HH:mm')}` : '';
          const endTime = isEndDate ? `Окончание: ${endDate.format('HH:mm')}` : '';
          const taskWithTime = { ...task, startTime, endTime };
          if (!acc[date]) {
            acc[date] = [];
          }
          acc[date].push(taskWithTime);
        });
        return acc;
      }, {}) : [];
  

    const dateCellRender = (value) => {
        const date = dayjs(value).format('YYYY-MM-DD');
        const tasksForDate = taskEvents[date] || [];

        return (
            <ul>
                {tasksForDate.map(task => (
                  <li key={task.id} onClick={()=>{showModal(task)}} > 
                     <Popover content={task.description} title="Title">
                      <Flex vertical>
                        <Typography.Text type="warning">{task.title}</Typography.Text>
                        {task.startTime && <Typography.Text type="success">{task.startTime}</Typography.Text>}
                        {task.endTime && <Typography.Text type="danger">{task.endTime}</Typography.Text>}
                        {!task.endTime && !task.startTime && <Typography.Text type="secondary">весь день</Typography.Text>}
                      </Flex>
                    </Popover>
                       </li>
                ))}
            </ul>
        )
    }
    
    return  <>
    <Calendar dateCellRender ={dateCellRender}/>
     <Modal title="Basic Modal" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
        <MyForm task={task} refetch={refetch}/>
      </Modal>
    </>;
};

export default MyCalendar;