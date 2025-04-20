import React, { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";

export default function ManageSlangWords() {
  const [slangwords, setSlangwords] = useState([]);
  const [filteredSlangwords, setFilteredSlangwords] = useState([]);
  const [totalSlangwords, setTotalSlangwords] = useState(0);
  const [newSlangword, setNewSlangword] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");

  useEffect(() => {
    fetchAllSlangwords();
    fetchTotalSlangwords();
  }, []);

  const fetchAllSlangwords = async () => {
    try {
      const response = await axios.get("/slangword/getSlangwordList");
      setSlangwords(response.data.list);
      setFilteredSlangwords(response.data.list);
    } catch (error) {
      console.error("Error fetching slangwords:", error);
    }
  };

  const fetchTotalSlangwords = async () => {
    try {
      const response = await axios.get("/slangword/getTotalWords");
      setTotalSlangwords(response.data.totalWords);
    } catch (error) {
      console.error("Error fetching total slangwords:", error);
    }
  };

  const addSlangword = async (e) => {
    e.preventDefault();
    if (!newSlangword.trim()) return toast.error("Enter a valid slang word.");

    try {
      await axios.post("/slangword/addSlangword", { word: newSlangword });
      setNewSlangword("");
      fetchAllSlangwords();
      fetchTotalSlangwords();
      toast.success("Slangword added successfully!");
    } catch (error) {
      console.error("Error adding slangword:", error);
      toast.error(error.response?.data?.error || "Something went wrong");
    }
  };

  const deleteSlangword = async (slangword) => {
    try {
      await axios.delete("/slangword/deleteSlangword", {
        data: { word: slangword },
      });
      fetchAllSlangwords();
      fetchTotalSlangwords();
      toast.success("Slangword deleted successfully!");
    } catch (error) {
      console.error("Error deleting slangword:", error);
      toast.error(error.response?.data?.error || "Something went wrong");
    }
  };

  const fetchSearchedSlangword = async (query) => {
    try {
      const response = await axios.get(
        `/slangword/searchSlangword?query=${query}`
      );
      setFilteredSlangwords(response.data);
    } catch (error) {
      console.error("Error searching slangwords:", error);
    }
  };

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (!query.trim()) {
      setFilteredSlangwords(slangwords);
    } else {
      fetchSearchedSlangword(query);
    }
  };

  // Sort filtered list alphabetically
  const sortedSlangwords = [...filteredSlangwords].sort((a, b) => {
    const wordA = a.toLowerCase();
    const wordB = b.toLowerCase();
    return sortOrder === "asc"
      ? wordA.localeCompare(wordB)
      : wordB.localeCompare(wordA);
  });

  return (
    <div className="h-full px-6 py-7 bg-primaryWhite overflow-x-hidden">
      {/* Header */}
      <div className="mb-7 justify-between items-center">
        <h1 className="font-bold text-4xl text-primaryBlack">Slangwords</h1>
        <h3 className="font-normal text-base text-darkGray">Welcome Admin</h3>
      </div>

      {/* Total Count & Add Slangword */}
      <div className="flex flex-wrap gap-6 mb-7 items-center justify-center">
        <div className="flex flex-col w-full lg:w-[470px] h-[200px] rounded-xl shadow-lg bg-primaryBlack p-4 items-center justify-center">
          <h5 className="text-base text-darkGray">Total Slangwords</h5>
          <h1 className="font-bold text-6xl md:text-8xl text-primaryWhite">
            {totalSlangwords}
          </h1>
        </div>
        <div className="flex flex-col w-full lg:w-[470px] h-[200px] rounded-xl shadow-lg bg-secondaryWhite p-4 items-center justify-center space-y-4">
          <input
            className="w-3/4 bg-lightGray rounded-lg p-4 text-sm text-primaryBlack focus:outline-none focus:ring-2 focus:ring-primaryBlack"
            placeholder="Enter Slangword"
            value={newSlangword}
            onChange={(e) => setNewSlangword(e.target.value)}
          />
          <button
            className="bg-primaryBlack text-primaryWhite px-6 py-2 rounded-xl"
            onClick={addSlangword}
          >
            Add
          </button>
        </div>
      </div>

      {/* Filters & Sorting */}
      <div className="flex space-x-7 justify-end items-center mb-4">
        {/* Sort Button */}
        <button
          onClick={() => setSortOrder(sortOrder === "desc" ? "asc" : "desc")}
          className="bg-primaryBlack text-primaryWhite px-6 py-2 rounded-xl"
        >
          ({sortOrder === "desc" ? "Descending" : "Ascending"})
        </button>

        {/* Search Bar */}
        <input
          type="text"
          placeholder="Search slangword..."
          value={searchQuery}
          onChange={handleSearchChange}
          className="border border-gray-300 px-4 py-2 rounded-lg"
        />
      </div>

      {/* Table */}
      <div className="overflow-x-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-secondaryWhite">
              <th className="text-base font-normal text-secondaryBlack">
                Word
              </th>
              <th className="text-base font-normal text-secondaryBlack">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedSlangwords.map((slang, index) => (
              <tr key={index}>
                <td className="text-lg font-medium w-[496px] px-4 py-2 text-secondaryBlack">
                  {slang}
                </td>
                <td className="flex justify-center items-center px-4 py-2">
                  <button
                    className="bg-primaryBlack text-primaryWhite px-6 py-2 rounded-xl"
                    onClick={() => deleteSlangword(slang)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {sortedSlangwords.length === 0 && (
              <tr>
                <td colSpan="2" className="text-center py-4 text-darkGray">
                  No slangwords found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
