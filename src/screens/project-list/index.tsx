import React from "react";
import { SearchPanel } from "screens/project-list/search-panel";
import { List } from "screens/project-list/list";
import { useDebounce, useDocumentTitle } from "utils";
import { useProjects } from "utils/project";
import { useUsers } from "utils/user";
import {
  useProjectModal,
  useProjectsSearchParams,
} from "screens/project-list/util";
import {
  ButtonNoPadding,
  ErrorBox,
  Row,
  ScreenContainer,
} from "components/lib";
import { Profiler } from "components/profiler";

export const ProjectListScreen = () => {
  useDocumentTitle("項目列表", false);

  const { open } = useProjectModal();

  const [param, setParam] = useProjectsSearchParams();
  const { isLoading, error, data: list } = useProjects(useDebounce(param, 200));
  const { data: users } = useUsers();

  return (
    <Profiler id={"項目列表"}>
      <ScreenContainer>
        <Row marginBottom={2} between={true}>
          <h1>項目列表</h1>
          <ButtonNoPadding onClick={open} type={"link"}>
            創建項目
          </ButtonNoPadding>
        </Row>
        <SearchPanel users={users || []} param={param} setParam={setParam} />
        <ErrorBox error={error} />
        <List loading={isLoading} users={users || []} dataSource={list || []} />
      </ScreenContainer>
    </Profiler>
  );
};

ProjectListScreen.whyDidYouRender = false;

