import React, { useState, useRef, useEffect } from 'react'
import { assets, blogCategories } from '../../assets/assets'  // named import
import Quill from 'quill';
import { useAppContext } from '../../context/AppContext';
import toast from 'react-hot-toast';
import {parse} from 'marked'

const AddBlog = () => {

  const { axios } = useAppContext()
  const [isAdding, setIsAdding] = useState(false)
  const [loading, setLoading] = useState(false) 
  
  const editorRef = useRef(null)
  const quillRef = useRef(null)

  const [image, setImage] = useState(false)
  const [title, setTitle] = useState('')
  const [subTitle, setSubTitle] = useState('')
  const [category, setCategory] = useState('Startup')
  const [isPublished, setIsPublished] = useState(false)


  const generateContent = async () => {
    if(!title)return toast.error('Please enter a title')
      try {
        const {data}=await axios.post('/api/blog/generate',{prompt:title})
        if(data.success){
          quillRef.current.root.innerHTML=parse(data.content)
        }else{
          toast.error(data.message)
        }
      } catch (error) {
        toast.error(error.message)

      }finally{
        setLoading(false)
      }
  }
  
  const onSubmitHandler = async (e) => {
    try {
      e.preventDefault();
      setIsAdding(true)
      
      const blog = {
        title,
        subTitle,
        description: quillRef.current.root.innerHTML,
        category,
        isPublished
      }

      const formData = new FormData();
      formData.append('blog', JSON.stringify(blog))
      formData.append('image', image)

      const { data } = await axios.post(`/api/blog/add`, formData);

      if (data.success) {
        toast.success(data.message);
        setImage(false)
        setTitle('')
        setSubTitle('')  // FIX 1: Added this line
        quillRef.current.root.innerHTML = ''
        setCategory('Startup')
        setIsPublished(false)  // FIX 2: Added this line
      } else {
        toast.error(data.message)
      }

    } catch (error) {
      // FIX 3: Fixed error handling
      toast.error(error.response?.data?.message || 'Failed to add blog')

    } finally {
      setIsAdding(false)
    }
    // You can handle the form submission here
    console.log({ image, title, subTitle, category, isPublished })
  }
  
  useEffect(() => {
    if (!quillRef.current && editorRef.current) {
      quillRef.current = new Quill(editorRef.current, { theme: 'snow' })
    }

  }, [])

  return (
    <form
      onSubmit={onSubmitHandler}
      className="flex-1 bg-blue-50/50 text-gray-600 h-full overflow-scroll p-4"
    >
      <div className="bg-white w-full max-w-3xl p-4 md:p-10 sm:m-10 shadow rounded">
        {/* Image Upload */}
        <p>Upload Thumbnail</p>
        <label htmlFor="image">
          <img
            src={!image ? assets.upload_area : URL.createObjectURL(image)}
            alt="thumbnail"
            className="mt-2 h-16 rounded cursor-pointer"
          />
          <input
            type="file"
            id="image"
            hidden
            onChange={(e) => setImage(e.target.files[0])}
          />
        </label>

        {/* Blog Title */}
        <p className="mt-4">Blog Title</p>
        <input
          type="text"
          placeholder="Type here"
          required
          className="w-full max-w-lg mt-2 p-2 border border-gray-300 outline-none rounded"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        {/* Blog Sub Title */}
        <p className="mt-4">Sub Title</p>
        <input
          type="text"
          placeholder="Type here"
          required
          className="w-full max-w-lg mt-2 p-2 border border-gray-300 outline-none rounded"
          value={subTitle}
          onChange={(e) => setSubTitle(e.target.value)}
        />
        
        <p className="mt-4">Blog Description</p>
        <div className='max-w-lg h-74 pb-16 sm:pb-10 pt-2 relative'>
          <div ref={editorRef}></div>
          <button disabled={loading} type='button' onClick={generateContent} className='absolute bottom-1 right-2 ml-2 text-xs text-white bg-black/70 px-4
          py-1.5 rounded hover:underline cursor-pointer'>Generate with AI</button>
        </div>

        <p className='mt-4'>Blog category</p>
        <select onChange={e => setCategory(e.target.value)} name="category" className='mt-2 px-3 py-2 border text-gray-500
        border-gray-300 outline-none rounded'>
          <option value="">Select category</option>
          {blogCategories.map((item, index) => {
            return <option key={index} value={item}>{item}</option>
          })}
        </select>

        <div className='flex gap-2 mt-4'>
          <p>Publish Now</p>
          <input type="checkbox" checked={isPublished} className='scale-125 cursor-pointer' onChange={e =>
            setIsPublished(e.target.checked)} />
        </div>

        {/* Submit Button */}
        <button disabled={isAdding}
          type="submit"
          className="mt-6 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          {isAdding ? 'Adding...' : 'Add Blog'}
        </button>
      </div>
    </form>
  )
}

export default AddBlog