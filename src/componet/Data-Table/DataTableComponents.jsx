import DataTable from "react-data-table-component";
import { loaders } from "../loader/Loader";
import { customStyles } from "./DataTableCss";

const DataTableComponents = ({ columns, currentPageData , loader, filterDataLength  , perPage, handleRowsPerPageChange, handlePageChange }) => {
    return (
        <>

            <DataTable  
                columns={columns}
                data={currentPageData }
                progressPending={loader}
                progressComponent={loaders.table}
                noDataComponent={loaders.noDataTable}
                pagination
                paginationServer
                paginationTotalRows={filterDataLength}
                paginationPerPage={perPage}
                onChangeRowsPerPage={handleRowsPerPageChange}
                onChangePage={handlePageChange}
                customStyles={customStyles}
            />

        </>
    )
}

export default DataTableComponents;