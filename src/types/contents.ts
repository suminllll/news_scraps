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
  date: string
  isStar: boolean
  pub_date: moment.MomentInput
}
