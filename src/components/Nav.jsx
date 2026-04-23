import { useTheme } from '../context/ThemeContext'
import logo from '../images/logo.png'
import avatarImg from '../images/image-avatar.png'
import crescent from '../images/crescent.png'
import fullMoon from '../images/full-moon.png'

function Nav() {
  const { theme, toggleTheme } = useTheme()

  return (
    <nav className="nav" aria-label="Main navigation">

      {/* Logo */}
      <div className="nav__logo">
        <img className='nav__logo-img' src={logo} alt="Invoice app" width="40" height="38" />
      </div>

      {/* Right side — theme toggle + avatar */}
      <div className="nav__right">
        <button
          className="nav__theme-btn"
          onClick={toggleTheme}
          aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
        >
          <img
            src={theme === 'light' ? crescent : fullMoon}
            alt=""
            aria-hidden="true"
            width="20"
            height="20"
          />
        </button>

        <div className="nav__avatar">
          <img src={avatarImg} alt="User avatar" width="32" height="32" />
        </div>
      </div>

    </nav>
  )
}

export default Nav
