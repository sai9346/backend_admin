import React from 'react';
import { UserProvider } from './context/UserContext'; // Adjust the import path as needed
import RenewExtendPlans from './components/PlanManagement/RenewExtendPlans'; // Adjust the import path

function App() {
    return (
        <UserProvider>
            <RenewExtendPlans />
            {/* Other components that might use useUser */}
        </UserProvider>
    );
}

export default App;
