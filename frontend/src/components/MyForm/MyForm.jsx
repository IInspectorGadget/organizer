import {
    Button,
    DatePicker,
    Form,
    Input,
  } from 'antd';
import TextArea from 'antd/es/input/TextArea';
const { RangePicker } = DatePicker;
import { useCallback, useEffect, useState } from 'react';
import axios from "axios";
import dayjs from 'dayjs';
import 'dayjs/locale/ru';

const MyForm = ({task = null, refetch = null}) => {
  const [currentDate, setCurrentDate] = useState(task ? [dayjs(task.date_start),dayjs(task.data_end)] : null)

    const createEvent = useCallback(
        async (date_start, data_end, title, description) => {
          try {
            await axios.post(`http://127.0.0.1:8000/api/createtask/`, {
                date_start,
                data_end,
                title,
                description,
            });
          } catch (err) {
            console.error(err);
          }
        },
        [],
      );
      
      const updateEvent = useCallback(
        async (date_start, data_end, title, description) => {
          try {
            await axios.put(`http://127.0.0.1:8000/api/updatetask/${task.id}/`, {
                date_start,
                data_end,
                title,
                description,
            });
            refetch()
          } catch (err) {
            console.error(err);
          }
        },
        [task, refetch],
      );

      const handlerFinish = (values) => {
        if (task) {
          updateEvent(currentDate[0], currentDate[1],values.title,values.description)
        }else{
          createEvent( currentDate[0], currentDate[1],values.title,values.description)
        }
      }

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
          onChange={(dates, str) => setCurrentDate(str)}
          showTime={{ format: 'HH:mm' }}
          format="YYYY-MM-DD HH:mm" 
          value={currentDate}
      />
        
    </Form.Item>

    <Form.Item>
      <Button type="primary" htmlType="submit">
        Создать
      </Button>
    </Form.Item>
  </Form>
)};

export default MyForm;