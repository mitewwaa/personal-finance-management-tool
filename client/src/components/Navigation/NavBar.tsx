import { FaExchangeAlt, FaHome, FaUserCircle, FaWallet } from 'react-icons/fa';
import { BiLogOutCircle } from 'react-icons/bi';
import { BrowserRouter as Router, Link, useNavigate } from 'react-router-dom';
import '../../styles/NavBar.css';

interface NavBarProps {
    onLogout: () => void; // Пропс за функция за изход
  }
  
const NavBar: React.FC<NavBarProps> = ({ onLogout }) => {

    return (
        <nav id='navContainer'>
            <ul id='navList'>
                <li className='navItem' title='Home'>
                    <Link to="/dashboard">
                        <FaHome className='icon' />
                    </Link>
                </li>
                <li className='navItem' title='Transactions'>
                    <Link to="/transactions">
                        <FaExchangeAlt className='icon' />
                    </Link>
                </li>
                <li className='navItem' title='Budgets'>
                    <Link to="/budgets">
                        <FaWallet className='icon' />
                    </Link>
                </li>
                <div id='bottomNavItems'>
                    <li className='navItem' title='Profile'>
                        <Link to="/profile">
                            <FaUserCircle className='icon' />
                        </Link>
                    </li>
                    <li className='navItem' title='Log Out' onClick={onLogout}>
                        <Link to="/">
                            <BiLogOutCircle className='icon' />
                        </Link>
                    </li>
                </div>

            </ul>
        </nav>
    );
};

export default NavBar;
