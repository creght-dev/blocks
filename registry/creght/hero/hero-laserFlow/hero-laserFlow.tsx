import React, { useState } from 'react'
import {
  Sparkles,
  LayoutDashboard,
  Search,
  Sun,
  Bell,
  Grid,
  ChevronRight,
  User,
  Wand2,
  Bug,
  Clock,
  TrendingUp,
  Inbox,
  Settings,
  Menu,
  X,
} from 'lucide-react'
import { motion } from 'framer-motion'
import LaserFlow from './LaserFlow'
const NavItem = ({ children, active }: { children: React.ReactNode; active?: boolean }) => (
  <a
    href="#"
    className={`px-4 py-2 text-sm font-medium transition-colors ${active ? 'text-white' : 'text-gray-400 hover:text-white'}`}
  >
    {children}
  </a>
)
export default function LumaLandingPage() {
  const navItems = ['Home', 'Features', 'Pricing', 'Resources', 'About']
  const [menuOpen, setMenuOpen] = useState(false)
  const MenuIcon = menuOpen ? X : Menu

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-blue-500/30 overflow-x-hidden">
      {/* Background Glow Effect */}
      <div className="fixed top-0 right-0 w-[800px] h-[1000px] bg-blue-600/20 blur-[120px] rounded-full -mr-40 -mt-40 pointer-events-none z-0" />
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-600/10 blur-[100px] rounded-full pointer-events-none z-0" />

      {/* Header */}
      <header className="relative z-[100] mx-auto grid max-w-7xl grid-cols-[minmax(0,1fr)_auto] items-center gap-3 px-4 py-5 sm:px-8 sm:py-6 md:grid-cols-[auto_minmax(0,1fr)_auto]">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-black" fill="currentColor" />
          </div>
          <span className="text-xl font-bold tracking-tight">Luma</span>
        </div>

        <nav className="hidden md:flex items-center gap-2">
          {navItems.map((item, index) => (
            <NavItem key={item} active={index === 0}>{item}</NavItem>
          ))}
        </nav>

        <a
          href="#"
          className="hidden items-center gap-2.5 bg-gradient-to-tr from-[#4E50FA] via-[#8b7df7] to-[#7679FE] bg-[length:280%_auto] bg-[position:0%_center] hover:bg-[position:100%_center] text-white px-6 py-2.5 rounded-xl font-medium transition-all duration-500 shadow-[0_0_30px_rgba(124,110,246,0.35)] hover:shadow-[0_0_40px_rgba(124,110,246,0.5)] group sm:inline-flex"
          style={{
            boxShadow:
              '0 0 20px #ffffff00, 0 5px 5px -1px #ffffff40, inset 4px 4px 8px #ffffff80, inset -4px -4px 8px #ffffff59',
          }}
        >
          Sign Up
        </a>

        <button
          type="button"
          onClick={() => setMenuOpen((open) => !open)}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
          aria-controls="laser-flow-mobile-menu"
          className="inline-grid size-11 place-items-center rounded-xl border border-white/10 bg-white/8 text-white backdrop-blur transition hover:bg-white/14 md:hidden"
        >
          <MenuIcon className="size-5" aria-hidden="true" />
        </button>

        <div
          id="laser-flow-mobile-menu"
          className={`absolute left-4 right-4 top-[calc(100%+8px)] z-[110] overflow-hidden rounded-2xl border border-white/10 bg-black/88 p-2 shadow-[0_24px_80px_rgba(0,0,0,0.46)] backdrop-blur-xl transition duration-200 md:hidden ${
            menuOpen ? 'translate-y-0 opacity-100' : 'pointer-events-none -translate-y-2 opacity-0'
          }`}
        >
          <nav className="grid text-sm font-medium text-gray-300">
            {navItems.map((item, index) => (
              <a
                key={`${item}-mobile`}
                href="#"
                onClick={() => setMenuOpen(false)}
                className={`rounded-xl px-4 py-3 transition hover:bg-white/8 hover:text-white ${
                  index === 0 ? 'text-white' : ''
                }`}
              >
                {item}
              </a>
            ))}
          </nav>
          <a
            href="#"
            onClick={() => setMenuOpen(false)}
            className="mt-2 flex min-h-11 items-center justify-center rounded-xl bg-gradient-to-tr from-[#4E50FA] via-[#8b7df7] to-[#7679FE] px-5 text-sm font-semibold text-white transition sm:hidden"
          >
            Sign Up
          </a>
        </div>
      </header>

      {/* Hero Section */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 pt-14 pb-20 sm:px-8 sm:pt-20 sm:pb-40">
        <div className="max-w-2xl">
          <h1 className="text-[2.75rem] font-normal tracking-tight leading-[1.08] mb-6 sm:text-6xl lg:text-7xl lg:leading-[1.1] lg:mb-8">
            Smarter Portfolios<br />
            Powered by AI
          </h1>
          <p className="text-base text-gray-400 leading-relaxed mb-8 max-w-lg sm:text-xl sm:mb-10">
            Make smarter investment decisions with real-time forecasts and risk alerts, all in one
            intelligent platform.
          </p>

          <a
            href="#"
            className="inline-flex items-center gap-2.5 bg-gradient-to-tr from-[#4E50FA] via-[#8b7df7] to-[#7679FE] bg-[length:280%_auto] bg-[position:0%_center] hover:bg-[position:100%_center] text-white px-7 py-3.5 rounded-xl font-medium transition-all duration-500 shadow-[0_0_30px_rgba(124,110,246,0.35)] hover:shadow-[0_0_40px_rgba(124,110,246,0.5)] group"
            style={{
              boxShadow:
                '0 0 20px #ffffff00, 0 5px 5px -1px #ffffff40, inset 4px 4px 8px #ffffff80, inset -4px -4px 8px #ffffff59',
            }}
          >
            <Wand2
              className="w-4 h-4 group-hover:-rotate-12 transition-transform"
              fill="currentColor"
              fillOpacity={0.2}
            />
            See AI in Action
          </a>
        </div>

        {/* Dashboard Preview Section with Glowing Beam */}
        <div className="relative mt-20 sm:mt-32">
          {/* Intense Corner Glow Effect as requested per screenshot */}
          <div className="absolute -top-40 -right-40 w-[600px] h-[600px] pointer-events-none z-0">
            {/* Core bright light */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-white blur-[40px] opacity-60" />
            {/* Main blue glow */}
            <div
              className="absolute inset-0"
              style={{
                background:
                  'radial-gradient(circle at center, rgba(66, 99, 255, 0.8) 0%, rgba(66, 99, 255, 0.4) 30%, rgba(66, 99, 255, 0) 70%)',
                filter: 'blur(80px)',
              }}
            />
          </div>

          <div
            className="absolute left-1/2 bottom-full z-[1] h-[520px] w-[150%] -translate-x-1/2 pointer-events-none"
          >
            <LaserFlow
              verticalBeamOffset={-0.5}
              horizontalSizing={0.5}
              color="#758af0"
              className="w-full h-full"
            />
          </div>
          {/* Dashboard UI Container */}
          <motion.div
            initial={{
              opacity: 0,
              y: 40,
            }}
            whileInView={{
              opacity: 1,
              y: 0,
            }}
            viewport={{
              once: true,
            }}
            transition={{
              duration: 0.8,
              ease: 'easeOut',
            }}
            className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#0A0A0A]/80 shadow-2xl backdrop-blur-xl"
          >
            <div className="flex h-[560px] flex-col md:h-[700px] md:flex-row">
              {/* Sidebar */}
              <aside className="w-64 border-r border-white/5 bg-[#0D0D0D] p-6 hidden md:block">
                <motion.div
                  initial={{
                    opacity: 0,
                  }}
                  animate={{
                    opacity: 1,
                  }}
                  transition={{
                    delay: 0.5,
                  }}
                  className="space-y-8"
                >
                  <div className="flex items-center gap-3 mb-10">
                    <div className="w-6 h-6 bg-white rounded flex items-center justify-center">
                      <Sparkles className="w-4 h-4 text-black" fill="currentColor" />
                    </div>
                    <span className="font-semibold text-sm">Luma</span>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-4">
                        Favorites
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-3 px-3 py-2 bg-white/5 rounded-lg text-white text-sm">
                          <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                          Overview
                        </div>
                        <div className="flex items-center gap-3 px-3 py-2 text-gray-500 text-sm hover:text-gray-300 transition-colors cursor-pointer">
                          <div className="w-1.5 h-1.5 rounded-full bg-transparent" />
                          Projects
                        </div>
                      </div>
                    </div>

                    <div>
                      <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-4">
                        Dashboards
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center justify-between px-3 py-2 bg-white/5 rounded-lg text-white text-sm">
                          <div className="flex items-center gap-3">
                            <LayoutDashboard className="w-4 h-4" />
                            Overview
                          </div>
                          <ChevronRight className="w-3 h-3 text-gray-500" />
                        </div>
                        <div className="flex items-center gap-3 px-3 py-2 text-gray-500 text-sm hover:text-gray-300 cursor-pointer transition-colors">
                          <Inbox className="w-4 h-4" />
                          eCommerce
                        </div>
                        <div className="flex items-center gap-3 px-3 py-2 text-gray-500 text-sm hover:text-gray-300 cursor-pointer transition-colors">
                          <Settings className="w-4 h-4" />
                          Projects
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </aside>

              {/* Main Content Area */}
              <div className="flex-1 flex flex-col bg-[#0A0A0A]">
                {/* Dashboard Top Nav */}
                <motion.div
                  initial={{
                    opacity: 0,
                    y: -10,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                  transition={{
                    delay: 0.6,
                  }}
                  className="h-16 border-b border-white/5 flex items-center justify-between px-8"
                >
                  <div className="flex items-center gap-4 text-[13px] text-gray-400">
                    <Grid className="w-4 h-4" />
                    <ChevronRight className="w-3 h-3" />
                    <span>Dashboards</span>
                    <ChevronRight className="w-3 h-3" />
                    <span className="text-white font-medium">Default</span>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                      <input
                        type="text"
                        placeholder="Search"
                        className="bg-white/5 border border-white/5 rounded-lg py-1.5 pl-10 pr-4 text-xs w-48 focus:outline-none focus:border-white/20 transition-all shadow-inner"
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <Sun className="w-4 h-4 text-gray-500 hover:text-white cursor-pointer transition-colors" />
                      <Clock className="w-4 h-4 text-gray-500 hover:text-white cursor-pointer transition-colors" />
                      <Bell className="w-4 h-4 text-gray-500 hover:text-white cursor-pointer transition-colors" />
                      <div className="w-6 h-6 rounded-md bg-white/10 border border-white/20" />
                    </div>
                  </div>
                </motion.div>

                {/* Dashboard Stats */}
                <div className="p-8">
                  <motion.div
                    initial={{
                      opacity: 0,
                    }}
                    animate={{
                      opacity: 1,
                    }}
                    transition={{
                      delay: 0.7,
                    }}
                    className="flex items-center justify-between mb-8"
                  >
                    <h2 className="text-xl font-semibold tracking-tight">Overview</h2>
                    <div className="text-sm text-gray-500">Today</div>
                  </motion.div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    {[
                      {
                        label: 'Views',
                        value: '7,265',
                        change: '+11.01%',
                        color: 'blue',
                      },
                      {
                        label: 'Visits',
                        value: '3,671',
                        change: '-0.03%',
                        color: 'purple',
                      },
                      {
                        label: 'New Users',
                        value: '256',
                        change: '+15.03%',
                        color: 'indigo',
                      },
                      {
                        label: 'Active Users',
                        value: '2,318',
                        change: '+6.08%',
                        color: 'blue',
                      },
                    ].map((stat, i) => (
                      <motion.div
                        key={i}
                        initial={{
                          opacity: 0,
                          scale: 0.95,
                        }}
                        animate={{
                          opacity: 1,
                          scale: 1,
                        }}
                        transition={{
                          delay: 0.7 + i * 0.1,
                        }}
                        className="bg-white/5 border border-white/5 rounded-xl p-5 hover:bg-white/10 transition-colors group cursor-default"
                      >
                        <div className="text-[11px] font-medium text-gray-500 uppercase tracking-wider mb-2">
                          {stat.label}
                        </div>
                        <div className="flex items-baseline justify-between">
                          <span className="text-2xl font-bold">{stat.value}</span>
                          <span className="text-[11px] font-medium px-1.5 py-0.5 rounded text-white/50">
                            {stat.change}
                          </span>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  {/* Chart and Activity Section */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <motion.div
                      initial={{
                        opacity: 0,
                        y: 20,
                      }}
                      animate={{
                        opacity: 1,
                        y: 0,
                      }}
                      transition={{
                        delay: 1.1,
                      }}
                      className="md:col-span-2 bg-white/5 border border-white/5 rounded-xl p-6 relative overflow-hidden group"
                    >
                      <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-4 text-[11px] uppercase tracking-wider">
                          <span className="font-semibold">Total Users</span>
                          <span className="text-gray-500">Total Projects</span>
                          <span className="text-gray-500">Operating Status</span>
                        </div>
                        <div className="flex items-center gap-2 text-[11px] text-gray-500">
                          <div className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.6)]" />{' '}
                          This year
                          <div className="w-2 h-2 rounded-full bg-gray-600" /> Last year
                        </div>
                      </div>

                      {/* Fake Chart Lines */}
                      <div className="h-48 relative flex items-end gap-1.5 pt-4">
                        {[
                          35, 55, 40, 65, 50, 75, 60, 85, 70, 80, 90, 75, 85, 95, 80, 70, 60, 50,
                        ].map((h, i) => (
                          <motion.div
                            key={i}
                            initial={{
                              height: 0,
                            }}
                            animate={{
                              height: `${h}%`,
                            }}
                            transition={{
                              delay: 1.3 + i * 0.05,
                              duration: 0.6,
                              ease: 'circOut',
                            }}
                            className="flex-1 bg-gradient-to-t from-blue-600/40 to-blue-400 group-hover:from-blue-600/60 group-hover:to-blue-300 transition-all rounded-t-sm relative"
                          >
                            <div className="absolute -top-1 left-0 right-0 h-0.5 bg-blue-400 blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity" />
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>

                    <motion.div
                      initial={{
                        opacity: 0,
                        y: 20,
                      }}
                      animate={{
                        opacity: 1,
                        y: 0,
                      }}
                      transition={{
                        delay: 1.2,
                      }}
                      className="bg-white/5 border border-white/5 rounded-xl p-6"
                    >
                      <div className="text-sm font-semibold mb-4">Traffic by Website</div>
                      <div className="space-y-4">
                        {['Google', 'YouTube', 'Instagram', 'Pinterest'].map((site, i) => (
                          <div key={i} className="flex items-center justify-between">
                            <span className="text-xs text-gray-400">{site}</span>
                            <div className="flex-1 mx-4 h-1 bg-white/5 rounded-full overflow-hidden">
                              <motion.div
                                initial={{
                                  width: 0,
                                }}
                                animate={{
                                  width: `${80 - i * 15}%`,
                                }}
                                transition={{
                                  delay: 1.5 + i * 0.1,
                                  duration: 1,
                                }}
                                className="h-full bg-blue-500"
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  </div>
                </div>
              </div>

              {/* Sidebar Right - Activity/Notifications */}
              <aside className="w-72 border-l border-white/5 bg-[#0D0D0D] p-6 hidden lg:block">
                <div className="mb-10">
                  <div className="text-xs font-semibold mb-6">Notifications</div>
                  <div className="space-y-6">
                    {[
                      {
                        icon: Bug,
                        title: 'You fixed a bug.',
                        time: 'Just now',
                      },
                      {
                        icon: User,
                        title: 'New user registered.',
                        time: '59 minutes ago',
                      },
                      {
                        icon: Bug,
                        title: 'You fixed a bug.',
                        time: '12 hours ago',
                      },
                      {
                        icon: TrendingUp,
                        title: 'Andi Lane subscribed to you.',
                        time: 'Today, 11:59 AM',
                      },
                    ].map((item, i) => (
                      <motion.div
                        key={i}
                        initial={{
                          opacity: 0,
                          x: 20,
                        }}
                        animate={{
                          opacity: 1,
                          x: 0,
                        }}
                        transition={{
                          delay: 1.4 + i * 0.1,
                        }}
                        className="flex gap-4"
                      >
                        <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/5 flex items-center justify-center shrink-0">
                          <item.icon className="w-4 h-4 text-gray-400" />
                        </div>
                        <div>
                          <p className="text-xs text-white">{item.title}</p>
                          <span className="text-[10px] text-gray-500">{item.time}</span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="text-xs font-semibold mb-6">Activities</div>
                  <div className="space-y-6">
                    {[
                      {
                        color: 'bg-red-500',
                        title: 'Changed the style.',
                        time: 'Just now',
                      },
                      {
                        color: 'bg-blue-500',
                        title: 'Released a new version.',
                        time: '59 minutes ago',
                      },
                      {
                        color: 'bg-indigo-500',
                        title: 'Submitted a bug.',
                        time: '12 hours ago',
                      },
                    ].map((activity, i) => (
                      <motion.div
                        key={i}
                        initial={{
                          opacity: 0,
                          x: 20,
                        }}
                        animate={{
                          opacity: 1,
                          x: 0,
                        }}
                        transition={{
                          delay: 1.8 + i * 0.1,
                        }}
                        className="flex gap-4"
                      >
                        <div className={`w-8 h-8 rounded-full ${activity.color}/20 shrink-0`} />
                        <div>
                          <p className="text-xs text-white">{activity.title}</p>
                          <span className="text-[10px] text-gray-500">{activity.time}</span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </aside>
            </div>
          </motion.div>
        </div>
      </main>

    </div>
  )
}
