import { Remesh } from 'remesh'

export const SearchDomain = Remesh.domain({
  name: 'SearchDomain',
  impl: (domain) => {
    const KeywordState = domain.state({
      name: 'KeywordState',
      default: '',
    })

    const KeywordChangedEvent = domain.event<string>({
      name: 'KeywordChangedEvent',
    })

    const SetKeywordCommand = domain.command({
      name: 'SetKeywordCommand',
      impl: ({}, keyword: string) => {
        return [KeywordState().new(keyword), KeywordChangedEvent(keyword)]
      },
    })

    const KeywordQuery = domain.query({
      name: 'KeywordQuery',
      impl: ({ get }) => {
        return get(KeywordState())
      }
    })

    return {
      query: {
        KeywordQuery
      },
      command: {
        SetKeywordCommand
      },
      event: {
        KeywordChangedEvent
      }
    }
  }
})
