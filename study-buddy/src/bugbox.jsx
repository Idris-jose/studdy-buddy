import Navbar from './navbar.jsx';

export default function BugBox(){
    return(
        <>
        <Navbar /> 
        <section id='section1' className="relative px-6 py-20 overflow-hidden bg-gradient-to-b from-white to-blue-50">
                <h1 className='text-4xl mb-5 font-bold text-blue-700'>Bug Box</h1>
                 
                <p className='text-lg text-gray-700'>The Bug Box is a feature in the Study Buddy app that allows users to report bugs or issues they encounter while using the application. It serves as a feedback mechanism for users to communicate any problems they face, helping the development team identify and resolve issues quickly.</p>
                <p className='text-lg text-gray-700'>Users can submit detailed descriptions of the bugs, including steps to reproduce them, screenshots, and any other relevant information. This feedback is invaluable for improving the app's performance and user experience.</p>
                <p className='text-lg text-gray-700'>The Bug Box is an essential part of the Study Buddy app, ensuring that users have a smooth and efficient experience while using the platform.</p>
            </section>  

        </>
    )
}