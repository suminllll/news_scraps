interface ContentsListProps {
  contentsList: ContentsList[]
  isFilter: boolean
}

type ContentsList = {
  _id: string
  headline: string
  web_url: string
  source: string
  byline: string
  date: moment.MomentInput
  pub_date: moment.MomentInput
  abstract: string
}

type FormattedContentsList = {
  _id: string
  headline: { main: string }
  web_url: string
  source: string
  byline: { original: string }
  date: moment.MomentInput
  pub_date: moment.MomentInput
  abstract: string
}

interface ScrapContentsList {
  list: ContentsList[]
  page: number
  totalPage: number
}
