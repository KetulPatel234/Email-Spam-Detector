import React, { useEffect, useState } from "react";
import Modal from "react-modal";
import { User, Search, Filter, Calendar, Mail, X, Home, RotateCcw, CheckCircle, List, ArrowDownWideNarrow, ArrowUpWideNarrow } from "lucide-react";
import { useNavigate } from "react-router-dom";

Modal.setAppElement('#root');

function SpamManager() {

  // Dummy data for 50 rows.
  const initialMails = [
    { "mail_id": 31, "sender": "Tech Support", "subject": "URGENT: Your Mac Has a Virus", "date": "2024-07-21", "isUndone": false },
    { "mail_id": 32, "sender": "Fashion Outlet", "subject": "New Summer Collection is Here!", "date": "2024-07-20", "isUndone": true },
    { "mail_id": 33, "sender": "Phishing Scam", "subject": "Unauthorized Transaction on Your Credit Card", "date": "2024-07-19", "isUndone": false },
    { "mail_id": 34, "sender": "Travel Deals Inc.", "subject": "Last Minute Cruise Offers", "date": "2024-07-18", "isUndone": true },
    { "mail_id": 35, "sender": "Health & Fitness", "subject": "Get Your Free Workout Plan!", "date": "2024-07-17", "isUndone": false },
    { "mail_id": 36, "sender": "Financial Services", "subject": "Exclusive: Low Interest Rate Loan", "date": "2024-07-16", "isUndone": false },
    { "mail_id": 37, "sender": "Unsubscribe From Our List", "subject": "Important: Your Subscription Will Expire", "date": "2024-07-15", "isUndone": false },
    { "mail_id": 38, "sender": "Crypto Exchange", "subject": "Your Portfolio is Down, Invest Now", "date": "2024-07-14", "isUndone": true },
    { "mail_id": 39, "sender": "Spammy Promotions Inc.", "subject": "Amazing Gadgets at 90% Off", "date": "2024-07-13", "isUndone": false },
    { "mail_id": 40, "sender": "Job Offer", "subject": "High Paying Job! No Experience Needed", "date": "2024-07-12", "isUndone": false },
    { "mail_id": 41, "sender": "Phishing Scam", "subject": "Account Verification Required", "date": "2024-07-11", "isUndone": false },
    { "mail_id": 42, "sender": "Dating Service", "subject": "Find Your Match Today!", "date": "2024-07-10", "isUndone": false },
    { "mail_id": 43, "sender": "Lottery Winner", "subject": "You've Been Selected to Win a New Car!", "date": "2024-07-09", "isUndone": true },
    { "mail_id": 44, "sender": "Spammy Promotions Inc.", "subject": "Don't Miss Out on This!", "date": "2024-07-08", "isUndone": false },
    { "mail_id": 45, "sender": "Health Supplement", "subject": "Boost Your Energy with This Pill", "date": "2024-07-07", "isUndone": false },
    { "mail_id": 46, "sender": "Online Survey", "subject": "Win a $1000 Amazon Gift Card", "date": "2024-07-06", "isUndone": true },
    { "mail_id": 47, "sender": "Nigerian Prince", "subject": "Your Help Is Needed", "date": "2024-07-05", "isUndone": false },
    { "mail_id": 48, "sender": "Discount Store", "subject": "Huge Clearance Sale!", "date": "2024-07-04", "isUndone": false },
    { "mail_id": 49, "sender": "Crypto Exchange", "subject": "Get Free Crypto", "date": "2024-07-03", "isUndone": false },
    { "mail_id": 50, "sender": "Unsubscribe From Our List", "subject": "Your Email has been Registered to All", "date": "2024-07-02", "isUndone": false },
    { "mail_id": 51, "sender": "Financial Services", "subject": "Get a New Credit Card Today", "date": "2024-07-01", "isUndone": false },
    { "mail_id": 52, "sender": "Job Offer", "subject": "Work from Anywhere", "date": "2024-06-30", "isUndone": true },
    { "mail_id": 53, "sender": "Weight Loss Clinic", "subject": "Lose Weight with our Product", "date": "2024-06-29", "isUndone": false },
    { "mail_id": 54, "sender": "Spammy Promotions Inc.", "subject": "Unbelievable Deals Inside", "date": "2024-06-28", "isUndone": false },
    { "mail_id": 55, "sender": "Phishing Scam", "subject": "Your Password Has Been Changed", "date": "2024-06-27", "isUndone": false },
    { "mail_id": 56, "sender": "Online Casino", "subject": "New Games and Bonuses!", "date": "2024-06-26", "isUndone": true },
    { "mail_id": 57, "sender": "Dating Service", "subject": "Your Profile Has New Visitors", "date": "2024-06-25", "isUndone": false },
    { "mail_id": 58, "sender": "Health Supplement", "subject": "The Secret to Better Health", "date": "2024-06-24", "isUndone": false },
    { "mail_id": 59, "sender": "Lottery Winner", "subject": "Final Notice: Claim Your Prize", "date": "2024-06-23", "isUndone": false },
    { "mail_id": 60, "sender": "Discount Store", "subject": "Clearance on All Electronics", "date": "2024-06-22", "isUndone": true },
    { "mail_id": 61, "sender": "Online Survey", "subject": "Your Feedback is Needed for a Reward", "date": "2024-06-21", "isUndone": false },
    { "mail_id": 62, "sender": "Nigerian Prince", "subject": "Please Help Me Transfer Funds", "date": "2024-06-20", "isUndone": false },
    { "mail_id": 63, "sender": "Tech Support", "subject": "Your Computer's Security is Low", "date": "2024-06-19", "isUndone": false },
    { "mail_id": 64, "sender": "Fashion Outlet", "subject": "Sale on All Tops", "date": "2024-06-18", "isUndone": true },
    { "mail_id": 65, "sender": "Phishing Scam", "subject": "Your Account Has Been Compromised", "date": "2024-06-17", "isUndone": false },
    { "mail_id": 66, "sender": "Travel Deals Inc.", "subject": "Explore The World!", "date": "2024-06-16", "isUndone": false },
    { "mail_id": 67, "sender": "Health & Fitness", "subject": "Join Our Exclusive Gym", "date": "2024-06-15", "isUndone": false },
    { "mail_id": 68, "sender": "Financial Services", "subject": "Get a Free Financial Consultation", "date": "2024-06-14", "isUndone": true },
    { "mail_id": 69, "sender": "Unsubscribe From Our List", "subject": "Urgent: Unsubscribe Now", "date": "2024-06-13", "isUndone": false },
    { "mail_id": 70, "sender": "Crypto Exchange", "subject": "Trade Crypto for Profit", "date": "2024-06-12", "isUndone": false },
    { "mail_id": 71, "sender": "Spammy Promotions Inc.", "subject": "Limited Offer on All Products", "date": "2024-06-11", "isUndone": false },
    { "mail_id": 72, "sender": "Job Offer", "subject": "Hiring Now", "date": "2024-06-10", "isUndone": true },
    { "mail_id": 73, "sender": "Phishing Scam", "subject": "Your Account is Under Review", "date": "2024-06-09", "isUndone": false },
    { "mail_id": 74, "sender": "Dating Service", "subject": "Someone wants to Chat!", "date": "2024-06-08", "isUndone": false },
    { "mail_id": 75, "sender": "Lottery Winner", "subject": "You're a Lottery Winner!", "date": "2024-06-07", "isUndone": false },
    { "mail_id": 76, "sender": "Spammy Promotions Inc.", "subject": "Flash Sale!", "date": "2024-06-06", "isUndone": true },
    { "mail_id": 77, "sender": "Health Supplement", "subject": "Look Younger", "date": "2024-06-05", "isUndone": false },
    { "mail_id": 78, "sender": "Online Survey", "subject": "Quick Survey for a Gift Card", "date": "2024-06-04", "isUndone": false },
    { "mail_id": 79, "sender": "Nigerian Prince", "subject": "A New Opportunity Awaits", "date": "2024-06-03", "isUndone": false },
    { "mail_id": 80, "sender": "Discount Store", "subject": "New Daily Deals", "date": "2024-06-02", "isUndone": true }
  ];

  const [allMails, setAllMails] = useState(initialMails);
  const [displayedMails, setDisplayedMails] = useState([]);
  const [sender, setSender] = useState("");
  const [subject, setSubject] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(new Date());
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filterTrigger, setFilterTrigger] = useState(0);

  const [sortColumn, setSortColumn] = useState(null);
  const [sortDirection, setSortDirection] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalFilteredMails, setTotalFilteredMails] = useState(initialMails.length);
  const itemsPerPage = 8;
  const totalPages = Math.ceil(totalFilteredMails / itemsPerPage);

  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Spam Manager";
  }, []);

  useEffect(() => {
    setLoading(true);
    const timeoutId = setTimeout(() => {
      let filteredMails = allMails.filter(mail =>
        (!sender || (mail.sender && mail.sender.toLowerCase().includes(sender.toLowerCase()))) &&
        (!subject || (mail.subject && mail.subject.toLowerCase().includes(subject.toLowerCase())))
      );

      // Status filtering logic
      if (statusFilter === "spam") {
        filteredMails = filteredMails.filter(mail => !mail.isUndone);
      } else if (statusFilter === "undone") {
        filteredMails = filteredMails.filter(mail => mail.isUndone);
      }

      // Date filtering logic
      if (startDate && endDate) {
        filteredMails = filteredMails.filter(mail => {
          const mailDate = new Date(mail.date);
          const start = new Date(startDate);
          const end = new Date(endDate);
          return mailDate >= start && mailDate <= end;
        });
      }

      // Sorting logic
      if (sortColumn) {
        filteredMails.sort((a, b) => {
          const aValue = a[sortColumn];
          const bValue = b[sortColumn];

          if (aValue < bValue) {
            return sortDirection === 'asc' ? -1 : 1;
          }
          if (aValue > bValue) {
            return sortDirection === 'asc' ? 1 : -1;
          }
          return 0;
        });
      }

      setTotalFilteredMails(filteredMails.length);
      const start = (currentPage - 1) * itemsPerPage;
      const end = start + itemsPerPage;
      setDisplayedMails(filteredMails.slice(start, end));
      setLoading(false);
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [allMails, sender, subject, statusFilter, filterTrigger, currentPage, sortColumn, sortDirection]);

  /**
   * Handles the "undo" action for a specific mail.
   */
  const handleUndo = async (mail_id) => {
    setLoading(true);
    try {
      console.log(`Simulating undo for mail_id: ${mail_id}`);
      await new Promise(resolve => setTimeout(resolve, 500));

      const newAllMails = allMails.map(mail =>
        mail.mail_id === mail_id ? { ...mail, isUndone: true } : mail
      );
      setAllMails(newAllMails);
      setFilterTrigger(prev => prev + 1);
    } catch (err) {
      console.error("Error undoing spam:", err);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handles sorting by column.
   */
  const handleSort = (column) => {
    if (sortColumn === column) {
      if (sortDirection === 'asc') {
        setSortDirection('desc');
      } else if (sortDirection === 'desc') {
        setSortDirection(null);
        setSortColumn(null);
      } else {
        setSortDirection('asc');
      }
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  let pageNumbers = [];
  if (totalPages <= 4) {
    pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);
  } else {
    const pagesToShow = 4;
    let startPage = Math.max(1, currentPage - Math.floor(pagesToShow / 2));
    let endPage = startPage + pagesToShow - 1;

    if (endPage > totalPages) {
      endPage = totalPages;
      startPage = Math.max(1, endPage - pagesToShow + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }
  }

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const handleApplyDateFilter = () => {
    setFilterTrigger(prev => prev + 1);
    closeModal();
  };

  const customModalStyles = {
    content: {
      backgroundColor: '#1f2937',
      border: '1px solid #374151',
      borderRadius: '1rem',
      padding: '2rem',
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      transform: 'translate(-50%, -50%)',
      width: 'fit-content',
      maxWidth: '90%',
      maxHeight: '90%',
      overflow: 'auto',
      color: '#d1d5db'
    },
    overlay: {
      backgroundColor: 'rgba(17, 24, 39, 0.75)',
    }
  };

  const isDateFilterActive = startDate && endDate;
  const dateButtonClass = `
    w-full md:w-auto font-medium px-6 py-3 rounded-lg transition-colors shadow-sm
    ${isDateFilterActive
      ? "bg-blue-600 hover:bg-blue-700 text-white"
      : "bg-gray-700 hover:bg-gray-600 text-gray-300"}
  `;

  const applyButtonDisabled = !startDate && !endDate;

  const getSortIcon = (column) => {
    if (sortColumn === column) {
      return sortDirection === 'asc' ? <ArrowUpWideNarrow className="inline-block h-4 w-4 ml-1" /> : <ArrowDownWideNarrow className="inline-block h-4 w-4 ml-1" />;
    }
    return <List className="inline-block h-4 w-4 ml-1" />;
  };

  return (
    <div className="bg-gradient-to-br from-gray-900 via-gray-950 to-gray-900 animate-fade-in bg-gray-950 min-h-screen p-8 text-gray-200 antialiased font-sans">
      <div className="container mx-auto grid grid-cols-1 lg:grid-cols-10 gap-8">
        <div className="lg:col-span-8 bg-gray-800 p-8 rounded-2xl shadow-xl border border-gray-700 transition-transform transform hover:scale-[1.005] duration-300">

          <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-700">
            <h2 className="font-extrabold text-3xl text-gray-100">Spam Mails Management</h2>
            <span className="inline-block relative bg-blue-700 text-blue-100 font-medium px-4 py-2 rounded-full text-sm shadow-md">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75 top-0 left-0"></span>
              Live
            </span>
          </div>

          <form className="mb-8">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
                  <User size={20} />
                </span>
                <input
                  className="w-full pl-12 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                  placeholder="Filter by Sender"
                  value={sender}
                  onChange={e => setSender(e.target.value)}
                />
              </div>
              <div className="relative flex-1">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
                  <Search size={20} />
                </span>
                <input
                  className="w-full pl-12 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                  placeholder="Filter by Subject"
                  value={subject}
                  onChange={e => setSubject(e.target.value)}
                />
              </div>
              <div className="relative w-full md:w-auto">
                <select
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                  value={statusFilter}
                  onChange={e => setStatusFilter(e.target.value)}
                >
                  <option value="all">All Mails</option>
                  <option value="spam">Spam Mails</option>
                  <option value="undone">Undone Mails</option>
                </select>
              </div>
              <div className="w-full md:w-auto">
                <button
                  type="button"
                  className={dateButtonClass}
                  onClick={openModal}
                >
                  <Calendar className="inline-block h-5 w-5 mr-2" />
                  Filter by Date
                </button>
              </div>
              <div className="w-full md:w-auto">
                <button
                  type="button"
                  className="w-full md:w-auto bg-gray-700 hover:bg-gray-600 text-gray-300 font-medium px-6 py-3 rounded-lg transition-colors shadow-sm"
                  onClick={() => { setSender(""); setSubject(""); setStatusFilter("all"); setStartDate(null); setEndDate(new Date()); setFilterTrigger(prev => prev + 1); }}
                >
                  <Filter className="inline-block h-5 w-5 mr-2" />
                  Clear Filters
                </button>
              </div>
            </div>
          </form>

          <Modal
            isOpen={isModalOpen}
            onRequestClose={closeModal}
            contentLabel="Date Filter"
            style={customModalStyles}
          >
            <h3 className="text-xl font-bold mb-4 text-gray-200">Select a Date Range</h3>
            <div className="flex flex-col items-center">
              <input
                type="date"
                className="w-full px-4 py-2 mb-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-200"
                value={startDate ? startDate.toISOString().split('T')[0] : ''}
                onChange={e => setStartDate(new Date(e.target.value))}
              />
              <input
                type="date"
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-200"
                value={endDate ? endDate.toISOString().split('T')[0] : ''}
                onChange={e => setEndDate(new Date(e.target.value))}
              />
            </div>
            <div className="flex justify-end mt-4">
              <button
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-lg transition-colors"
                onClick={handleApplyDateFilter}
                disabled={applyButtonDisabled}
              >
                Apply
              </button>
            </div>
          </Modal>

          <div className="overflow-x-auto rounded-xl shadow-md border border-gray-700">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-700">
                <tr className="border-b border-gray-600 text-gray-400 font-medium">
                  <th
                    className="py-4 px-6 text-left cursor-pointer"
                    onClick={() => handleSort('mail_id')}
                  >
                    Mail ID {getSortIcon('mail_id')}
                  </th>
                  <th
                    className="py-4 px-6 text-left cursor-pointer"
                    onClick={() => handleSort('sender')}
                  >
                    Sender {getSortIcon('sender')}
                  </th>
                  <th
                    className="py-4 px-6 text-left cursor-pointer"
                    onClick={() => handleSort('subject')}
                  >
                    Subject {getSortIcon('subject')}
                  </th>
                  <th
                    className="py-4 px-6 text-left cursor-pointer"
                    onClick={() => handleSort('date')}
                  >
                    Date {getSortIcon('date')}
                  </th>
                  <th className="py-4 px-6 text-left">Status</th>
                  <th className="py-4 px-6 text-left">Action</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={6} className="text-center py-10">
                      <div className="flex justify-center items-center gap-2 text-gray-400">
                        <svg className="animate-spin h-6 w-6 text-blue-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
                        </svg>
                        Loading...
                      </div>
                    </td>
                  </tr>
                ) : displayedMails.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center text-gray-500 py-10">
                      <Mail className="mx-auto h-8 w-8 mb-2" />
                      No spam mails found.
                    </td>
                  </tr>
                ) : (
                  displayedMails
                    .map(mail => (
                      <tr key={mail.mail_id} className="border-b border-gray-700 last:border-b-0 hover:bg-gray-700 transition-colors">
                        <td className="py-3 px-6 text-gray-400">{mail.mail_id}</td>
                        <td className="py-3 px-6 font-semibold text-gray-300">{mail.sender}</td>
                        <td className="py-3 px-6 text-gray-400">{mail.subject}</td>
                        <td className="py-3 px-6 text-gray-500">{mail.date}</td>
                        <td className="py-3 px-6">
                          {mail.isUndone ? (
                            <span className="inline-block bg-gray-700 text-purple-300 px-3 py-1 rounded-full text-xs font-semibold">Undone</span>
                          ) : (
                            <span className="inline-block bg-gray-700 text-red-300 px-3 py-1 rounded-full text-xs font-semibold">Spam</span>
                          )}
                        </td>
                        <td className="py-3 px-6">
                          {!mail.isUndone && (
                            <button
                              className="bg-blue-900 hover:bg-blue-800 text-blue-300 font-medium px-4 py-2 rounded-full text-xs flex items-center gap-1 transition-colors cursor-pointer"
                              onClick={() => handleUndo(mail.mail_id)}
                              title="Move back to Inbox"
                            >
                              <RotateCcw size={14} />
                              Undo
                            </button>
                          )}
                        </td>
                      </tr>
                    ))
                )}
              </tbody>
            </table>
          </div>

          <div className="flex justify-between items-center mt-6 text-sm">
            <span className="text-gray-400">
              Page {currentPage} of {totalPages}
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${currentPage === 1
                  ? "bg-gray-700 text-gray-500 cursor-not-allowed"
                  : "bg-gray-700 hover:bg-gray-600 text-gray-300"
                  }`}
              >
                Previous
              </button>
              {pageNumbers.map(page => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${currentPage === page
                    ? "bg-blue-600 text-white shadow-lg"
                    : "bg-gray-700 hover:bg-gray-600 text-gray-300"
                    }`}
                >
                  {page}
                </button>
              ))}
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${currentPage === totalPages
                  ? "bg-gray-700 text-gray-500 cursor-not-allowed"
                  : "bg-gray-700 hover:bg-gray-600 text-gray-300"
                  }`}
              >
                Next
              </button>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="flex flex-col gap-8">
            <button
              type="button"
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-6 rounded-2xl shadow-lg border border-blue-500 transition-all transform hover:scale-105 duration-300 flex items-center justify-center gap-2 cursor-pointer"
              onClick={() => navigate("/")}
            >
              <Home size={24} />
              Home
            </button>

            <div className="bg-gray-800 p-6 rounded-2xl shadow-xl border border-gray-700 h-40 transition-transform transform hover:translate-y-[-5px] duration-300">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-semibold text-gray-400">TOTAL DETECTED SPAM</span>
                <Mail className="h-6 w-6 text-blue-500" />
              </div>
              <p className="text-4xl font-extrabold text-blue-300">{initialMails.length}</p>
            </div>

            <div className="bg-gray-800 p-6 rounded-2xl shadow-xl border border-gray-700 h-40 transition-transform transform hover:translate-y-[-5px] duration-300">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-semibold text-gray-400">REMAINING SPAM MAILS</span>
                <X className="h-6 w-6 text-red-400" />
              </div>
              <p className="text-4xl font-extrabold text-red-400">{allMails.filter(mail => !mail.isUndone).length}</p>
            </div>

            <div className="bg-gray-800 p-6 rounded-2xl shadow-xl border border-gray-700 h-40 transition-transform transform hover:translate-y-[-5px] duration-300">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-semibold text-gray-400">UNDONE</span>
                <CheckCircle className="h-6 w-6 text-purple-400" />
              </div>
              <p className="text-4xl font-extrabold text-purple-400">{allMails.filter(mail => mail.isUndone).length}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SpamManager;