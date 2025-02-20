import React from 'react'

const UnauthorizedPages = () => {
  return (
    <div>
      <div className="text-center p-10">
            <h1 className="text-4xl font-bold text-red-500">Access Denied</h1>
            <p className="text-lg mt-3 text-gray-600">
                You do not have permission to view this page.
            </p>
        </div>
    </div>
  )
}

export default UnauthorizedPages
