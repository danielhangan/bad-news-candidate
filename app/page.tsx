
// Input
// Candidate full name
// Position
// Drop in all feedbac across all stages. (text, future notion pages, docx files)


'use client';
import Head from 'next/head';
// import Image from 'next/image';
import { useRef, useState } from 'react';
import { Toaster, toast } from 'react-hot-toast';
import { VibeType } from '../components/DropDown';
import Footer from '../components/Footer';
import { Header } from '../components/Header';
import LoadingDots from '../components/LoadingDots';
import {
  createParser,
  ParsedEvent,
  ReconnectInterval,
} from 'eventsource-parser';
import Toggle from '../components/Toggle';

// const test_feedback = "Recruiter Interview Feedback: Positive; good communication, cultural fit, and professionalism. Technical Interview Feedback: Needs improvement; struggled with complex algorithmic problems, limited technical depth in data structures and system design, basic knowledge of cloud technologies."

export default function Page() {
  const [loading, setLoading] = useState(false);
  const [candidateName, setCandidateName] = useState<string>('');
  const [jobTitle, setJobTitle] = useState<string>('');
  const [feedback, setFeedback] = useState<string>('');
  const [generatedBios, setGeneratedBios] = useState<String>('');
  const [isGPT, setIsGPT] = useState(false);

  const bioRef = useRef<null | HTMLDivElement>(null);

  const scrollToBios = () => {
    if (bioRef.current !== null) {
      bioRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // const old_prompt = `Generate 3 ${
  //   vibe === 'Casual' ? 'relaxed' : vibe === 'Funny' ? 'silly' : 'Professional'
  // } twitter biographies with no hashtags and clearly labeled "1.", "2.", and "3.". Only return these 3 twitter bios, nothing else. ${
  //   vibe === 'Funny' ? 'Make the biographies humerous' : ''
  // }Make sure each generated biography is less than 300 characters, has short sentences that are found in Twitter bios, and feel free to use this context as well: ${bio}${
  //   bio.slice(-1) === '.' ? '' : '.'
  // }`;

  const prompt = `
Generate a concise yet empathetic email for ${candidateName}, who applied for the ${jobTitle} role. The email should succinctly communicate the decision to not proceed with their application, limited to six sentences. Use the detailed feedback, ${feedback}, to create a personalized message that highlights the candidate's unique strengths and provides specific areas for improvement. Include actionable advice, such as relevant skills to develop or resources to explore. Acknowledge the challenges of the job search process to add empathy. Conclude with a statement of encouragement, suggesting potential for future applications, and invite the candidate to seek further feedback if desired. Aim for a tone that is professional, supportive, and growth-focused.
`;

  const generateBio = async (e: any) => {
    e.preventDefault();
    setGeneratedBios('');
    setLoading(true);
    const response = await fetch(isGPT ? '/api/openai' : '/api/mistral', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt,
      }),
    });

    if (!response.ok) {
      throw new Error(response.statusText);
    }

    // This data is a ReadableStream
    const data = response.body;
    if (!data) {
      return;
    }

    const onParseGPT = (event: ParsedEvent | ReconnectInterval) => {
      if (event.type === 'event') {
        const { data } = event;
        try {
          const text = JSON.parse(data).text ?? '';
          setGeneratedBios((prev) => prev + text);
        } catch (e) {
          console.error(e);
        }
      }
    };

    const onParseMistral = (event: ParsedEvent | ReconnectInterval) => {
      if (event.type === 'event') {
        const { data } = event;
        if (data === '[DONE]') {
          return;
        }
        try {
          const text = JSON.parse(data).choices[0].text ?? '';
          if (text == '</s>') return;
          setGeneratedBios((prev) => prev + text);
        } catch (e) {
          console.error(e);
        }
      }
    };

    const onParse = isGPT ? onParseGPT : onParseMistral;

    // https://web.dev/streams/#the-getreader-and-read-methods
    const reader = data.getReader();
    const decoder = new TextDecoder();
    const parser = createParser(onParse);
    let done = false;
    while (!done) {
      const { value, done: doneReading } = await reader.read();
      done = doneReading;
      const chunkValue = decoder.decode(value);
      parser.feed(chunkValue);
    }
    scrollToBios();
    setLoading(false);
  };

  console.log(generatedBios)

  return (
    <div className="flex flex-col items-center justify-center max-w-5xl min-h-screen py-2 mx-auto">
      <Head>
        <title>Candidate rejection email generator</title>
        <link rel="icon" href="/logo-1.ico" />
      </Head>

      <Header />
      <main className="flex flex-col items-center justify-center flex-1 w-full px-4 mt-12 text-center sm:mt-20">
        <p className="px-4 py-1 mb-5 text-sm transition duration-300 ease-in-out border rounded-2xl text-slate-500 hover:scale-105">
          <b>584</b> rejection emails generated
        </p>
        <h1 className="sm:text-6xl text-4xl max-w-[708px] font-bold text-slate-900">
          Feedback first candidate rejection emails using AI
        </h1>
        <div className="mt-7">
          <Toggle isGPT={isGPT} setIsGPT={setIsGPT} />
        </div>

        <div className="w-full max-w-xl">

          <div className="flex flex-col items-start mt-10 space-y-3">
            <div className='flex flex-row gap-x-3'>
              <p className='px-2 text-white bg-black rounded-full font-extralight'>1</p>
              <p className="font-medium text-left">
                Candidate's full name
              </p>
            </div>
            <input type='text' value={candidateName} onChange={(e) => setCandidateName(e.target.value)} placeholder="John Doe" className='inline-flex items-center justify-between w-full px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm focus:border-gray-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-black' />
          </div>

          <div className="flex flex-col items-start mt-10 space-y-3">
            <div className='flex flex-row gap-x-3'>
              <p className='px-2 text-white bg-black rounded-full font-extralight'>2</p>
              <p className="font-medium text-left">
                Position applied for
              </p>
            </div>
            <input type='text' value={jobTitle} onChange={(e) => setJobTitle(e.target.value)} placeholder="Software Engineer" className='inline-flex items-center justify-between w-full px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm focus:border-gray-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-black' />
          </div>

          <div className="flex items-center mt-10 space-x-3">
            <p className='px-2 text-white bg-black rounded-full font-extralight'>3</p>
            <p className="font-medium text-left">
              Drop in all feedback and notes{' '}
              <span className="text-slate-500">(across all hiring stages)</span>.
            </p>
          </div>
          <textarea
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            rows={8}
            className="w-full my-5 border-gray-300 rounded-md shadow-sm focus:border-black focus:ring-black"
            placeholder={'Recruiter Interview Feedback: Positive; good communication, cultural fit, and professionalism. \n\nTechnical Interview Feedback: Needs improvement; struggled with complex algorithmic problems, limited technical depth in data structures and system design, basic knowledge of cloud technologies.'}
          />
          {/* <div className="flex items-center mb-5 space-x-3">
            <p className='px-2 text-white bg-black rounded-full font-extralight'>3</p>
            <p className="font-medium text-left">Select your vibe.</p>
          </div>
          <div className="block">
            <DropDown vibe={vibe} setVibe={(newVibe) => setVibe(newVibe)} />
          </div> */}

          {!loading && (
            <button
              className="w-full px-4 py-2 mt-8 font-medium text-white bg-black rounded-xl sm:mt-10 hover:bg-black/80"
              onClick={(e) => generateBio(e)}
            >
              Generate email &rarr;
            </button>
          )}
          {loading && (
            <button
              className="w-full px-4 py-2 mt-8 font-medium text-white bg-black rounded-xl sm:mt-10 hover:bg-black/80"
              disabled
            >
              <LoadingDots color="white" style="large" />
            </button>
          )}
        </div>
        <Toaster
          position="top-center"
          reverseOrder={false}
          toastOptions={{ duration: 2000 }}
        />
        <hr className="h-px bg-gray-700 border-1 dark:bg-gray-700" />
        <div className="my-10 space-y-10">
          {generatedBios && (
            <>
              <div>
                <h2
                  className="mx-auto text-3xl font-bold sm:text-4xl text-slate-900"
                  ref={bioRef}
                >
                  Your generated email
                </h2>
              </div>


              <div className='relative flex flex-col items-end'>
                <textarea
                  className="w-full sm:w-[600px] my-5 border-gray-300 rounded-md shadow-md p-4 focus:border-black focus:ring-black"
                  disabled
                  value={generatedBios.toString().trimStart()} rows={20}
                />
                <button
                  className="absolute px-2 transition bg-white border rounded-lg hover:bg-gray-100 cursor-copy bottom-8 right-2"
                  onClick={() => {
                    navigator.clipboard.writeText(generatedBios.toString().trimStart());
                    toast('Bio copied to clipboard', {
                      icon: '✂️',
                    });
                  }}
                >
                  copy to clipboard
                </button>
              </div>
              <div className="flex flex-col items-center justify-center w-full space-y-8">
              </div>
            </>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};
