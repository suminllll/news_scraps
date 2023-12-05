interface ContentsList {
  contentsList: {
    _id: string
    headline: string
    web_url: string
    source: string
    byline: string
    date: string
    isStar: boolean
  }[]
  ref: React.MutableRefObject<HTMLDivElement>
}
