import { Route, Routes } from "react-router-dom";
import {  Flex, Layout } from "antd";
import { QueryClient, QueryClientProvider } from "react-query";
import { Content} from "antd/es/layout/layout";
import MyForm from "@components/MyForm"
import MyCalendar from "@src/components/MyCalendar";
import { useCreateEventMutation, useGetDatesQuery } from "@src/utils/api";
import dayjs from 'dayjs'
import isBetween from 'dayjs/plugin/isBetween'
import IsSameOrBefore from 'dayjs/plugin/isSameOrBefore'
import { useRef } from "react";
dayjs.extend(IsSameOrBefore)
dayjs.extend(isBetween)
const queryClient = new QueryClient();


const Home = () => {
    const [createEvent, { isLoading, isError }] = useCreateEventMutation();
    return (
    <QueryClientProvider client={queryClient}>
        <Layout>
            {/* <Header></Header> */}
            <Content className='content'>
                <Flex vertical>
                    <MyForm event={createEvent} isLoading={isLoading}/>
                    <MyCalendar/>
                </Flex>
            </Content>
        </Layout>
        <Routes>
        </Routes>
    </QueryClientProvider>
    )
};

export default Home;