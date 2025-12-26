import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Home from './pagess/Home'
import Blog from './pagess/Blog'
import Layout from './pagess/admin/Layout'
import Dashboard from './pagess/admin/Dashboard'
import AddBlog from './pagess/admin/AddBlog'
import Comments from './pagess/admin/Comments'
import ListBlog from './pagess/admin/ListBlog'
import Login from './components/admin/Login'
import 'quill/dist/quill.snow.css'
import {Toaster} from 'react-hot-toast'
import { useAppContext } from './context/AppContext'

const App = () => {

  const {token}= useAppContext()
  return (
    <div>
      <Toaster/>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/blog/:id" element={<Blog />} />
        <Route path="/admin" element={token? <Layout/> :<Login/>}>
        <Route index element={<Dashboard />} />
        <Route path="addBlog" element={<AddBlog />} />
        <Route path="listBlog" element={<ListBlog />} />
        <Route path="comments" element={<Comments />} />
      </Route>
    </Routes>
  </div>
  );
};

export default App;
