"use client"

import React from 'react'
import Link from 'next/link'
import Image from "next/image";
import {usePathname} from "next/navigation";

const navItems = [
    { label: 'Library', href: '/' },
    { label: 'Add New', href: '/books/new' },
]

const Navbar = () => {
    const pathName = usePathname()
    return (
        <header className="w-full fixed z-50 bg-('--bg-primary')">
            <div className="wrapper navbar-height py-4 flex justify-between items-center">
                <Link href="/" className="flex gap-0.5 items-center">
                    <Image
                        src="/assets/logo.png"
                        alt="Bookfield"
                        width={42}
                        height={46}
                    />
                    <span className="logo-text">Bookfield</span>
                </Link>

                <nav className="w-fit flex gap-7.5 items-center">
                    {
                        navItems.map(({ label, href }) => {
                            const isActive = pathName === href
                        })
                    }
                </nav>
            </div>
        </header>
    )
}
export default Navbar
