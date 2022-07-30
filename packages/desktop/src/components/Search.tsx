import { ChangeEvent } from 'react'
import { useRemeshDomain, useRemeshQuery, useRemeshSend } from 'remesh-react'
import { SearchDomain } from '../domains'

export function Search() {
  const send = useRemeshSend()
  const searchDomain = useRemeshDomain(SearchDomain())
  const keyword = useRemeshQuery(searchDomain.query.KeywordQuery())
  
  const handleKeywordChange = (e: ChangeEvent<HTMLInputElement>) => {
    send(searchDomain.command.SetKeywordCommand(e.target.value))
  }

  return (
    <div className="flex">
      <input
        type="text"
        placeholder="请输入关键字"
        className="input input-bordered w-full max-w-xs"
        value={keyword}
        onChange={handleKeywordChange}
      />
      <button
        className="btn btn-primary ml-2"
      >
        搜索
      </button>
    </div>
  )
}