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

const MyForm = ({task = null, isLoading = false, event = null, setIsModalOpen = null, isAdd}) => {
  const [deleteEvent, { isDelete, isDeleteErrors }] = useDeleteEventMutation();
  console.log(task)
  const [dateStart, setDateStart] = useState(task? dayjs(task.date_start) : null)
  const [dateEnd, setDateEnd] = useState(task? dayjs(task.date_start) : null)
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
          name: ['start_date'],
          value: task ? dayjs(task.date_start) : null,
        },
        {
          name: ['end_date'],
          value: (task && !isAdd) ? dayjs(task.data_end) : "",
        },
  
      ])
  },[task, isAdd])

    const handlerFinish =  (values) => {
      try{
        event({id: task?.id,date_start:dateStart.format('YYYY-MM-DD HH:mm'), data_end:dateEnd.format('YYYY-MM-DD HH:mm'), title: values.title, description: values.description})
        setIsModalOpen && setIsModalOpen(false)
      }catch(error){
        console.error('Ошибка при создании события:', error);
      }
    }

    const handlerDelete = () =>{
      deleteEvent(task.id)
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
        initialValue={dateStart}>
       <DatePicker onChange={(date) => setDateStart(date)} showTime needConfirm={false} format="YYYY-MM-DD HH:mm" />
      </Form.Item>
      <Form.Item label="Дата конца"
        name="end_date"
        rules={[{ required: true, message: 'Обязательное поле'}, {validator: datesValidator} ]}
        initialValue={dateEnd}>
       <DatePicker onChange={(date) => setDateEnd(date)} showTime needConfirm={false} format="YYYY-MM-DD HH:mm" />
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