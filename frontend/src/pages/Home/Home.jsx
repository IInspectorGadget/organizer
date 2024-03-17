import { Route, Routes } from "react-router-dom";
import { Layout } from "antd";
import { QueryClient, QueryClientProvider } from "react-query";
import { Content, Header } from "antd/es/layout/layout";
import MyForm from "@components/MyForm"
const queryClient = new QueryClient();


const Home = () => {
    return (
    <QueryClientProvider client={queryClient}>
        <Layout>
            {/* <Header></Header> */}
            <Content className='content'>
                <MyForm></MyForm>
            </Content>
        </Layout>
        <Routes>
        </Routes>
    </QueryClientProvider>
    )
};

export default Home;