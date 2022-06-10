import styles from './styles.module.scss'
import { SignInButton } from '../SignInButton'
import { ActiveLink } from '../ActiveLink'

export function Header() {
  return (
    <header className={styles.headerContainer}>
      <div className={styles.headerContent}>
        <img src='/images/logo.svg' alt='Logo ig.news' />

        <nav>
          <ActiveLink href='/' active={styles.active}>
            <a>Home</a>
          </ActiveLink>

          <ActiveLink href='/posts' active={styles.active}>
            <a>Posts</a>
          </ActiveLink>
        </nav>

        <SignInButton />
      </div>
    </header>
  )
}
