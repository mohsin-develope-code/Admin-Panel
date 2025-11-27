import React, { useEffect } from 'react'
import { Navigate, Route, Routes, useNavigate } from 'react-router-dom'
import Login from '../Component/Login'
import Dashboard from '../Component/Dashboard'




const Routers = () => {


   const navigate = useNavigate();
   
   const login = localStorage.getItem('login');
   const PrivateRoute = ({element}) => {
    return login? element : <Navigate to={'/login'}/>
  }


  useEffect(()=> {
    if(login){
      if(location.pathname === '/login'){
        return navigate('/dashboard') 
      }
    }
  },[])




  return (

    <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path='/login' element={<Login/>}/>
        <Route path='/dashboard' element={<PrivateRoute element={<Dashboard/>}/>}/>
    </Routes>

  )
}

export default Routers
