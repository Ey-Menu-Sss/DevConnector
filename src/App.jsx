import { useState } from 'react'
import { Route, Routes } from 'react-router-dom'
import Home from './pages/home' 
import Profile from './pages/profile' 
import Register from './pages/register' 
import Login from './pages/login' 
import Dashboard from './pages/dashboard' 
import Posts from './pages/posts' 
import UserProfile from './pages/userProfile' 
import CreateProfile from './pages/createProfile' 
import EditProfile from './pages/editProfile' 
import AddExperience from './pages/addExperience' 
import AddEducation from './pages/addEducation' 
import NotFound from './pages/notFoundPage' 
import Post from './pages/post' 
import ChatBot from './pages/chatBot' 
function App() {

  return (
    <div className="App">
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/profiles' element={<Profile/>}/>
        <Route path='/register' element={<Register/>}/>
        <Route path='/login' element={<Login/>}/>
        <Route path='/dashboard' element={<Dashboard/>}/>
        <Route path='/posts' element={<Posts/>}/>
        <Route path='/profile/:id' element={<UserProfile/>}/>
        <Route path='/posts/:id' element={<Post/>}/>
        <Route path='/create-profile' element={<CreateProfile/>}/>
        <Route path='/edit-profile' element={<EditProfile/>}/>
        <Route path='/add-experience' element={<AddExperience/>}/>
        <Route path='/add-education' element={<AddEducation/>}/>
        <Route path='/chatbot' element={<ChatBot/>}/>
        <Route path='*' element={<NotFound/>}/>
      </Routes>
    </div>
  )
}

export default App
