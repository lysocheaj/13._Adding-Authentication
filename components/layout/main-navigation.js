import Link from 'next/link';
import { useSession, SessionProvider } from 'next-auth/react';

import classes from './main-navigation.module.css';

function MainNavigation() {
  const [session, loading] = useSession();
  console.log(session);
  console.log(loading);

  return (
    <header className={classes.header}>
      <Link href='/'>
        <a>
          <div className={classes.logo}>Next Auth</div>
        </a>
      </Link>
      <nav>
        <ul>
          <li>
            <Link href='/auth'>Login</Link>
          </li>
          <li>
            <Link href='/profile'>Profile</Link>
          </li>
          <li>
            <button>Logout</button>
          </li>
        </ul>
      </nav>
    </header>
  );
}

export default MainNavigation;
