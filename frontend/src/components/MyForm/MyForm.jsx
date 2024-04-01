import {
    Button,
    DatePicker,
    Form,
    Input,
    Typography,
  } from 'antd';
import TextArea from 'antd/es/input/TextArea';
const { RangePicker } = DatePicker;
import {  useEffect, useState } from 'react';
import dayjs from 'dayjs';
import 'dayjs/locale/ru';
import { useDeleteEventMutation } from '@src/utils/api';

const MyForm = ({task = null, isLoading = false, event = null, setIsModalOpen = null, createEvent, isAdd, colisions, setColisions}) => {
  const [deleteEvent, { isDelete, isDeleteErrors }] = useDeleteEventMutation();
  const [dateStart, setDateStart] = useState(task? dayjs(task.date_start) : null)
  const [dateEnd, setDateEnd] = useState(task? dayjs(task.date_start) : null)
  const [fields, setFields] = useState(null);

  const [error, setError] = useState();

  useEffect(()=>{
    setDateStart(task? dayjs(task.date_start) : null)
    setDateEnd(task? dayjs(task.data_end) : null)
  },[task])

  useEffect(()=>{
      setFields([
        {
          name: ['title'],
          value: task?.title,
        },
        {
          name: ['description'],
          value: task?.description,
        },
        {
          name: ['start_date'],
          value: task ? dayjs(task.date_start) : "",
        },
        {
          name: ['end_date'],
          value: (task && !isAdd) ? dayjs(task.data_end) : "",
        },
  
      ])
  },[task, isAdd])

    const handlerFinish =  async (values) => {
      try{
        let response
        if (isAdd){
          response = await createEvent({id: task?.id,date_start:dateStart.format('YYYY-MM-DD HH:mm'), data_end:dateEnd.format('YYYY-MM-DD HH:mm'), title: values.title, description: values.description})

        } else {
          response = await event({id: task?.id,date_start:dateStart.format('YYYY-MM-DD HH:mm'), data_end:dateEnd.format('YYYY-MM-DD HH:mm'), title: values.title, description: values.description})

        }
        if(response.data.colisions){
          setColisions(response.data.colisions)
          return 
        } 

        if(response.data.error){
          setError(response.data.error)
          return
        }
        setIsModalOpen && setIsModalOpen(false)
        setColisions([])

      }catch(error){
        console.error('Ошибка при создании события:', error);
      }
    }

    const handlerDelete = () =>{
      deleteEvent(task.id)
      setIsModalOpen(false)
    }

    const datesValidator = (rule, value, callback) => {
      if (dateStart && dateEnd) {
        if (dateStart.isAfter(dateEnd)) {
          callback('Дата начала не может быть позже даты окончания');
        } else if (dateEnd.isBefore(dateStart)) {
          callback('Дата окончания не может быть раньше даты начала');
        } else {
          callback();
        }
      } else {
        callback();
      }
    };


    return (
    <Form fields={fields} style={{ maxWidth: 600, margin: "10px" }} onFinish={(values) => handlerFinish(values)}>
    <Form.Item
      label="Название события"
      name="title"
      rules={[{ required: true, message: 'Обязательное поле' }, {max:120, message:"не может содержать больше 120 символов"}]}
    >
        <Input/>
    </Form.Item>

    <Form.Item
      label="Описание события"
      name="description"
      rules={[{ required: true, message: 'Обязательное поле' }]}
    >
        <TextArea/>
    </Form.Item>

      <Form.Item label="Дата начала"
        name="start_date"
        rules={[{ required: true, message: 'Обязательное поле' }, {validator: datesValidator}]}
        >
       <DatePicker onChange={(date) => {
        setDateStart(date)
        setFields(prev => {
          return [prev[0],prev[1],{...prev[2], value: date}, prev[3]]
        })
       }} showTime needConfirm={false} format="YYYY-MM-DD HH:mm" />
      </Form.Item>
      <Form.Item label="Дата конца"
        name="end_date"
        rules={[{ required: true, message: 'Обязательное поле'}, {validator: datesValidator} ]}
        >
       <DatePicker onChange={(date) => {
        setDateEnd(date)
        setFields(prev => {
          return [prev[0],prev[1],prev[2],{...prev[3], value: date}]
        })
        }} showTime needConfirm={false} format="YYYY-MM-DD HH:mm" />
      </Form.Item>
    {error?.length !== 0  &&  <Typography.Text type="danger">{error}</Typography.Text>}
    {colisions?.length !== 0 && <Form.Item>
        <p>Пересечения</p>
        {colisions.map(el => <li key={el.id} className='collisionItem'>
          <div className='collisionItemContainer'>
            <p>Название</p>
            <p className='secondItem'>{el.title}</p>
          </div>
          <div className='collisionItemContainer'>
            <p>Время начала</p>
            <p className='secondItem'>{dayjs(el.date_start).format('YYYY-MM-DD HH:mm')}</p>
          </div>
          <div className='collisionItemContainer'>
            <p>Время конца</p>
            <p className='secondItem'>{dayjs(el.data_end).format('YYYY-MM-DD HH:mm')}</p>
          </div>
        </li>
          
          )}
          <Typography.Text type="danger">Избавьтесь от пересечений </Typography.Text>
      </Form.Item>}

    <Form.Item>
      <Button type="primary" htmlType="submit">
        {task ? "Сохранить" : "Создать"}
      </Button>
    </Form.Item>
    {task && !isAdd && <Form.Item>
      <Button type="primary" onClick={handlerDelete}>
        Удалить
      </Button>
    </Form.Item>}
  </Form>
)};

export default MyForm;