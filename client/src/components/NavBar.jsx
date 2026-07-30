import React, { useState } from 'react'
import { CircleUserRound, Menu, X } from 'lucide-react'
import { Link } from "react-router";
const NAV_LINKS = ['Home', 'Projects', 'About', 'Teams']

const NavBar = () => {
  const [active, setActive] = useState('Home')
  const [mobileOpen, setMobileOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)

  return (
    <div className="fixed top-4 left-0 right-0 z-50 w-full px-4">
      <div className="max-w-4xl mx-auto h-16 bg-black/20  backdrop-blur-md border border-white/10 shadow-lg shadow-black/20 px-6 rounded-full flex items-center justify-between">

        {/* Left: logo */}
        <div className="flex items-center gap-3 shrink-0">
          <img src="/icon.png" className="h-9 w-9 rounded-lg object-cover" alt="Logo" />
        </div>

        {/* Center: links, desktop only */}
        <div className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map((item) => (
            <button
              key={item}
              onClick={() => setActive(item)}
              className={`relative px-4 py-2 text-sm font-medium rounded-full transition-colors duration-200 ${active === item ? 'text-white' : 'text-white/50 hover:text-white/90'
                }`}

            >
              {active === item && (
                <span className="absolute inset-0 bg-white/10 rounded-full" />
              )}
              <span className="relative">{item}</span>
            </button>
          ))}
        </div>

        {/* Right: profile + mobile toggle */}
        <div className="flex items-center gap-3">
          <div className="relative hidden md:block">
            <button
              onClick={() => setProfileOpen((o) => !o)}
              aria-label="Account menu"
            >
              <CircleUserRound
                className="text-white/80 hover:text-white transition-colors cursor-pointer"
                size={28}
              />
            </button>

            {profileOpen && (
              <div className="absolute right-0 mt-3 w-40 bg-black/90 backdrop-blur-md border border-white/10 rounded-xl shadow-lg py-1 text-sm">
                <a href="#" className="block px-4 py-2 text-white/70 hover:text-white hover:bg-white/5">
                  Profile
                </a>
                <a href="#" className="block px-4 py-2 text-white/70 hover:text-white hover:bg-white/5">
                  Settings
                </a>
                <div className="my-1 border-t border-white/10" />
                <a href="#" className="block px-4 py-2 text-orange-500 hover:bg-white/5">
                  Sign out
                </a>
              </div>
            )}
          </div>

          <button
            className="md:hidden text-white/80"
            onClick={() => setMobileOpen((o) => !o)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      {mobileOpen && (
        <div className="md:hidden max-w-4xl mx-auto mt-2 bg-black/90 backdrop-blur-md border border-white/10 rounded-2xl shadow-lg py-2 px-2">
          {NAV_LINKS.map((item) => (
            <button
              key={item}
              onClick={() => {
                setActive(item)
                setMobileOpen(false)
              }}
              className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-colors ${active === item ? 'text-white bg-white/10' : 'text-white/60 hover:text-white'
                }`}
            >
              {item}
            </button>
          ))}
          <div className="my-1 border-t border-white/10" />
          <button className="w-full flex items-center gap-2 px-4 py-3 text-sm text-white/60 hover:text-white">
            <CircleUserRound size={20} />
            Account
          </button>
        </div>
      )}
    </div>
  )
}

export default NavBar