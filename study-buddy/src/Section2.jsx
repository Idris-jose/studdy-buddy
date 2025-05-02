import studyFeatureImage from './assets/Selection (4).png';

export default function Section2() {
  const features = [
    {
      title: 'Generate Study Timetable',
      description:
        'Effortlessly create a personalized study timetable that allocates time for each subject based on your exam schedule and syllabus.',
    },
    {
      title: 'Collaborative Study Platform',
      description:
        'Join study groups and share timetables with peers for collaborative learning and coordination.',
    },
    {
      title: 'Visual Time Management',
      description:
        'Utilize a calendar view to see your study plan at a glance, making it easy to manage your time effectively.',
    },
    {
      title: 'Export Timetable',
      description: 'Save your study timetable as a PDF for easy access and printing.',
    },
    {
      title: 'Download Resources',
      description: 'Access exam papers, class resources, and more through our integrated platform.',
    },
  ];

  return (
    <section
      className=" px-4 py-12 flex flex-col lg:flex-row items-center justify-center min-h-screen "
      aria-labelledby="features-heading"
    >
      <div className="flex-1 max-w-md">
        <img
          src={studyFeatureImage}
          alt="Illustration of Study Buddy features"
          className=""
        />
      </div>
      <div className="flex-1 max-w-lg flex flex-col items-start">
        <h2 id="features-heading" className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
          Features
        </h2>
        <ul className="space-y-4 text-gray-700">
          {features.map((feature, index) => (
            <li key={index} className="flex items-start gap-3">
              <svg
                className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
              <div>
                <strong className="font-semibold text-gray-900">{feature.title}:</strong>{' '}
                <span className="text-base">{feature.description}</span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}