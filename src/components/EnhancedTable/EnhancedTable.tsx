import React, { useCallback, useMemo, useState } from "react";

import {
  ICustomTopBottom,
  IMyRow,
  SweetTable,
  MyColumnsT,
  FilterFnOfTableT,
} from "../SweetTable/SweetTable";

import { Row } from "react-table";
import {
  DatingNamesEnum,
  getPeriodMilliseconds,
  parseDateStringIntoUTCDate,
} from "../../helpers/helper-function";
import style from "./Enhanced.module.scss";
import { Checkbox } from "../Checkbox/Checkbox";

export enum OrdHistEnum {
  name = "name",
  view = "view",
  execute = "execute",
  modify = "modify",
  delete = "delete",
}

export const generateLastDatingFilterFn = (idsOfDatings: DatingNamesEnum[]) => {
  const lastDatingFilterFn: FilterFnOfTableT = (
    rows: any[],
    columnIds: any[],
    filterValue: number
  ) => {
    const now = new Date();
    const indexInDatingArray = filterValue as number;

    const idOfThisColumn = columnIds.find(
      (x: OrdHistEnum) => x === OrdHistEnum.name
    );

    if (!idOfThisColumn) {
      console.log("columnId 'date' not found in the array");
      return [];
    }

    const filterName = idsOfDatings[indexInDatingArray];

    if (filterName === DatingNamesEnum.all) {
      return rows;
    }

    const period = getPeriodMilliseconds(filterName);

    if (typeof period !== "number") {
      console.log("period not found");
      return [];
    }

    const pastEdgeDate = new Date(now.getTime() - period);

    if (idsOfDatings.includes(filterName)) {
      return rows.filter((row: { original: any }) => {
        const columnsOfThisRow = row.original;
        const val = columnsOfThisRow[idOfThisColumn] as string;

        const currRowDateInUTC = parseDateStringIntoUTCDate(val);

        if (currRowDateInUTC >= pastEdgeDate) {
          return true;
        } else {
          return false;
        }
      });
    } else {
      console.log("Unknown filterName");
      return [];
    }
  };

  return lastDatingFilterFn;
};

const OrderHistory: React.FC<{}> = () => {
  const idsOfDatings = useMemo(() => {
    return [
      DatingNamesEnum.all,
      DatingNamesEnum.last14Days,
      DatingNamesEnum.last30Days,
      DatingNamesEnum.last60Days,
      DatingNamesEnum.last3Months,
      DatingNamesEnum.last6Months,
      DatingNamesEnum.last1Year,
    ];
  }, []);

  const tableData: IMyRow[] = [
    {
      name: "User1",
      id: 1,
      view: true,
      execute: true,
      modify: false,
      delete: false,
    },
    {
      name: "User2",
      id: 2,
      view: true,
      execute: true,
      modify: false,
      delete: false,
    },
    {
      name: "User3",
      id: 3,
      view: true,
      execute: true,
      modify: false,
      delete: false,
    },
    {
      name: "User4",
      id: 4,
      view: true,
      execute: true,
      modify: false,
      delete: false,
    },
    {
      name: "User5",
      id: 5,
      view: true,
      execute: true,
      modify: false,
      delete: false,
    },
    {
      name: "User6",
      id: 6,
      view: true,
      execute: true,
      modify: false,
      delete: false,
    },
    {
      name: "User7",
      id: 7,
      view: true,
      execute: true,
      modify: false,
      delete: false,
    },
    {
      name: "User8",
      id: 8,
      view: true,
      execute: true,
      modify: false,
      delete: false,
    },
    {
      name: "User9",
      id: 9,
      view: true,
      execute: true,
      modify: false,
      delete: false,
    },
    {
      name: "User10",
      id: 10,
      view: true,
      execute: true,
      modify: false,
      delete: false,
    },
  ].map((item: any) => ({
    ...item,
  }));

  const tableColumns = React.useMemo(() => {
    const columns: MyColumnsT = [
      {
        Header: "User Name",
        accessor: OrdHistEnum.name, // accessor is the "key" in the data
        prioritizedStyles: {
          minWidth: 680,
          flexGrow: 128,
        },

        filter: generateLastDatingFilterFn(idsOfDatings),
        Cell: (cell: { value: any }) => {
          const { value } = cell;

          return (
            <div className={style.nameField}>
              <div className={style.circle}></div>
              {value}
            </div>
          );
        },
      },

      {
        Header: "View",
        accessor: OrdHistEnum.view,

        prioritizedStyles: {
          minWidth: 100,
          flexGrow: 100,
        },

        Cell: (cell: { value: any }) => {
          const { value } = cell;

          return (
            <Checkbox
              className={style.add10PercentWasteAndReserve}
              type={"checkbox"}
              id={"checkAdd103"}
              label={""}
              checked={false}
              name={"add10PercentWasteAndReserve"}
              onBlur={() => true}
              setFieldValue={() => true}
              value={value}
            />
          );
        },
      },

      {
        Header: "Execute",
        accessor: OrdHistEnum.execute,

        prioritizedStyles: {
          minWidth: 100,
          flexGrow: 100,
        },

        Cell: (cell: { value: any }) => {
          const { value } = cell;
          console.log(cell);

          return (
            <Checkbox
              className={style.add10PercentWasteAndReserve}
              type={"checkbox"}
              id={"checkAdd101"}
              label={""}
              checked={false}
              name={"add10PercentWasteAndReserve"}
              onBlur={() => true}
              setFieldValue={() => true}
              value={value || false}
            />
          );
        },
      },

      {
        Header: "Modify",
        accessor: OrdHistEnum.modify,
        Cell: (cell: { value: any }) => {
          const { value } = cell;

          return (
            <Checkbox
              className={style.add10PercentWasteAndReserve}
              type={"checkbox"}
              id={"checkAdd102"}
              label={""}
              checked={false}
              name={"add10PercentWasteAndReserve"}
              onBlur={() => !value}
              setFieldValue={() => true}
              value={value}
            />
          );
        },

        prioritizedStyles: {
          minWidth: 100,
          flexGrow: 100,
        },
      },

      {
        Header: "Delete",
        accessor: OrdHistEnum.delete,

        prioritizedStyles: {
          minWidth: 100,
          flexGrow: 100,
        },

        Cell: (cell: { value: any }) => {
          const { value } = cell;
          return (
            <Checkbox
              className={style.add10PercentWasteAndReserve}
              type={"checkbox"}
              id={"checkAdd10"}
              label={""}
              checked={false}
              name={"add10PercentWasteAndReserve"}
              onBlur={() => true}
              setFieldValue={() => true}
              value={value}
            />
          );
        },
      },
    ];

    return columns;
  }, [idsOfDatings, tableData]);

  const narrowRowTopBoxContentMaker: React.FC<ICustomTopBottom> = useCallback(
    ({ row }) => {
      const orderNumber = row.cells.find(
        (x: { column: { id: string } }) => x.column.id === "name"
      )?.value;
      return (
        <div className={style.narrowRowTopBoxContent}>
          <div className={style.orderNumber}>{orderNumber}</div>
        </div>
      );
    },
    []
  );

  const narrowRowBottomBoxContentMaker: React.FC<{
    row: Row<IMyRow>;
    columns: MyColumnsT;
    payload?: { previewFn: Function; downloadFn: Function };
  }> = useCallback(() => {
    return (
      <div className={style.narrowBottomBoxContent}>
        <div className={style.preview}>{"preview"}</div>
        <div className={style.download}>{"download"}</div>
      </div>
    );
  }, []);

  const [eachPageSize, setEachPageSize] = useState(10);
  const [tKey, setTKey] = useState(0);

  const changeEachPageSize = useCallback((num: number) => {
    setEachPageSize((prev) => num);
    setTKey((prev) => (prev += 1));
  }, []);

  return (
    <div className={style.taskHistPage}>
      <div className={style.pageTitle}>{"Permission"}</div>

      <div className={style.metaInfo}>
        <div className={style.branch}>
          <span className={style.indicator}>
            Create and customize rules for your interface
          </span>
        </div>
      </div>

      <SweetTable
        key={tKey}
        className={style.task}
        tableColumns={tableColumns}
        tableData={tableData}
        RowsAreCollapsedInitiallyForNarrowTable={true}
        narrowHasCollapseExpandButton={true}
        narrowRowTopBoxContentMaker={narrowRowTopBoxContentMaker}
        narrowRowBottomBoxContentMaker={narrowRowBottomBoxContentMaker}
        idsOfDatings={idsOfDatings}
        eachPageSize={eachPageSize}
        changeEachPageSize={changeEachPageSize}
      />
    </div>
  );
};

export default OrderHistory;
