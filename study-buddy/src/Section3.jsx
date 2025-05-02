import React from 'react';

const Section3 = () => {
  const benefits = [
    {
      title: 'Organized Study Plan',
      description:
        'The generator provides a clear and structured study schedule, helping students stay organized and focused on their academic priorities.',
    },
    {
      title: 'Flexible Timing',
      description:
        'Students can customize their study timetable to suit their individual needs and preferences, ensuring they have the flexibility to manage their academic workload.',
    },
    {
      title: 'Improved Academic Performance',
      description:
        'By following a well-structured study plan, students can better manage their time, leading to improved academic performance and higher grades.',
    },
  ];

  return (
    <section className="py-12 ">
        <h1 className='text-center text-4xl font-bold mb-3'>Benefits</h1>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => (
            <div key={index} className="text-center">
              <div className="flex justify-center mb-4">
                <span className="text-gray-400">⋯</span>
              </div>
              <h3 className="text-lg font-bold text-gray-900 uppercase mb-4">{benefit.title}</h3>
              <p className="text-gray-600">{benefit.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Section3;