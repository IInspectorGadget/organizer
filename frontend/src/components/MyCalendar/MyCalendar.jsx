import { Button, Calendar, Flex, Modal, Popover, Typography } from "antd";
import { useCallback, useEffect, useState } from "react";
import { useQuery } from "react-query";
import dayjs from 'dayjs'
import isBetween from 'dayjs/plugin/isBetween'
import IsSameOrBefore from 'dayjs/plugin/isSameOrBefore'
import MyForm from "../MyForm";
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import { useGetDatesQuery, useUpdateEventMutation } from '@src/utils/api';
dayjs.extend(IsSameOrBefore)
dayjs.extend(isBetween)

const MyCalendar = () => {

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [task, setTask] = useState(null);

    const [currentDate, setCurrentDate] = useState(dayjs())
    const startOfMonth = currentDate.startOf('month').subtract(1, 'month')
    const endOfMonth = currentDate.endOf('month').add(1, 'month')

    const { data, isLoading, isError } = useGetDatesQuery(
        {
          startOfMonth: startOfMonth.format('YYYY-MM-DD HH:mm'),
          endOfMonth: endOfMonth.format('YYYY-MM-DD HH:mm')
        }
    );

    const [updateEvent, { isLoadingUpdate, isErrorUpdate }] = useUpdateEventMutation();
    

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

    const handlePrevClick = () => {
      setCurrentDate(prevDate => prevDate.clone().subtract(1, 'month'));
    };
  
    const handleNextClick = () => {
      setCurrentDate(prevDate => prevDate.clone().add(1, 'month'));
    };
    
    return  <>
    <Flex>
      <LeftOutlined onClick={handlePrevClick} style={{fontSize: '24px'}}/>
      <Calendar cellRender ={dateCellRender} value={currentDate}/>
      <RightOutlined onClick={handleNextClick} style={{fontSize: '24px'}}/>
    </Flex>
     <Modal 
      title="Изменение события" 
      open={isModalOpen} 
      onOk={handleOk} 
      onCancel={handleCancel} 
      confirmLoading={isLoadingUpdate}
      footer={<MyForm task={task} event={updateEvent} setIsModalOpen={setIsModalOpen}/>}
     >
        
      </Modal>
    </>;
};

export default MyCalendar;