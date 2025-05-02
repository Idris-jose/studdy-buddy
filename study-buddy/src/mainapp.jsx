import Nav from './navbar.jsx';

export default function MainApp() {
  return (
    <div className="flex flex-col min-h-screen">
      <Nav />
      <main className="flex-grow pt-16">
        <div className="p-4">
          <h1>Main App Content</h1> {/* Add temporary content to verify rendering */}
        </div>
      </main>
    </div>
  );
}