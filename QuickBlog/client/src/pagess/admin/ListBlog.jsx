import React, { useEffect, useState } from 'react'
import BlogTableItem from '../../components/admin/BlogTableItem'
import { useAppContext } from '../../context/AppContext'
import toast from 'react-hot-toast'
import { blog_data } from '../../assets/assets'

const ListBlog = () => {

  const [blogs, setBlogs] = useState([])
  const { axios } = useAppContext()

  const fetchBlogs = async () => {
    try {
      const{data}=await axios.get('/api/admin/blogs')
        if(data.success){
          
          setBlogs(data.blogs)
        }else{
          toast.error(data.message)
        }
    } catch (error) {
      toast.error(error.message)
    }
  }

  useEffect(() => {
    fetchBlogs()
  }, [])

  return (
    <div className='flex-1 pt-5 px-5 sm:pt-12 sm:pl-16 bg-blue-50/50'>
      <h1 className='text-xl font-semibold'>All Blogs</h1>

      <div className='relative h-4/5 mt-4 max-w-4xl overflow-x-auto shadow rounded-lg bg-white'>
        <table className='w-full text-sm text-gray-500'>
          <thead className='text-xs text-gray-600 text-left uppercase bg-gray-100'>
            <tr>
              <th className='px-2 py-4 xl:px-6'>#</th>
              <th className='px-2 py-4'>Blog Title</th>
              <th className='px-2 py-4 max-sm:hidden'>Date</th>
              <th className='px-2 py-4 max-sm:hidden'>Status</th>
              <th className='px-2 py-4'>Action</th>
            </tr>
          </thead>

          <tbody>
            {blogs.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center py-6 text-gray-400">
                  No blogs found
                </td>
              </tr>
            ) : (
              blogs.map((blog, index) => (
                <BlogTableItem
                  key={blog._id}
                  blog={blog}
                  index={index + 1}
                  fetchBlogs={fetchBlogs}
                />
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default ListBlog
