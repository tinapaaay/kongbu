import { useEffect, useRef } from 'react'
import { Link, NavLink, Outlet, useLocation } from 'react-router'
import { navItems } from './navItems'
import { StorageNotice } from './StorageNotice'
import styles from './AppLayout.module.css'

/**
 * The frame around most screens: skip link, top navigation (desktop),
 * page content, and bottom tab bar (phone). CSS decides which nav is visible.
 */
export function AppLayout() {
  const mainRef = useRef<HTMLElement>(null)
  const { pathname } = useLocation()
  const previousPath = useRef(pathname)

  // After moving to a different page, start at the top and move keyboard and
  // screen reader focus to the new content, like a full page load would.
  // Comparing paths (not counting renders) also works when React runs effects twice in development.
  useEffect(() => {
    if (previousPath.current === pathname) return
    previousPath.current = pathname
    window.scrollTo(0, 0)
    mainRef.current?.focus({ preventScroll: true })
  }, [pathname])

  return (
    <div className={styles.shell}>
      <a className={styles.skipLink} href="#main">
        Skip to content
      </a>

      <header className={styles.topBar}>
        <Link to="/" className={styles.brand} aria-label="Hangul Lab home">
          <span className={styles.brandAccent}>HANGUL</span> LAB
        </Link>
        <nav aria-label="Main" className={styles.topNav}>
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) => (isActive ? `${styles.topLink} ${styles.active}` : styles.topLink)}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </header>

      <main id="main" ref={mainRef} tabIndex={-1} className={styles.main}>
        <StorageNotice />
        <Outlet />
      </main>

      <nav aria-label="Main" className={styles.tabBar}>
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            className={({ isActive }) => (isActive ? `${styles.tab} ${styles.tabActive}` : styles.tab)}
          >
            {item.icon}
            <span>{item.shortLabel}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  )
}
