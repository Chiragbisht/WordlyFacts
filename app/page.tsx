import React from 'react';
import Button from './components/Button';

export default function Home() {
  const handleGetFacts = () => {
    console.log('Getting facts...');
    // Here you would add functionality to actually get facts
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold mb-8">Welcome to Wordly</h1>
      <Button text="Get Facts" onPress={handleGetFacts} />
    </main>
  );
}
