import { Remesh } from 'remesh'
import type { PM } from '@kennys_wang/pm-core'

const defaultRecord = {
  account: '',
  password: '',
  board: '',
  remark: '',
  confirmPwd: ''
}

export const AccountDomain = Remesh.domain({
  name: 'ListDomain',
  impl: (domain) => {
    const ListState = domain.state<PM[]>({
      name: 'ListState',
      default: window.pm.getList().reverse()
    })
    const ListChangeEvent = domain.event<PM[]>({
      name: 'ListChangeEvent'
    })
    const SetListCommand = domain.command({
      name: 'SetListCommand',
      impl: ({}, list: PM[]) => {
        return [
          ListState().new(list),
          ListChangeEvent(list)
        ]
      }
    })
    const ListQuery = domain.query({
      name: 'ListQuery',
      impl: ({ get }) => {
        return get(ListState())
      }
    })

    
    const PageState = domain.state<number>({
      name: 'PageState',
      default: 1
    })
    const SetPageCommand = domain.command({
      name: 'SetPageCommand',
      impl: ({}, current: number) => {
        return [PageState().new(current)]
      }
    })
    const PageQuery = domain.query({
      name: 'PageQuery',
      impl: ({ get }) => {
        return get(PageState())
      }
    })

    const RecordState = domain.state<Omit<PM, 'id'> & { confirmPwd: string }>({
      name: 'RecordState',
      default: { ...defaultRecord }
    })
    const MergeRecordCommand = domain.command({
      name: 'SetRecordCommand',
      impl: ({ get }, record: Partial<PM>) => {
        return [RecordState().new({
          ...get(RecordState()),
          ...record
        })]
      }
    })
    const ClearRecordCommand = domain.command({
      name: 'ClearRecordCommand',
      impl: () => {
        return [RecordState().new({ ...defaultRecord })]
      }
    })
    const RecordQuery = domain.query({
      name: 'RecordQuery',
      impl: ({ get }) => {
        return get(RecordState())
      }
    })

    return {
      query: {
        ListQuery,
        PageQuery,
        RecordQuery,
      },
      command: {
        SetListCommand,
        SetPageCommand,
        MergeRecordCommand,
        ClearRecordCommand,
      },
      event: {
        ListChangeEvent,
      },
    }
  }
})