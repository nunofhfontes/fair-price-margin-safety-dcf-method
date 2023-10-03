// pages/about.js

// FIXME this should no be here, globals.css should work for whole component tree
import '../app/globals.css'

import React from 'react';
import Sidemenu from '../app/components/Sidemenu'

const DashboardPage = () => {
  return (
    <div className="flex">
        <div className='w-1/5'>
          <Sidemenu />
        </div>
        <main className='w-4/5 mx-5'>
        <div>
            <h1>Dashboard</h1>
            <p>This is the Dashboard page content. (Under app)</p>
            </div>
        </main>
    </div>
    
  );
};

export default DashboardPage;
