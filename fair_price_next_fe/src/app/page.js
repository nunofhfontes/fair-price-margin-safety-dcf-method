import Image from 'next/image'
import Navbar from './components/Navbar'
import Sidemenu from './components/Sidemenu'
import Dashboard from './components/Dashboard'


export default function Home() {
  return (
    <>  
      {/* <main className='bg-gray-500'></main> */}
      <div className="flex">
        <div className='w-1/5'>
          <Sidemenu />
        </div>
        <main className='w-4/5 mx-5'>
          <Dashboard />


          {/* <div className="container mx-auto mt-12">
            <div className="grid grid-cols-1 gap-6 mb-6 lg:grid-cols-3">
                <div className="w-full px-4 py-5 bg-white rounded-lg shadow">
                    <div className="text-sm font-medium text-gray-500 truncate">
                        Total users
                    </div>
                    <div className="mt-1 text-3xl font-semibold text-gray-900">
                        12,00
                    </div>
                </div>
                <div className="w-full px-4 py-5 bg-white rounded-lg shadow">
                    <div className="text-sm font-medium text-gray-500 truncate">
                        Total Profit
                    </div>
                    <div className="mt-1 text-3xl font-semibold text-gray-900">
                        $ 450k
                    </div>
                </div>
                <div className="w-full px-4 py-5 bg-white rounded-lg shadow">
                    <div className="text-sm font-medium text-gray-500 truncate">
                        Total Orders
                    </div>
                    <div className="mt-1 text-3xl font-semibold text-gray-900">
                        20k
                    </div>
                </div>
            </div>
          </div> */}
        </main>
      </div>
    </>
    
    
    
    
    // <main className="flex min-h-screen flex-col items-center justify-between">
    // </main>
  )
}
