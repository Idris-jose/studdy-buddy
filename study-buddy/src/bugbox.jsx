import Navbar from './navbar.jsx';

import { useState } from 'react';
export default function BugBox(){

    const [description, setDescription] = useState(''); 
    const [title, setTitle] = useState('');
      
    const handleSubmit = (event) => {
        event.preventDefault();
        // Handle form submission logic here
        console.log("Bug reported!");
        setDescription(''); // Clear the description field
        setTitle(''); // Clear the title field
    }

    return(   
        <>
        <Navbar /> 
        <section id='section1' className="relative px-6 py-20 overflow-hidden bg-gradient-to-b from-white to-blue-50">
                <h1 className='text-4xl mb-5 font-bold text-blue-700'>Bug Box</h1>
                 
                <p className='text-lg text-gray-700'>The Bug Box is a feature in the Study Buddy app that allows users to report bugs or issues they encounter while using the application. It serves as a feedback mechanism for users to communicate any problems they face, helping the development team identify and resolve issues quickly.</p>
                <p className='text-lg text-gray-700'>Users can submit detailed descriptions of the bugs, including steps to reproduce them, screenshots, and any other relevant information. This feedback is invaluable for improving the app's performance and user experience.</p>
                <p className='text-lg text-gray-700'>The Bug Box is an essential part of the Study Buddy app, ensuring that users have a smooth and efficient experience while using the platform.</p>

                <form className='mt-8'>
                    <label htmlFor='bug-title' className='block text-lg font-semibold text-gray-700 mb-2'>Bug Title:</label>
                    <input type='text' value={title} onChange={(e) => setTitle(e.target.value)} id='bug-title' className='w-full p-3 border border-gray-300 rounded-lg mb-4' placeholder='Enter a brief title for the bug...' />
                    <label htmlFor='bug-description' className='block text-lg font-semibold text-gray-700 mb-2'>Describe the bug:</label>
                    <textarea id='bug-description' value={description} onChange={(e) => setDescription(e.target.value)} rows='4' className='w-full p-3 border border-gray-300 rounded-lg mb-4' placeholder='Please describe the bug you encountered...'></textarea>
                    <button type='submit' onClick={handleSubmit} className='bg-blue-600 text-white px-5 py-2 rounded-lg font-medium hover:bg-blue-700 shadow-md hover:shadow-lg transition-all'>Submit Bug</button>
                    </form>

            </section>  

        </>
    )
}