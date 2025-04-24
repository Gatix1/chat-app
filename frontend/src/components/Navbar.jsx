import React from 'react'
import { useAuthStore } from '../store/useAuthStore';
import { Link } from 'react-router-dom';
import { MessageSquare, Settings, User, LogOut } from 'lucide-react';

const Navbar = () => {
    const { authUser, logout } = useAuthStore();



    return (
        <header className="bg-base-100 border-b border-base-300 fixed top-0 z-40 background-blur-lg bg-base-100/80 w-full">
            <div className="container mx-auto px-4 h-16">
                <div className="flex items-center justify-between h-full">
                    <div className="flex items-center gap-8">
                        <Link to="/" className="flex items-center gap-2.5 hover:opacity-80 transition-all">
                            <div className="size-9 rounded-lg bg-primary/10 flex items-center justify-center">
                                <MessageSquare className="w-5 h-5 text-primary"/>
                            </div>
                            <h1 className="text-lg font-bold">MERN-Chat</h1>
                        </Link>
                    </div>

                    <div className="flex items-center gap-2">
                        <Link to="/settings" className="btn btn-sm gap-2 transition-colors">
                            <Settings className="w-4 h-4"/>
                            <span className="hidden sm:inline">Settings</span>
                        </Link>
                        {authUser ? (
                            <>
                                <Link to="/profile" className="btn btn-sm gap-2 transition-colors">
                                    <User className="size-5"/>
                                    <span className="hidden sm:inline">{authUser.username}</span>
                                </Link>
                                <button onClick={logout} className="btn btn-sm gap-2 transition-colors">
                                    <LogOut className="size-5"/>
                                    <span className="hidden sm:inline">Logout</span>
                                </button>
                            </>
                        ) : null}
                    </div>
                </div>
            </div>
        </header>
    )
}

export default Navbar