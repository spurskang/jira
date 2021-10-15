import React, { useState } from "react";
import { Row, ScreenContainer } from "components/lib";
import { useProjectInUrl } from "screens/kanban/util";
import { useDeleteEpic, useEpics } from "utils/epic";
import { Button, List, Modal } from "antd";
import dayjs from "dayjs";
import { useTasks } from "utils/task";
import { Link } from "react-router-dom";
import { useEpicSearchParams, useEpicsQueryKey } from "screens/epic/util";
import { Epic } from "types/epic";
import { CreateEpic } from "screens/epic/create-epic";

export const EpicScreen = () => {
  const { data: currentProject } = useProjectInUrl();
  const { data: epics } = useEpics(useEpicSearchParams());
  const { data: tasks } = useTasks({ projectId: currentProject?.id });
  const { mutate: deleteEpic } = useDeleteEpic(useEpicsQueryKey());
  const [epicCreateOpen, setEpicCreateOpen] = useState(false);

  const confirmDeleteEpic = (epic: Epic) => {
    Modal.confirm({
      title: `確定刪除：${epic.name}`,
      content: "點擊確定刪除",
      okText: "確定",
      onOk() {
        deleteEpic({ id: epic.id });
      },
    });
  };

  return (
    <ScreenContainer>
      <Row between={true}>
        <h1>{currentProject?.name}任務組</h1>
        <Button onClick={() => setEpicCreateOpen(true)} type={"link"}>
          創建任務組
        </Button>
      </Row>
      <List
        style={{ overflow: "scroll" }}
        dataSource={epics}
        itemLayout={"vertical"}
        renderItem={(epic) => (
          <List.Item>
            <List.Item.Meta
              title={
                <Row between={true}>
                  <span>{epic.name}</span>
                  <Button onClick={() => confirmDeleteEpic(epic)} type={"link"}>
                    刪除
                  </Button>
                </Row>
              }
              description={
                <div>
                  <div>開始時間：{dayjs(epic.start).format("YYYY-MM-DD")}</div>
                  <div>結束時間：{dayjs(epic.end).format("YYYY-MM-DD")}</div>
                </div>
              }
            />
            <div>
              {tasks
                ?.filter((task) => task.epicId === epic.id)
                .map((task) => (
                  <Link
                    to={`/projects/${currentProject?.id}/kanban?editingTaskId=${task.id}`}
                    key={task.id}
                  >
                    {task.name}
                  </Link>
                ))}
            </div>
          </List.Item>
        )}
      />
      <CreateEpic
        onClose={() => setEpicCreateOpen(false)}
        visible={epicCreateOpen}
      />
    </ScreenContainer>
  );
};