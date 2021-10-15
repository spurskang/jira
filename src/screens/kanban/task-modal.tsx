import React, { useEffect } from "react";
import { useTasksModal, useTasksQueryKey } from "screens/kanban/util";
import { useDeleteTask, useEditTask } from "utils/task";
import { Button, Form, Input, Modal } from "antd";
import { UserSelect } from "components/user-select";
import { TaskTypeSelect } from "components/task-type-select";
import { EpicSelect } from "components/epic-select";

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};

export const TaskModal = () => {
  const [form] = Form.useForm();
  const { editingTaskId, editingTask, close } = useTasksModal();
  const { mutateAsync: editTask, isLoading: editLoading } = useEditTask(
    useTasksQueryKey()
  );
  const { mutate: deleteTask } = useDeleteTask(useTasksQueryKey());

  const onCancel = () => {
    close();
    form.resetFields();
  };

  const onOk = async () => {
    await editTask({ ...editingTask, ...form.getFieldsValue() });
    close();
  };

  const startDelete = () => {
    close();
    Modal.confirm({
      okText: "確定",
      cancelText: "取消",
      title: "確定刪除任務?",
      onOk() {
        return deleteTask({ id: Number(editingTaskId) });
      },
    });
  };

  useEffect(() => {
    form.setFieldsValue(editingTask);
  }, [form, editingTask]);

  return (
    <Modal
      forceRender={true}
      onCancel={onCancel}
      onOk={onOk}
      okText={"確認"}
      cancelText={"取消"}
      confirmLoading={editLoading}
      title={"編輯任務"}
      visible={!!editingTaskId}
    >
      <Form {...layout} initialValues={editingTask} form={form}>
        <Form.Item
          label={"任務名"}
          name={"name"}
          rules={[{ required: true, message: "請輸入任務名" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item label={"任務組"} name={"epicId"}>
          <EpicSelect defaultOptionName={"任務組"} />
        </Form.Item>
        <Form.Item label={"經辦人"} name={"processorId"}>
          <UserSelect defaultOptionName={"經辦人"} />
        </Form.Item>
        <Form.Item label={"類型"} name={"typeId"}>
          <TaskTypeSelect />
        </Form.Item>
      </Form>
      <div style={{ textAlign: "right" }}>
        <Button
          onClick={startDelete}
          style={{ fontSize: "14px" }}
          size={"small"}
        >
          刪除
        </Button>
      </div>
    </Modal>
  );
};
