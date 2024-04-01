import { Button, Calendar, Flex, Modal, Popover, Typography } from "antd";
import { useCallback, useEffect, useState } from "react";
import { useQuery } from "react-query";
import dayjs from 'dayjs'
import isBetween from 'dayjs/plugin/isBetween'
import IsSameOrBefore from 'dayjs/plugin/isSameOrBefore'
import MyForm from "../MyForm";
import { LeftOutlined, PlusCircleOutlined, RightOutlined, UnorderedListOutlined } from '@ant-design/icons';
import { useCreateEventMutation, useGetDatesQuery, useUpdateEventMutation } from '@src/utils/api';
dayjs.extend(IsSameOrBefore)
dayjs.extend(isBetween)

const MyCalendar = () => {

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isAdd, setIsAdd] = useState(false);
    const [task, setTask] = useState(null);

    const [currentDate, setCurrentDate] = useState(dayjs())
    const [showDate, setShowDate] = useState(false);

    const startOfMonth = currentDate.startOf('month').subtract(1, 'month')
    const endOfMonth = currentDate.endOf('month').add(1, 'month')

    const { data, isLoading, isError } = useGetDatesQuery(
        {
          startOfMonth: startOfMonth.format('YYYY-MM-DD HH:mm'),
          endOfMonth: endOfMonth.format('YYYY-MM-DD HH:mm')
        }
    );
    const [colisions, setColisions] = useState([]);

    const [updateEvent, { isLoadingUpdate, isErrorUpdate }] = useUpdateEventMutation();
    const [createEvent, { isLoadingCreate, isErrorCreate }] = useCreateEventMutation();
    

    const showModal = useCallback((task) => {
      setTask(task);
      setIsModalOpen(true);
      setIsAdd(false)
    },[setTask, setIsModalOpen,setIsAdd]);

    const showAddModal = useCallback((task) => {
      setTask(task);
      setIsModalOpen(true);
      setIsAdd(true)
    },[setTask, setIsModalOpen,setIsAdd]);

    const handleOk = () => {
      setIsModalOpen(false);
      setShowDate(false)
    };

    const handleCancel = () => {
      setIsModalOpen(false);
      setShowDate(false)
      setColisions([])
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

    const isDateInRange = (date, startDate, endDate) => {
      return dayjs(date).isBetween(startDate, endDate, null, '[]');
  }
    
    const showDetailView = (date) => {
      setShowDate(date)
    }
    const taskOnCurrentDay = showDate && !isLoading ? data.tasks.reduce((acc, task) => {
      const startDate = dayjs(task.date_start).startOf('day');
      const endDate = dayjs(task.data_end);
      const isSameDay = isDateInRange(showDate, startDate, endDate);
      if(!acc[isSameDay]){
        acc[isSameDay] = []
      }
      acc[isSameDay].push(task)
      return acc
     
    }, {}) : [];

    const taskEvents = !isLoading && data?.tasks ? data.tasks.reduce((acc, task) => {
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
          <div>
          <Popover className="popover" content="Добавить запись"  ><div className="addButton" onClick={()=>showAddModal({date_start: value.format('YYYY-MM-DD')})}><PlusCircleOutlined className="buttonIcon"/></div></Popover>
          <Popover className="popover" content="Просмотреть все записи"  ><div className="detailButton" onClick={()=>showDetailView(date)}><UnorderedListOutlined  className="buttonIcon"/></div></Popover>
            <ul>
                {tasksForDate.map(task => (
                  <li className="item" key={task.id} onClick={()=>{showModal(task)}} > 
                     <Popover className="popover" content={task.description}>
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
            </div>
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
      <Calendar className="myCalendar" cellRender ={dateCellRender} value={currentDate} onChange={(date) => setCurrentDate(date)}/>
      <RightOutlined onClick={handleNextClick} style={{fontSize: '24px'}}/>
    </Flex>
     <Modal 
      title="Форма"
      open={isModalOpen} 
      onOk={handleOk} 
      onCancel={handleCancel} 
      confirmLoading={isLoadingUpdate}
      footer={<MyForm colisions={colisions} setColisions={setColisions} task={task} event={updateEvent} createEvent={createEvent} setIsModalOpen={setIsModalOpen} isAdd={isAdd}/>}
     />

    {!isModalOpen && <Modal 
      title={showDate}
      open={showDate} 
      onOk={handleOk} 
      onCancel={handleCancel} 
      className="detailModal"
     >
      {taskOnCurrentDay?.true?.map(el=> <Popover key={el.id} content={"Редактировать"}><li onClick={()=>{showModal(el)}} className="item" >
          <div className='collisionItemContainer'>
            <p>Название</p>
            <p className='secondItem'>{el.title}</p>
          </div>
          <div className='collisionItemContainer'>
            <p>Описание</p>
            <p className='secondItem'>{el.description}</p>
          </div>
          <div className='collisionItemContainer'>
            <p>Время начала</p>
            <p className='secondItem'>{dayjs(el.date_start).format('YYYY-MM-DD HH:mm')}</p>
          </div>
          <div className='collisionItemContainer'>
            <p>Время конца</p>
            <p className='secondItem'>{dayjs(el.data_end).format('YYYY-MM-DD HH:mm')}</p>
          </div>
        
        </li></Popover>)}
     </Modal>}
      
        
    </>;
};

export default MyCalendar;