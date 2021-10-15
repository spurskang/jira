import { Table } from 'antd';
import dayjs from 'dayjs';
import { User } from 'screens/project-list/search-panel';

interface Project{
    id: string;
    name: string;
    personId: string;
    pin: Boolean;
    organization: string;
    created: number;
}

interface ListProps{
    list: Project[],
    users: User[]
}

export const List = ({list, users}: ListProps) => {
    return <Table pagination={false} 
                  columns={[
                    {
                        title: '名稱', 
                        dataIndex: 'name', 
                        sorter: (a, b) => a.name.localeCompare(b.name)
                    }, 
                    {
                        title: '部門', 
                        dataIndex: 'organization', 
                    }, 
                    {
                        title: '負責人', 
                        render(value, project){
                        return (
                            <span>
                                {users.find(user => user.id === project.personId)?.name || '未知'}
                            </span>
                            );
                        }
                    },
                    {
                        title: '創建時間',
                        render(value, project){
                            return <span>
                                {project.created ? dayjs(project.created).format('YYYY-MM-DD') : '無'}
                            </span>
                        }
                    }
                  ]
    } dataSource={list} />
};