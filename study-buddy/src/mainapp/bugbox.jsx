import Navbar from './navbar.jsx';
import { useState, useEffect } from 'react';
import emailjs from '@emailjs/browser';

// Replace these with your actual EmailJS credentials
const EMAILJS_PUBLIC_KEY = 'ZDuUduK4Ipy0absUV'; 
const EMAILJS_SERVICE_ID = 'service_n3ft15s';
const EMAILJS_TEMPLATE_ID = 'template_htiokxe'; 

export default function BugBox() {
    const [description, setDescription] = useState(''); 
    const [title, setTitle] = useState('');
    const [email, setEmail] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitMessage, setSubmitMessage] = useState(null);
    
    // Initialize EmailJS when component mounts
    useEffect(() => {
        emailjs.init(EMAILJS_PUBLIC_KEY);
    }, []);
      
    const handleSubmit = async (event) => {
        event.preventDefault();
        setIsSubmitting(true);
        
        try {
            // Get current time for the template
            const now = new Date();
            const timeString = now.toLocaleString();
            
            // Match these exactly with your template variables
            const templateParams = {
                name: email || 'Anonymous User',
                time: timeString,
                message: `Bug Title: ${title}\n\nDescription: ${description}`,
                to_name: 'Developer', // Optional - who the email is addressed to
                reply_to: email || 'no-reply@example.com', // For reply functionality
                to_email: 'idrisjose11@gmail.com' // The destination email
            };
            
            // Send using EmailJS
            const response = await emailjs.send(
                EMAILJS_SERVICE_ID,
                EMAILJS_TEMPLATE_ID,
                templateParams,
                EMAILJS_PUBLIC_KEY // Add the public key here as well
            );
            
            console.log('SUCCESS!', response.status, response.text);
            setSubmitMessage({ 
                type: 'success', 
                text: 'Bug report submitted successfully! Thank you for your feedback.' 
            });
            
            // Clear the form fields
            setDescription('');
            setTitle('');
            setEmail('');
            
        } catch (error) {
            console.error('Error submitting bug report:', error);
            setSubmitMessage({ 
                type: 'error', 
                text: 'Failed to submit bug report. Please try again later.' 
            });
        } finally {
            setIsSubmitting(false);
        }
    }

    return (   
        <>
        <Navbar /> 
        <section id='section1' className="relative px-6 py-20 overflow-hidden bg-gradient-to-b from-white to-blue-50">
                <h1 className='text-4xl mb-5 font-bold text-blue-700'>Bug Box</h1>
                 
                <p className='text-lg text-gray-700'>The Bug Box is a feature in the Study Buddy app that allows users to report bugs or issues they encounter while using the application. It serves as a feedback mechanism for users to communicate any problems they face, helping the development team identify and resolve issues quickly.</p>
                <p className='text-lg text-gray-700'>Users can submit detailed descriptions of the bugs, including steps to reproduce them, screenshots, and any other relevant information. This feedback is invaluable for improving the app's performance and user experience.</p>
                <p className='text-lg text-gray-700'>The Bug Box is an essential part of the Study Buddy app, ensuring that users have a smooth and efficient experience while using the platform.</p>

                <form className='mt-8' onSubmit={handleSubmit}>
                    <label htmlFor='bug-title' className='block text-lg font-semibold text-gray-700 mb-2'>Bug Title:</label>
                    <input 
                        type='text' 
                        value={title} 
                        onChange={(e) => setTitle(e.target.value)} 
                        id='bug-title' 
                        className='w-full p-3 border border-gray-300 rounded-lg mb-4' 
                        placeholder='Enter a brief title for the bug...' 
                        required
                    />
                    
                    <label htmlFor='your-email' className='block text-lg font-semibold text-gray-700 mb-2'>Your Email (optional):</label>
                    <input 
                        type='email' 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)} 
                        id='your-email' 
                        className='w-full p-3 border border-gray-300 rounded-lg mb-4' 
                        placeholder='Enter your email address for follow-up...' 
                    />
                    
                    <label htmlFor='bug-description' className='block text-lg font-semibold text-gray-700 mb-2'>Describe the bug:</label>
                    <textarea 
                        id='bug-description' 
                        value={description} 
                        onChange={(e) => setDescription(e.target.value)} 
                        rows='4' 
                        className='w-full p-3 border border-gray-300 rounded-lg mb-4' 
                        placeholder='Please describe the bug you encountered...'
                        required
                    ></textarea>
                    
                    {submitMessage && (
                        <div className={`p-3 mb-4 rounded-lg ${submitMessage.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                            {submitMessage.text}
                        </div>
                    )}
                    
                    <button 
                        type='submit' 
                        className='bg-blue-600 text-white px-5 py-2 rounded-lg font-medium hover:bg-blue-700 shadow-md hover:shadow-lg transition-all disabled:bg-blue-300'
                        disabled={!title || !description || isSubmitting}
                    >
                        {isSubmitting ? 'Submitting...' : 'Submit Bug Report'}
                    </button>
                </form>
            </section>  
        </>
    )
}