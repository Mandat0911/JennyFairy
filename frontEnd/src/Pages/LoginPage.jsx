import React, { useState } from 'react'
import {motion} from'framer-motion'
import { Lock, Mail, Loader } from 'lucide-react'
import Input from '../Components/Input'
import {Link, useNavigate} from 'react-router-dom'
import { useAuthStore } from '../store/authStore'

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const{login, error, isLoading} = useAuthStore()
  const navigate = useNavigate();
  const handleLogin = async (e) => {
    e.preventDefault();
		await login(email, password);
		navigate("/");
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 0 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className='max-w-md w-full bg-pink-400/30 backdrop-filter backdrop-blur-lx rounded-2xl shadow-xl overflow-hidden'
    >
      <div className='p-8'>
      <h2 className='text-3xl font-bold mb-6 text-center bg-gradient-to-r from-pink-600 to-rose-800 bg-clip-text text-transparent'>
        Welcome Back
        </h2>
        <form onSubmit={handleLogin}>
          <Input icon={Mail} type='text' placeholder='Email'
        value={email} onChange={(e) => setEmail(e.target.value)} required/>
          <Input icon={Lock} type='password' placeholder='Password'
          value={password} onChange={(e) => setPassword(e.target.value)} required/>

          <div className='flex items-center mb-6'>
            <Link to='/forgot-password' className='text-sm text-pink-400 hover:underline'>
            Forgot Password?
            </Link>
          </div>
          {error && <p className='text-red-500 font-semibold mb-2'>{error}</p>}

          <motion.button className='mt-5 w-full py-3 px-4 bg-gradient-to-r from-pink-300 to-rose-400 text-white font-bold rounded-lg
            shadow-lg hover:from-pink-500 hover:to-rose-700 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2
            focus:ring-offset-gray-500 transition duration-200'
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type='submit'
              disabled={isLoading}
            >
             {isLoading ? <Loader className='w-6 h-6 animate-spin mx-auto' size='1.5em' color='white' /> : 'Login'}
          </motion.button>
        </form>
      </div>
      <div className='px-8 py-4 bg-gray-900/50 flex justify-center'>
              <p className='text-gray-300 text-sm'>
                Don't have an account? {""}
                <Link to='/signUp' className='text-pink-500 hover:underline'>SignUp</Link>
              </p>
            </div>
    </motion.div>
  )
}

export default LoginPage