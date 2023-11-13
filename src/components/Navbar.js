import { Link } from 'react-router-dom';

function Navbar({ authUser }) {
  return (
    <div className='p-3 bg-gray-200 shadow-lg shadow-slate-500 flex justify-between'>
      <Link to='/'>
        <img
          src='https://static.vinted.com/assets/web-logo/default/logo.svg'
          alt='Logo'
        />
      </Link>
      {authUser ? (
        <p className='navText'>{`Zalogowano jako: ${authUser.email}`}</p>
      ) : null}

      {authUser ? (
        <Link to='/logout' className='navText'>
          Wyloguj
        </Link>
      ) : (
        <Link to='/login' className='navText'>
          Zaloguj
        </Link>
      )}
    </div>
  );
}

export default Navbar;
