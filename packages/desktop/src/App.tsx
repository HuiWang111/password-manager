import { useRemeshDomain, useRemeshQuery, useRemeshSend } from 'remesh-react'
import {
  Search,
  Table,
  NavBar
} from './components'
import { AccountDomain } from './domains'

function App() {
  const send = useRemeshSend()
  const accountDomain = useRemeshDomain(AccountDomain())
  const list = useRemeshQuery(accountDomain.query.ListQuery())
  const page = useRemeshQuery(accountDomain.query.PageQuery())

  return (
    <div className="App bg-base-100">
      <NavBar />
      <div className='ml-10 mr-10 mt-5'>
        <Search />
        <Table
          className='mt-5'
          columns={[
            { title: '编号', dataIndex: 'id' },
            { title: '账号', dataIndex: 'account', render: (t: string) => t.startsWith('\\') ? t.slice(1) : t },
            { title: '密码', dataIndex: 'password' },
            { title: '面板', dataIndex: 'board' },
            { title: '备注', dataIndex: 'remark' }
          ]}
          dataSource={list as any as Record<string, string>[]}
          rowKey={data => data.id}
          pagination={{
            current: page,
            pageSize: 10,
            onChange: (current: number) => {
              send(accountDomain.command.SetPageCommand(current))
            }
          }}
        />
      </div>
    </div>
  )
}

export default App
