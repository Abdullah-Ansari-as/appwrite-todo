import React, { useState, useEffect } from 'react'
import { DB_ID, COLLECTION_ID, databases, ID } from './appwrite/appwrite'
import { AiOutlineEdit, AiOutlineDelete, AiFillSave  } from 'react-icons/ai'; // Importing icons from react-icons



function App() {

  const [data, setData] = useState([])
  const [userInput, setUserInput] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  // states for update
  const [isEditing, setIsEditing] = useState(false)
  const [newText, setNewText] = useState('')
  const [editingId, setEditingId] = useState(null)



  // fetch all documents from an appwrite
  const getTodo = async () => {
    try {
      const res = await databases.listDocuments(DB_ID, COLLECTION_ID)
      // console.log(res)
      setData(res.documents.reverse())
      setIsLoading(false)
    } catch (error) {
      console.error(error)
      setIsLoading(false)
    }
  };

  useEffect(() => {
    getTodo()
  }, [])

  // create document
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {

      if (userInput) {
        // create new document into an appwrite
        await databases.createDocument(
          DB_ID,
          COLLECTION_ID,
          ID.unique(),
          { text: userInput }
        );

        setUserInput('')

        getTodo();

      };

    } catch (error) {
      console.log(error)
    }
  };



  // update document

  const handleTrue = async (id) => {
    try {
      await databases.listDocuments(
        DB_ID,
        COLLECTION_ID,
        []
      )
      // console.log(typeof res.documents)
      const updatedTodo = data.filter((doc) => doc.$id === id)
      updatedTodo && setIsEditing(true)
      // console.log(res.documents)
    } catch (error) {
      console.log(error)
    }
  }


  // const handleTrue = async (id) => {
  //   try {
  //     // Fetch document with matching ID
  //     const res = await databases.listDocuments(
  //       DB_ID,
  //       COLLECTION_ID,
  //       [Query.equal('$id', id)] // Query to match the document ID
  //     );

  //     // Check if any document is returned
  //     if (res.documents.length > 0) {
  //       setIsEditing(true); // If found, set editing to true
  //     } else {
  //       setIsEditing(false); // If not found, set editing to false
  //     }

  //   } catch (error) {
  //     console.log('Error:', error);
  //   }
  // };


  const handleUpdate = async (updId) => {
    try {
      await databases.updateDocument(
        DB_ID,
        COLLECTION_ID,
        updId,
        { text: newText }
      )
      setIsEditing(false)
      getTodo();
    } catch (error) {
      console.log(error)
    }
  }



  // delete document
  const handleDelete = async (delId) => {
    try {
      await databases.deleteDocument(
        DB_ID,
        COLLECTION_ID,
        delId
      )
      setData(data.filter((doc) => doc.$id !== delId))
    } catch (error) {
      console.log(error)
    }
  }


  // handle loading during re-rendring
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-dark">
        <h1 className="text-white text-2xl">Loading...</h1>
      </div>
    );
  }

  return (
    <>
      <div className="bg-light-blue-100 mb-4 p-4 flex flex-col items-center">
        <form
          className="bg-white p-6 rounded-lg shadow-md max-w-lg w-full"
          onSubmit={handleFormSubmit}
        >
          <div className="mb-4">
            <label htmlFor="todoText" className="block text-gray-700 font-semibold mb-2">
              Enter Todo:
            </label>
            <textarea
              id="todoText"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
              placeholder="Enter your todo here"
              rows="4"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white font-bold py-2 px-4 rounded-md hover:bg-blue-600 transition-colors"
          >
            Add
          </button>
        </form>
      </div>


      <div className="bg-light-blue-100 min-h-screen p-4">
        <h1 className="text-center text-white text-2xl font-bold mb-6">My Todos</h1>
        <ul className="max-w-lg mx-auto">
          {data.map((curData) => {
            // console.log(curData.$id);
            return <li
              key={curData.$id}
              className="flex justify-between items-center bg-white p-4 mb-2 rounded-lg shadow-md"
            >

              {
                isEditing && editingId === curData.$id ? (
                  <input
                    type="text"
                    value={newText}
                    placeholder='Edit todo'
                    onChange={(e) => setNewText(e.target.value)}
                    className="border p-2 rounded w-full"
                  />
                ) : (
                  <span className="text-lg">{curData.text}</span>
                )
              }


              <div className="flex space-x-3">


                {/* <button
                  className="text-blue-500 hover:text-blue-700"
                  onClick={() => handleUpdate(curData.$id)}
                >
                  <AiOutlineEdit size={20} />
                </button> */}

                {isEditing && editingId === curData.$id ? (
                  <button className="text-green-500 hover:text-green-700 px-2"
                    onClick={() => handleUpdate(curData.$id)}
                  >
                    <AiFillSave/>
                  </button>
                ) : (
                  <button className="text-blue-500 hover:text-blue-700"
                   onClick={() => {
                    setEditingId(curData.$id)
                    handleTrue(curData.$id)
                    }}
                    >
                    <AiOutlineEdit size={20} />
                  </button>
                )}


                <button
                  className="text-red-500 hover:text-red-700"
                  onClick={() => handleDelete(curData.$id)}
                >
                  <AiOutlineDelete size={20} />
                </button>
              </div>
            </li>
          })}
        </ul>
      </div>
    </>
  )
}

export default App