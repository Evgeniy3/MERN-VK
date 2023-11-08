import React from 'react'
import Navbar from './Navbar.jsx'
import style from './Navbar.module.scss'

export const Layout = ({ children }) => {
    return (
        <React.Fragment>
            <div>
                <Navbar />
                {children}
            </div>
        </React.Fragment>
    )
}