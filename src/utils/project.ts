import { useAsync } from 'utils/use-async';
import { Project } from 'screens/project-list/list';
import { useEffect } from 'react';
import { cleanObject } from 'utils/index';

export const useProjects = () => {
  const { run, isLoading, error, data: list } = useAsync<Project[]>()

  useEffect(() => {
    run(client("projects", {data: cleanObject(debouncedParam)}))
  }, [debounceParam]);
}
