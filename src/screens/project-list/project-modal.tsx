import React, { useEffect } from "react";
import { Button, Drawer, Form, Input, Spin } from "antd";
import {
  useProjectModal,
  useProjectsQueryKey,
} from "screens/project-list/util";
import { UserSelect } from "components/user-select";
import { useAddProject, useEditProject } from "utils/project";
import { ErrorBox } from "components/lib";
import styled from "@emotion/styled";

export const ProjectModal = () => {
  const {
    projectModalOpen,
    close,
    editingProject,
    isLoading,
  } = useProjectModal();
  const useMutateProject = editingProject ? useEditProject : useAddProject;

  const { mutateAsync, error, isLoading: mutateLoading } = useMutateProject(
    useProjectsQueryKey()
  );
  const [form] = Form.useForm();
  const onFinish = (values: any) => {
    mutateAsync({ ...editingProject, ...values }).then(() => {
      form.resetFields();
      close();
    });
  };
  const closeModal = () => {
    form.resetFields();
    close();
  };

  const title = editingProject ? "編輯項目" : "創建項目";

  useEffect(() => {
    form.setFieldsValue(editingProject);
  }, [editingProject, form]);

  return (
    <Drawer
      forceRender={true}
      onClose={closeModal}
      visible={projectModalOpen}
      width={"100%"}
    >
      <Container>
        {isLoading ? (
          <Spin size={"large"} />
        ) : (
          <>
            <h1>{title}</h1>
            <ErrorBox error={error} />
            <Form
              form={form}
              layout={"vertical"}
              style={{ width: "40rem" }}
              onFinish={onFinish}
            >
              <Form.Item
                label={"名稱"}
                name={"name"}
                rules={[{ required: true, message: "請輸入項目名" }]}
              >
                <Input placeholder={"請輸入項目名稱"} />
              </Form.Item>

              <Form.Item
                label={"部門"}
                name={"organization"}
                rules={[{ required: true, message: "請輸入部門名" }]}
              >
                <Input placeholder={"請輸入部門名"} />
              </Form.Item>

              <Form.Item label={"負責人"} name={"personId"}>
                <UserSelect defaultOptionName={"負責人"} />
              </Form.Item>

              <Form.Item style={{ textAlign: "right" }}>
                <Button
                  loading={mutateLoading}
                  type={"primary"}
                  htmlType={"submit"}
                >
                  提交
                </Button>
              </Form.Item>
            </Form>
          </>
        )}
      </Container>
    </Drawer>
  );
};

const Container = styled.div`
  height: 80vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;
