import {
    Button,
    DatePicker,
    Form,
    Input,
  } from 'antd';
import TextArea from 'antd/es/input/TextArea';
const { RangePicker } = DatePicker;
import { useCallback, useState } from 'react';
import axios from "axios";


const MyForm = () => {
    const [currentDate, setCurrentDate] = useState()

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
    
      const handlerFinish = (values) => {
        console.log(currentDate[0], currentDate[1],values.title,values.description)
        createEvent( currentDate[0], currentDate[1],values.title,values.description)

      }


    return (
    <Form style={{ maxWidth: 600 }} onFinish={(values) => handlerFinish(values)}>
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
    >
        <RangePicker
            onChange={(dates, str) => setCurrentDate(str)}
            showTime={{ format: 'HH:mm' }}
            format="YYYY-MM-DD HH:mm" 
        />
    </Form.Item>

    <Form.Item wrapperCol={{ offset: 6, span: 16 }}>
      <Button type="primary" htmlType="submit">
        Создать
      </Button>
    </Form.Item>
  </Form>
)};

export default MyForm;