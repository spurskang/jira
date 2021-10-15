import React from "react";
import { Dropdown, Menu, Modal, Table } from "antd";
import dayjs from "dayjs";
import { TableProps } from "antd/es/table";
import { Link } from "react-router-dom";
import { Pin } from "components/pin";
import { useDeleteProject, useEditProject } from "utils/project";
import { ButtonNoPadding } from "components/lib";
import {
  useProjectModal,
  useProjectsQueryKey,
} from "screens/project-list/util";
import { Project } from "types/project";
import { User } from "types/user";

interface ListProps extends TableProps<Project> {
  users: User[];
}

export const List = ({ users, ...props }: ListProps) => {
  const { mutate } = useEditProject(useProjectsQueryKey());
  const pinProject = (id: number) => (pin: boolean) => mutate({ id, pin });
  return (
    <Table
      rowKey={"id"}
      pagination={false}
      columns={[
        {
          title: <Pin checked={true} disabled={true} />,
          render(value, project) {
            return (
              <Pin
                checked={project.pin}
                onCheckedChange={pinProject(project.id)}
              />
            );
          },
        },
        {
          title: "名稱",
          sorter: (a, b) => a.name.localeCompare(b.name),
          render(value, project) {
            return <Link to={String(project.id)}>{project.name}</Link>;
          },
        },
        {
          title: "部門",
          dataIndex: "organization",
        },
        {
          title: "負責人",
          render(value, project) {
            return (
              <span>
                {users.find((user) => user.id === project.personId)?.name ||
                  "未知"}
              </span>
            );
          },
        },
        {
          title: "創建時間",
          render(value, project) {
            return (
              <span>
                {project.created
                  ? dayjs(project.created).format("YYYY-MM-DD")
                  : "無"}
              </span>
            );
          },
        },
        {
          render(value, project) {
            return <More project={project} />;
          },
        },
      ]}
      {...props}
    />
  );
};

const More = ({ project }: { project: Project }) => {
  const { startEdit } = useProjectModal();
  const editProject = (id: number) => () => startEdit(id);
  const { mutate: deleteProject } = useDeleteProject(useProjectsQueryKey());
  const confirmDeleteProject = (id: number) => {
    Modal.confirm({
      title: "確定刪除這個項目?",
      content: "點擊確定刪除",
      okText: "確定",
      onOk() {
        deleteProject({ id });
      },
    });
  };
  return (
    <Dropdown
      overlay={
        <Menu>
          <Menu.Item onClick={editProject(project.id)} key={"edit"}>
            編輯
          </Menu.Item>
          <Menu.Item
            onClick={() => confirmDeleteProject(project.id)}
            key={"delete"}
          >
            刪除
          </Menu.Item>
        </Menu>
      }
    >
      <ButtonNoPadding type={"link"}>...</ButtonNoPadding>
    </Dropdown>
  );
};
