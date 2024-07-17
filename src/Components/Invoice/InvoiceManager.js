import { useState, useEffect } from "react";
import { listStayingAndComingInvoices } from "../../db/invoice";
import { Link } from "react-router-dom";
import { Table } from "flowbite-react";
import { env } from "process";
import Moment from "react-moment";


export function InvoiceManager() {
  const [invoices, setInvoices] = useState([
    {
      "id": "000000000000000000",
      "guestName": "",
      "issuer": "",
      "issuerId": "",
      "subTotal": 0
    }
  ])

  const [fromDate, setFromDate] = useState(new Date());
  const [deltaDays, setDeltaDays] = useState(0)

  const [pagination, setPagination] = useState({
    pageNumber: 0,
    pageSize: 10,
    totalElements: 200,
    totalPages: 20
  })

  const filterDay = (numDays) => {

    var newDate = Date.now() + numDays * 86400000
    var newDD = new Date(newDate)
    console.info("Change filter date to %s", newDD.toISOString())
    setFromDate(newDD)
    setDeltaDays(numDays)
    fetchInvoices(newDD, pagination.pageNumber, pagination.pageSize)
  }

  const handlePaginationClick = (pageNumber) => {
    console.log("Pagination nav bar click to page %s", pageNumber)
    var pNum = pageNumber < 0 ? 0 : pageNumber > pagination.totalPages - 1 ? pagination.totalPages - 1 : pageNumber;
    var pSize = pagination.pageSize
    fetchInvoices(fromDate, pNum, pSize)
  }

  const fetchInvoices = (fromDate, pageNumber, pageSize) => {

    var fd = fromDate.toISOString().split('T')[0]
    console.info("Loading invoices from date %s...", fd)

    listStayingAndComingInvoices(fd, pageNumber, pageSize)
      .then(data => {
        setInvoices(data.content)
        var page = {
          pageNumber: data.number,
          pageSize: data.size,
          totalElements: data.totalElements,
          totalPages: data.totalPages
        }
        setPagination(page)
      })
  }

  useEffect(() => {
    fetchInvoices(new Date(), 0, 10);
  }, []);

  const filterOpts = [
    {
      days: 0,
      label: 'Today'
    },
    {
      days: -1,
      label: 'Yesterday'
    }, {
      days: -5,
      label: 'Last 5 days'
    }]
  const filterClass = (days) => {
    var classNamePattern = "font-bold text-amber-800 rounded px-2 py-1"
    return classNamePattern + " " + (deltaDays === days ? "bg-slate-400" : "bg-slate-200");
  }

  const pageClass = (pageNum) => {
    var noHighlight = "px-3 py-2 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
    var highlight = "px-3 py-2 leading-tight text-bold text-blue-600 border border-blue-300 bg-blue-50 hover:bg-blue-100 hover:text-blue-700 dark:border-gray-700 dark:bg-gray-700 dark:text-white"

    return pagination.pageNumber === pageNum ? highlight : noHighlight
  }

  const handleDeleteInvoice = (inv)=>{
    console.warn("Delete invoice {}...", inv.id)
  }


  return (
    <div>
      <div className="py-2 px-2 space-x-4 flex flex-wrap space-y-2">
        <Link to="../invoice/new" relative="route" className="font-bold text-amber-800 pl-4 py-1">New Invoice</Link>
        <div className="space-x-4">
          {filterOpts.map((opt) => {
            return (<Link key={opt.days} onClick={() => filterDay(opt.days)} relative="route" className={filterClass(opt.days)}>{opt.label}</Link>)
          })}
        </div>
      </div>
      <Table hoverable={true}>
        <Table.Head>
          <Table.HeadCell className="pr-1">
            ChOut
          </Table.HeadCell>
          <Table.HeadCell className="px-1">
            Details
          </Table.HeadCell>
          {/* <Table.HeadCell>
            Delete
          </Table.HeadCell> */}
          <Table.HeadCell>
            <span className="sr-only">
              Delete
            </span>
          </Table.HeadCell>
        </Table.Head>
        <Table.Body className="divide-y">
          {invoices.map((inv) => {
            return (
              <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800" key={inv.id}>
                <Table.Cell className="flex flex-wrap font-medium text-gray-900 dark:text-white pr-1">
                <Moment format="DD.MM">{new Date(inv.checkOutDate)}</Moment>
                </Table.Cell>
                


                <Table.Cell className="sm:px-1 px-1">
                    <div className="grid grid-cols-1">
                      <Link
                        to={env.id}
                        state={{ pageNumber: pagination.pageNumber, pageSize: pagination.pageSize }}
                        className="font-medium text-blue-600 hover:underline dark:text-blue-500"
                      >
                        {inv.guestName}
                      </Link>
                      <div className="flex flex-row text-sm space-x-1">
                        <div className="w-24">
                          <span>{inv.subTotal.toLocaleString('us-US', { style: 'currency', currency: 'VND' })}</span>
                        </div>
                        <span className="font font-mono font-black">{inv.prepaied?"TT":"TS"}</span>
                        <span className="font font-mono font-black">{inv.issuer}</span>
                      </div>
                    </div>
                  </Table.Cell>
                
                
                  <Table.Cell>
                    <svg class="w-6 h-6 text-red-800 dark:text-white"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24" fill="none" viewBox="0 0 24 24"
                      onClick={() => handleDeleteInvoice(inv)}
                    >
                      <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 7h14m-9 3v8m4-8v8M10 3h4a1 1 0 0 1 1 1v3H9V4a1 1 0 0 1 1-1ZM6 7h12v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V7Z" />
                    </svg>

                  </Table.Cell>
                {/* <Table.Cell>
                  <Link to={inv.id} className="font-medium text-blue-600 hover:underline dark:text-blue-500">Edit</Link>
                </Table.Cell> */}
              </Table.Row>
            )
          })}
        </Table.Body>
      </Table>
      <nav className="flex items-center justify-between pt-4" aria-label="Table navigation">
        <span className="text-sm font-normal text-gray-500 dark:text-gray-400">Showing <span className="font-semibold text-gray-900 dark:text-white">{pagination.pageSize * pagination.pageNumber + 1}-{pagination.pageSize * pagination.pageNumber + pagination.pageSize}</span> of <span className="font-semibold text-gray-900 dark:text-white">{pagination.totalElements}</span></span>
        <ul className="inline-flex items-center -space-x-px">
          <li onClick={() => handlePaginationClick(pagination.pageNumber - 1)} className="block px-3 py-2 ml-0 leading-tight text-gray-500 bg-white border border-gray-300 rounded-l-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">
            <svg className="w-5 h-5" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd"></path></svg>
          </li>
          <li onClick={() => handlePaginationClick(0)} className={pageClass(0)}>
            1
          </li>
          <li hidden={pagination.pageNumber + 1 <= 1 || pagination.pageNumber + 1 >= pagination.totalPages} aria-current="page" className={pageClass(pagination.pageNumber)}>
            {pagination.pageNumber + 1}
          </li>
          <li hidden={pagination.totalPages <= 1} onClick={() => handlePaginationClick(pagination.totalPages - 1)} className={pageClass(pagination.totalPages - 1)}>
            {pagination.totalPages}
          </li>
          <li onClick={() => handlePaginationClick(pagination.pageNumber + 1)} className="block px-3 py-2 leading-tight text-gray-500 bg-white border border-gray-300 rounded-r-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">
            <svg className="w-5 h-5" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"></path></svg>
          </li>
        </ul>
      </nav>
    </div >
  );
}
