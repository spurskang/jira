import { FormEvent } from "react";
import {login} from "auth-provider";
import { useAuth } from "context/auth-context";
import {Button, Form, Input} from 'antd';
import { LongButton } from "unauthenticated-app";

export const LoginScreen = () => {

    const {login, user} = useAuth();

    const handleSubmit = (values: {username: string, password: string}) => {
        login(values);
    }

    return( 
        <Form onFinish={handleSubmit}>
            <Form.Item name={'username'} rules={[{required: true, message: '請輸入用戶名'}]}>
                <Input placeholder={'用戶名'} type="text" id={'username'}/>
            </Form.Item>
            <Form.Item name={'password'} rules={[{required: true, message: '密碼'}]}>
                <Input placeholder={'密碼'} type="password" id={'password'}/>
            </Form.Item>
            <Form.Item>
                <LongButton htmlType={'submit'} type={'primary'}>登入</LongButton>
            </Form.Item>
        </Form>
    )
}