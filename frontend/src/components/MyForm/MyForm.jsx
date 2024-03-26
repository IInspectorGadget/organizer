import {
    Button,
    DatePicker,
    Form,
    Input,
  } from 'antd';
import TextArea from 'antd/es/input/TextArea';
const { RangePicker } = DatePicker;
import {  useEffect, useState } from 'react';
import dayjs from 'dayjs';
import 'dayjs/locale/ru';
import { useDeleteEventMutation } from '@src/utils/api';

const MyForm = ({task = null, isLoading = false, event = null, setIsModalOpen = null}) => {
  const [deleteEvent, { isDelete, isDeleteErrors }] = useDeleteEventMutation();
  const [currentDate, setCurrentDate] = useState(task ? [dayjs(task.date_start),dayjs(task.data_end)] : null)
  const [fields, setFields] = useState(null);
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
        name: ['date'],
        value: task ? [dayjs(task.date_start),dayjs(task.data_end)] : [],
      },

    ])
  },[task])

    const handlerFinish =  (values) => {
      try{
        console.log(1)
        event({id: task?.id,date_start:dayjs(currentDate[0]).format('YYYY-MM-DD HH:mm'), data_end:dayjs(currentDate[1]).format('YYYY-MM-DD HH:mm'), title: values.title, description: values.description})
        setIsModalOpen && setIsModalOpen(false)
      }catch(error){
        console.error('Ошибка при создании события:', error);
      }
    }

    const handlerDelete = () =>{
      deleteEvent(task.id)
    }


    return (
    <Form fields={fields} style={{ maxWidth: 600, margin: "10px" }} onFinish={(values) => handlerFinish(values)}>
    <Form.Item
      label="Название события"
      name="title"
      rules={[{ required: true, message: 'Please input!' }]}
    >
        <Input/>
    </Form.Item>

    <Form.Item
      label="Описание события"
      name="description"
      rules={[{ required: true, message: 'Please input!' }]}
    >
        <TextArea/>
    </Form.Item>

    <Form.Item
      label="Введите дату начала и конца"
      name="date"
      rules={[{ required: true, message: 'Please input!' }]}
      initialValue={currentDate}
    >
     <RangePicker
          onChange={(dates, str) => {
            setCurrentDate(str)
          }}
          showTime={{ format: 'HH:mm' }}
          format="YYYY-MM-DD HH:mm" 
          value={currentDate}
      />
        
    </Form.Item>

    <Form.Item>
      <Button type="primary" htmlType="submit">
        {task ? "Сохранить" : "Создать"}
      </Button>
    </Form.Item>
    {task && <Form.Item>
      <Button type="primary" onClick={handlerDelete}>
        Удалить
      </Button>
    </Form.Item>}
  </Form>
)};

export default MyForm;