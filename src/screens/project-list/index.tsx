import {List} from "./list";
import { SearchPanel } from "./search-panel";
import { useState, useEffect } from "react";
import * as qs from 'qs';
import { cleanObject, useDebounce, useMount } from "utils";
import { useHttp } from "utils/http";
import styled from "@emotion/styled";
import { useAsync } from "utils/use-async";
import { Typography } from "antd";

const apiUrl = process.env.REACT_APP_API_URL

export const ProjectListScreen = () => {
    const [users, setUsers] = useState([]);
    const [param, setParam] = useState({
        name: '',
        personId: ''
    });
    const debouncedParam = useDebounce(param, 200);
    const client = useHttp();
    const { run, isLoading, error, data: list } = useAsync<Project[]>(); 

    useEffect(()=>{
        run(client('projects',{data: cleanObject(debouncedParam)}));
    }, [debouncedParam]);

    useMount(()=>{
        client('users').then(setUsers);
    });

    return (
        <div style={{padding: '3.2rem'}}>
            <h1>項目列表</h1>
            <SearchPanel users={ users } param={ param } setParam={setParam}/>
            {error ? <Typography.Text type={'danger'}>{error.message}</Typography.Text> : null}
            <List loading={isLoading} users={ users } dataSource={list || []}/>
        </div>
    );
};

