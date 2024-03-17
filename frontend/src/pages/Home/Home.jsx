import { Route, Routes } from "react-router-dom";
import {  Flex, Layout } from "antd";
import { QueryClient, QueryClientProvider } from "react-query";
import { Content} from "antd/es/layout/layout";
import MyForm from "@components/MyForm"
import MyCalendar from "@src/components/MyCalendar";
const queryClient = new QueryClient();


const Home = () => {

    return (
    <QueryClientProvider client={queryClient}>
        <Layout>
            {/* <Header></Header> */}
            <Content className='content'>
                <Flex vertical>
                    <MyForm/>
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