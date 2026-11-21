
import React from 'react'
import { GraduationCap } from "lucide-react"
import { Link } from 'react-router-dom'

const Navbar = () => {
    return (
        <nav className='flex items-center justify-between px-8 py-6 bg-white shadow-sm'>

            {/* Logo */}
            <div className='flex items-center gap-2'>
                <GraduationCap
                    size={48}
                    className="text-blue-700"
                />

                <h1 className='text-3xl font-bold text-slate-900'>
                    Edu
                    <span className='text-blue-600'>Track</span>
                </h1>
            </div>

            {/* Navigation */}
            <ul className='flex items-center gap-10 text-lg font-medium text-slate-800'>

                <li>
                    <Link to="/home" className='hover:text-blue-600 transition'>
                        Home
                    </Link>
                </li>

                <li>
                    <Link to="/about" className='hover:text-blue-600 transition'>
                        About
                    </Link>
                </li>
                <li>
                    <Link to="/features" className='hover:text-blue-600 transition'>
                        Features
                    </Link>
                </li>

                <li>
                    <Link to="/contact" className='hover:text-blue-600 transition'>
                        Contact
                    </Link>
                </li>

            </ul>
        </nav>
    )
}

export default Navbar
