interface ContentsList {
  contentsList: { title: string; attached: string; name: string; date: string; isStar: boolean }[]
  ref: React.MutableRefObject<HTMLDivElement>
}
