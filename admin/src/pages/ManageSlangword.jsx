import React, { useState, useEffect } from "react";
import axios from "axios";

export default function manageSlangWords() {
  const [slangwords, setSlangwords] = useState([]);

  useEffect(() => {
    fetchAllSlangwords();
  }, []);

  const fetchAllSlangwords = async () => {
    try {
      const response = await axios.get("/slangword/getSlangwordList");
      setSlangwords(response.data.list);
    } catch (error) {
      console.error("Error fetching slangwords:", error);
    }
  };

  //   const fetchSearchedBlogs = async (query) => {
  //     try {
  //       const response = await axios.get(`/search/searchBlogs?query=${query}`);
  //       setBlogs(response.data);
  //     } catch (error) {
  //       console.error("Error searching blogs:", error);
  //     }
  //   };

  //   const handleSearchChange = (e) => {
  //     setSearchQuery(e.target.value);
  //     if (e.target.value.trim() === "") {
  //       fetchAllBlogs();
  //     } else {
  //       fetchSearchedBlogs(e.target.value);
  //     }
  //   };

  //   // Date filter
  //   const dateFilteredBlogs = selectedDate
  //     ? blogs.filter((blog) => {
  //         const blogDate = new Date(blog.createdAt).toISOString().split("T")[0];
  //         return blogDate === selectedDate;
  //       })
  //     : blogs;

  //   // Sorting by date
  //   const sortedBlogs = [...dateFilteredBlogs].sort((a, b) => {
  //     const dateA = new Date(a.createdAt);
  //     const dateB = new Date(b.createdAt);
  //     return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
  //   });

  return (
    <div className="h-full px-6 py-7 bg-primaryWhite overflow-x-hidden">
      {/* Header */}
      <div className="mb-7 flex justify-between items-center">
        <div>
          <h1 className="font-bold text-4xl text-primaryBlack">Slangwords</h1>
          <h3 className="font-normal text-base text-darkGray">Welcome Admin</h3>
        </div>

        {/* Search Bar */}
        {/* <input
          type="text"
          placeholder="Search by title or subtitle..."
          value={searchQuery}
          onChange={handleSearchChange}
          className="border border-gray-300 px-4 py-2 rounded-lg"
        /> */}
      </div>

      {/* Filters & Sorting */}
      {/* <div className="flex justify-between items-center mb-4">
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="border border-gray-300 px-4 py-2 rounded-lg"
        /> */}

      {/* Sort Button */}
      {/* <button
          onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
          className="bg-primaryBlack text-primaryWhite px-6 py-2 rounded-xl"
        >
          Sort by Date ({sortOrder === "asc" ? "⬆️" : "⬇️"})
        </button>
      </div> */}

      {/* Table */}
      <div className="overflow-x-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-secondaryWhite">
              <th className="text-base font-normal text-secondaryBlack">
                Word
              </th>
              {/* <th className="text-base font-normal text-secondaryBlack">
                Author
              </th>
              <th className="text-base font-normal text-secondaryBlack">
                Created at
              </th> */}
              <th className="text-base font-normal text-secondaryBlack">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {slangwords.map((slang) => (
              <tr key={slang._id}>
                <td className="text-lg font-medium w-[496px] px-4 py-2 text-secondaryBlack">
                  {slang.word}
                </td>

                <td className="flex justify-center items-center px-4 py-2">
                  <button className="bg-primaryBlack text-primaryWhite px-6 py-2 rounded-xl">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
