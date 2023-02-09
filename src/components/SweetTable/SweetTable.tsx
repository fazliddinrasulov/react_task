import React, {
  ReactNode,
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  Row,
  useTable,
  useGlobalFilter,
  useFilters,
  useAsyncDebounce,
  usePagination,
  useSortBy,
} from "react-table";
import classnames from "classnames";
import searchSvgPath from "../../assets/images/search.svg";

import { createUseStyles } from "react-jss";
import AnimateHeight from "react-animate-height";
import { useResizeDetector } from "react-resize-detector";

import { Classes } from "jss";
import { DatingNamesEnum } from "../../helpers/helper-function";

import arrowFilter from "../../assets/images/arrow.svg";
import arrowFilterDown from "../../assets/images/arrow-down.svg";

import style from "./SweetTable.module.scss";
import { useMediaQuery } from "react-responsive";
import { Button } from "../Button/Button";

export const cla = classnames;

export interface IMyCell {
  value: string | boolean;
  row: { id: string; index: number };
  column: { Header: string };
  tableIsNarrow?: boolean;
}

export type FilterFnOfTableT = (
  rows: {
    allCells: any[];
    cells: any[];
    depth: number;
    id: string;
    index: number;
    original: { [key: string]: any };
    values: { [key: string]: any };
  }[],
  columnIds: string[],
  filterValue: any
) => any[];

export interface IMyColumn {
  Header: Exclude<ReactNode | (() => ReactNode), null>;
  accessor: string;
  Cell?: (cell: IMyCell) => ReactNode;

  prioritizedStyles: {
    minWidth: number;
    flexGrow: number;
  };

  filter?: FilterFnOfTableT;
}

export type MyColumnsT = IMyColumn[];

export interface IMyRow {
  [key: string]: ReactNode;
}

export type MyTableDataT = IMyRow[];

export interface ICustomTopBottom {
  row: Row<IMyRow>;
  columns: MyColumnsT;
  payload: any;
}

export interface IStylingObjectForNpmReactJss {
  [key: string]: React.CSSProperties | undefined; // key will be part of the classname string
}

const useSweetNpmReactJss = (tableColumns: MyColumnsT) => {
  const classNamesForEachColumnWidth = () => {
    const initObj: { [key: string]: Classes<string> } = {};
    tableColumns.forEach((x) => {
      const id = x.accessor;
      const minWidth = x.prioritizedStyles.minWidth;
      const flexGrow = x.prioritizedStyles.flexGrow;

      const npmReactJssStylingObject = {
        cell: {
          width: `${minWidth}px`,
          flexGrow: flexGrow,
        },
      };

      const getClasses = createUseStyles(npmReactJssStylingObject, {
        name: style.uni,
      });
      const classes = getClasses();

      initObj[id] = classes;
    });

    return initObj;
  };

  const theClasses = classNamesForEachColumnWidth();

  return { classNamesForEachColWidth: theClasses };
};

export const SweetTable: React.FC<{
  className?: string;
  tableColumns: MyColumnsT;
  columnsToHideInPureFlowForNarrowTable?: string[];
  tableData: MyTableDataT;
  RowsAreCollapsedInitiallyForNarrowTable?: boolean;
  narrowHasCollapseExpandButton: boolean;
  narrowRowTopBoxContentMaker?: React.FC<ICustomTopBottom>;
  narrowRowBottomBoxContentMaker?: React.FC<ICustomTopBottom>;
  eachPageSize?: number;
  searchTerm?: string;
  changeEachPageSize: (num: number) => any;
  idsOfDatings?: DatingNamesEnum[];
}> = ({
  className,
  tableColumns,
  columnsToHideInPureFlowForNarrowTable = [],
  tableData,
  narrowHasCollapseExpandButton,
  narrowRowTopBoxContentMaker,
  narrowRowBottomBoxContentMaker,
  eachPageSize = 8,
  searchTerm,
  changeEachPageSize,
  idsOfDatings = [DatingNamesEnum.all],
}) => {
  const basicMinHeight = eachPageSize * 56;
  const numberOfCols = tableColumns.length;
  const widthBreakPoint =
    tableColumns.reduce(
      (accu, item) => accu + item.prioritizedStyles.minWidth,
      0
    ) +
    numberOfCols * 5 * 2 +
    8;

  const recentlyInitPage = useRef(true);
  const is900AndDown = useMediaQuery({ query: "(max-width: 900px)" });

  const idOfLastVisibleColumnForNarrowTable = useMemo(() => {
    const arrOfIsVisible = tableColumns.filter(
      (x) => !columnsToHideInPureFlowForNarrowTable.includes(x.accessor)
    );
    const lastId = arrOfIsVisible[arrOfIsVisible.length - 1].accessor;
    return lastId;
  }, [columnsToHideInPureFlowForNarrowTable, tableColumns]);

  const [searchCount, setSearchCount] = useState(0);

  const {
    ref: tableRef,
    width: tableWidth,
  }: {
    ref: React.MutableRefObject<HTMLTableElement | null>;
    height?: number;
    width?: number;
  } = useResizeDetector({
    handleHeight: false,
    refreshMode: "debounce",
    refreshRate: 500,
    // onResize
  });

  useLayoutEffect(() => {
    setTimeout(() => {
      recentlyInitPage.current = false;
    }, 3000);
  }, []);

  const tableIsNarrow = useMemo(() => {
    const offsetWidth = tableRef.current?.offsetWidth;

    if (!offsetWidth) {
      if (recentlyInitPage.current) {
        return is900AndDown;
      } else {
        return false;
      }
    }

    if (offsetWidth <= widthBreakPoint) {
      return true;
    } else {
      return false;
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tableWidth, widthBreakPoint]);

  const tableIsNarrowRef = useRef(tableIsNarrow);
  tableIsNarrowRef.current = tableIsNarrow;

  const tableInstance = useTable(
    {
      // @ts-ignore
      columns: tableColumns,
      data: tableData,
      // @ts-ignore
      initialState: { pageSize: eachPageSize },
    },
    useFilters,
    useGlobalFilter,
    useSortBy,
    usePagination
  );

  const {
    state,

    // @ts-ignore
    setGlobalFilter,

    // @ts-ignore
    setFilter,
    // @ts-ignore
    setSortBy,
  } = tableInstance;

  const {
    // globalFilter,

    // @ts-ignore
    filters,
  } = state;

  // @ts-ignore

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,

    prepareRow,
  } = tableInstance;

  const page: Row<IMyRow>[] = (tableInstance as any).page;

  const cl_narrowTable_wideTable = tableIsNarrow
    ? style.narrowTable
    : style.wideTable;

  const [mapOfCollapsedRows] = useState(tableData.map((x) => false));

  const { classNamesForEachColWidth } = useSweetNpmReactJss(tableColumns);

  const [headerAniHeight, setHeaderAniHeight] = useState<number | "auto">(
    "auto"
  );

  useEffect(() => {
    setGlobalFilter(searchTerm);
    setSearchCount(tableInstance.columns.length);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm]);

  useEffect(() => {
    const updateHeaderAni = () => {
      if (tableIsNarrowRef.current) {
        setHeaderAniHeight(0);
      } else {
        setHeaderAniHeight("auto");
      }
    };

    let timer: NodeJS.Timeout | undefined | null = undefined;

    if (recentlyInitPage.current) {
      timer = setTimeout(() => {
        updateHeaderAni();
      }, 300);
    }

    if (!recentlyInitPage.current) {
      updateHeaderAni();
    }

    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [tableIsNarrow]);

  const changeGloFilterWithDebouncer = useAsyncDebounce((value: any) => {
    setGlobalFilter(value);
  }, 1000);

  const [searchString, setSearchString] = useState("");

  const searchStringChanger: React.ChangeEventHandler<HTMLInputElement> =
    useCallback(
      (e) => {
        const newVal = e.target.value;
        setSearchString((prev) => newVal);
        changeGloFilterWithDebouncer(newVal);
      },
      [changeGloFilterWithDebouncer]
    );

  const datingIndexRef = useRef<number>(-1);
  const datingIndexPrevRef = useRef<number>(-1);
  const datingFilterInitiated = useRef(false);

  useEffect(() => {
    const filt = filters as { id: string; value: number }[];
    const nowDatingFilter = filt.find((x) => x.id === "date")?.value;

    if (!datingFilterInitiated.current && typeof nowDatingFilter === "number") {
      datingFilterInitiated.current = true;
    }

    if (datingFilterInitiated.current && nowDatingFilter === undefined) {
      setTimeout(() => {
        setFilter("date", datingIndexPrevRef.current);
      }, 50);
    }

    datingIndexRef.current = nowDatingFilter || -1;
    if (typeof nowDatingFilter === "number") {
      datingIndexPrevRef.current = nowDatingFilter;
    }
  }, [filters, setFilter]);

  const sortByDate = (sortStr: string) =>
    setSortBy([
      { id: "name", ...(sortStr === "ASC" ? { asc: true } : { desc: true }) },
    ]);

  const isSearchResultPage = false;

  return (
    <div className={cla(className, style.tableWrap, cl_narrowTable_wideTable)}>
      <div className={style.beforeTable}>
        <div className={style.beforeTableLeft}>
          <div className={style.beforeTableTitle}>Users</div>
          <span>{tableData.length}</span>
        </div>
        {!isSearchResultPage && (
          <div className={style.searchBox}>
            <div className={style.searchIconWrap}>
              <img
                className={style.searchIcon}
                src={searchSvgPath}
                alt={"search icon"}
              />
            </div>
            <input
              className={style.searchInput}
              placeholder={"Search"}
              value={searchString}
              onChange={searchStringChanger}
            />
          </div>
        )}
      </div>

      <div
        ref={tableRef}
        className={cla(style.myTable, cl_narrowTable_wideTable)}
        {...getTableProps()}
      >
        <AnimateHeight
          easing={"ease-in-out"}
          duration={800}
          height={headerAniHeight}
          className={cla(style.tHead, cl_narrowTable_wideTable)}
        >
          {headerGroups.map(
            (
              headerGroup: {
                getHeaderGroupProps: () => JSX.IntrinsicAttributes &
                  React.ClassAttributes<HTMLDivElement> &
                  React.HTMLAttributes<HTMLDivElement>;
                headers: any[];
              },
              index: any
            ) => (
              <div
                className={cla(style.tHeadRow, cl_narrowTable_wideTable)}
                {...headerGroup.getHeaderGroupProps()}
              >
                {headerGroup.headers.map(
                  (column: {
                    id: React.Key | any;
                    getHeaderProps: () => JSX.IntrinsicAttributes &
                      React.ClassAttributes<HTMLDivElement> &
                      React.HTMLAttributes<HTMLDivElement>;
                    render: (
                      arg0: string
                    ) =>
                      | string
                      | number
                      | boolean
                      | React.ReactElement<
                          any,
                          string | React.JSXElementConstructor<any>
                        >
                      | React.ReactFragment
                      | null
                      | undefined;
                  }) => {
                    return (
                      <div
                        className={cla(
                          style.tH,
                          classNamesForEachColWidth[column.id].cell,
                          cl_narrowTable_wideTable
                        )}
                        {...column.getHeaderProps()}
                        key={column.id}
                      >
                        {column.render("Header") === "User Name" ? (
                          <span className={style.tableTitle}>
                            {column.render("Header")}
                            <span className={style.tableArrows}>
                              <img
                                src={arrowFilter}
                                onClick={() => sortByDate("Desc")}
                                className={style.tableImage}
                                alt={"arrowFilter"}
                              />
                              <img
                                src={arrowFilterDown}
                                onClick={() => sortByDate("ASC")}
                                className={style.tableImage}
                                alt={"arrowFilterDown"}
                              />
                            </span>
                          </span>
                        ) : (
                          column.render("Header")
                        )}
                      </div>
                    );
                  }
                )}
              </div>
            )
          )}
        </AnimateHeight>

        <div
          style={
            tableIsNarrow ? undefined : { minHeight: `${basicMinHeight}px` }
          }
          className={cla(style.tBody, cl_narrowTable_wideTable)}
          {...getTableBodyProps()}
        >
          {page.map((row, rowInd) => {
            prepareRow(row);

            let rowIsCollapsed = mapOfCollapsedRows[rowInd];

            const cl_collapsedRow_expandedRow = rowIsCollapsed
              ? style.collapsedRow
              : style.expandedRow;

            return (
              <div
                className={cla(
                  style.tRow,
                  cl_narrowTable_wideTable,
                  cl_collapsedRow_expandedRow
                )}
                {...row.getRowProps()}
                key={rowInd}
              >
                {tableIsNarrow && (
                  <div className={cla(style.rowTopBox)}>
                    {narrowRowTopBoxContentMaker && (
                      <div>
                        {narrowRowTopBoxContentMaker({
                          columns: tableColumns,
                          row,
                          payload: undefined,
                        })}
                      </div>
                    )}
                  </div>
                )}

                <AnimateHeight
                  height={mapOfCollapsedRows[rowInd] ? 0 : "auto"}
                  duration={800}
                  className={cla(style.rowBody)}
                >
                  <div
                    className={cla(
                      style.pureCellFlow,
                      cl_narrowTable_wideTable
                    )}
                  >
                    {row.cells.map(
                      (cell: {
                        column: {
                          id: any;
                          render: (
                            arg0: string
                          ) =>
                            | string
                            | number
                            | boolean
                            | React.ReactElement<
                                any,
                                string | React.JSXElementConstructor<any>
                              >
                            | React.ReactFragment
                            | React.ReactPortal
                            | null
                            | undefined;
                        };
                        getCellProps: () => JSX.IntrinsicAttributes &
                          React.ClassAttributes<HTMLDivElement> &
                          React.HTMLAttributes<HTMLDivElement>;
                        render: (
                          arg0: string
                        ) =>
                          | string
                          | number
                          | boolean
                          | React.ReactElement<
                              any,
                              string | React.JSXElementConstructor<any>
                            >
                          | React.ReactFragment
                          | React.ReactPortal
                          | null
                          | undefined;
                      }) => {
                        const columnId = cell.column.id;
                        const cl_hid_visible =
                          tableIsNarrow &&
                          columnsToHideInPureFlowForNarrowTable.includes(
                            columnId
                          )
                            ? style.hid
                            : style.visible;

                        const cl_lastVis_notLastVis =
                          idOfLastVisibleColumnForNarrowTable === columnId
                            ? style.lastVis
                            : style.notLastVis;

                        return (
                          <div
                            className={cla(
                              style.tD,
                              classNamesForEachColWidth[columnId].cell,
                              cl_narrowTable_wideTable,
                              cl_hid_visible,
                              cl_lastVis_notLastVis
                            )}
                            data-label={cell.column.id}
                            {...cell.getCellProps()}
                          >
                            <div
                              className={cla(
                                style.label,
                                cl_narrowTable_wideTable
                              )}
                            >
                              {cell.column.render("Header")}
                            </div>
                            <div
                              className={cla(
                                style.value,
                                cl_narrowTable_wideTable
                              )}
                            >
                              {cell.render("Cell")}
                            </div>
                          </div>
                        );
                      }
                    )}
                  </div>

                  {tableIsNarrow && narrowRowBottomBoxContentMaker && (
                    <div className={cla(style.rowBottomBox)}>
                      {narrowRowBottomBoxContentMaker({
                        columns: tableColumns,
                        row,
                        payload: undefined,
                      })}
                    </div>
                  )}
                </AnimateHeight>
              </div>
            );
          })}
        </div>
      </div>

      <Button
        type={"submit"}
        className={style.addToBasket}
        text={"Save"}
        kind={"bBlack"}
      />
    </div>
  );
};
