export const MONTHLYCOLUMNS = [
  {
    Header: "Month ",
    accessor: "my",
  },
  {
    Header: "Mpan",
    accessor: "cc",
  },
  {
    Header: "Date",
    accessor: "date",
    //enableGrouping:false,//to disable grouping
    disableGroupBy: true,
  },
  {
    Header: "Total Volume",
    accessor: "tv",
    aggregate: "sum",
    Aggregated: ({ value }) => parseFloat(`${value}`).toFixed(2),
    disableGroupBy: true

  },
  {
    Header: "Peak Volume",
    accessor: "pv",
    aggregate: "sum",
    Aggregated: ({ value }) =>parseFloat(`${value}`).toFixed(2),
    disableGroupBy: true,

  },
  {
    Header: "Duos Volume",
    accessor: "dv",
    aggregate: "sum",
    Aggregated: ({ value }) => parseFloat(`${value}`).toFixed(2),
    disableGroupBy: true,

  },
  {
    Header: "Weekend Vol",
    accessor: "wv",
    aggregate: "sum",
    Aggregated: ({ value }) => parseFloat(`${value}`).toFixed(2),
    disableGroupBy: true,

  },
  {
    Header: "Offpeak Vol",
    accessor: "opv",
    aggregate: "sum",
    Aggregated: ({ value }) => parseFloat(`${value}`).toFixed(2),
    disableGroupBy: true,

  }

];
