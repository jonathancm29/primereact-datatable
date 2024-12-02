import { useEffect, useState } from "react";
import { Button } from "primereact/button";
import { DataTable, DataTableFilterEvent, DataTableFilterMeta, DataTablePageEvent, DataTableSortEvent } from "primereact/datatable";
import { Column } from "primereact/column";

import "primereact/resources/themes/lara-light-indigo/theme.css"; //theme
import "primereact/resources/primereact.min.css"; //core css
//import "primeicons/primeicons.css"; //icons
//import "primeflex/primeflex.css"; // flex

import "./App.css";

interface LazyTableState {
  first: number;
  rows: number;
  page: number;
  sortField?: string;
  sortOrder?: number;
  filters: DataTableFilterMeta;
}

function App() {
  const [loading, setLoading] = useState(false); 
  const [data, setData] = useState();
  const [limit, setLimit] = useState(5);
  const [page, setPage] = useState(1);

  const [lazyState, setlazyState] = useState<LazyTableState>({
    first: 0,
    rows: limit,
    page: page,
    sortField: null,
    sortOrder: null,
    filters: {
      title: { value: "", matchMode: "contains" },
      body: { value: "", matchMode: "contains" },
    },
  });

  let networkTimeout: number | undefined;

  useEffect(() => {
    getData();
  }, []);

  const getData = () => {
    console.log("getting data...");
    return fetch(
      `https://jsonplaceholder.typicode.com/posts?_page=${lazyState.page}&_limit=${lazyState.rows}`
    ).then((res) => res.json());
  };

  useEffect(() => {
    loadLazyData();
  }, [lazyState]);

  const loadLazyData = () => {
    setLoading(true);
    console.log("lazyState", lazyState);

    if (networkTimeout) {
      clearTimeout(networkTimeout);
    }

    networkTimeout = setTimeout(() => {
      getData().then((rows) => {
        setData(rows);
        setLoading(false);
        setLimit(lazyState.rows);
        setPage(lazyState.page);
      });
    }, Math.random() * 1000 + 250);

    //imitate delay of a backend call
  };

  const onPage = (event: DataTablePageEvent) => {
    console.log("onPage");
    setlazyState(event);
  };

  const onSort = (event: DataTableSortEvent) => {
    console.log("onSort");
    setlazyState(event);
  };

  const onFilter = (event: DataTableFilterEvent) => {
    console.log("onFilter");
    event["first"] = 0;
    setlazyState(event);
  };

  return (
    <>
      <DataTable
        value={data}
        lazy
        paginator
        rows={limit}
        first={lazyState.first}
        rowsPerPageOptions={[5, 10, 20]}
        totalRecords={100}
        onPage={onPage}
        tableStyle={{ minWidth: "50rem" }}
        dataKey="id"
        loading={loading}
        onSort={onSort}
        onFilter={onFilter}
        filterDisplay="row"
        filters={lazyState.filters}
        globalFilterFields={["title", "body"]}
      >
        <Column field="title" filter  header="title"></Column>
        <Column field="body" header="body"></Column>
      </DataTable>
      <Button>Click on the Vite and React logos to learn more</Button>
    </>
  );
}

export default App;
