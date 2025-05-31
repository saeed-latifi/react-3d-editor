import ThreeScene from "./components/ThreeScene";

function App() {
  return (
    <div className="w-screen h-screen relative">
      <h1 className="absolute left-4 top-4 text-lg font-bold rounded-lg p-3 text-white bg-blue-950">
        React-Three.js Demo with Orbit and Pan
      </h1>
      <ThreeScene />
    </div>
  );
}

export default App;
