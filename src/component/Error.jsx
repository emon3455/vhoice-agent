
import { Link } from 'react-router-dom'
import CButton from '../utils/CButton/CButton';

        
const Error = () => {
    return (
        <div className="h-screen flex flex-col gap-0 justify-center items-center ">
            <h2 className="text-xl text-center font-semibold text-red-500 my-4">Something Went Wrong..!!!</h2>
            <Link to='/'>
                <CButton variant={'outline'}>Go Back To Homepage</CButton>
            </Link>
        </div>
    );
    
};

export default Error;