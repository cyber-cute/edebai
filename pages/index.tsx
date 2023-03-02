import { AnimatePresence, motion } from "framer-motion";
import type { NextPage } from "next";
import Head from "next/head";
import { useState } from "react";
import { Toaster, toast } from "react-hot-toast";
import Footer from "../components/Footer";
import Header from "../components/Header";
import LoadingDots from "../components/LoadingDots";
import ResizablePanel from "../components/ResizablePanel";

const Home: NextPage = () => {
  const [loading, setLoading] = useState(false);
  const [question, setQue] = useState("");
  const [generatedQues, setGeneratedQue] = useState<any>("");

  console.log("Streamed response: ", generatedQues);

  const prompt = `Üst düzey bir edebiyatçı gibi sorulara uzun, ayrıntılı cevaplar ver: soru: "${question}"`;

  const generateAnswer = async (e: any) => {
    e.preventDefault();
    setGeneratedQue("");
    setLoading(true);
    const response = await fetch("/api/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt,
      }),
    });
    console.log("Edge function returned.");

    if (!response.ok) {
      throw new Error(response.statusText);
    }

    // This data is a ReadableStream
    const data = response.body;
    if (!data) {
      return;
    }

    const reader = data.getReader();
    const decoder = new TextDecoder();
    let done = false;

    while (!done) {
      const { value, done: doneReading } = await reader.read();
      done = doneReading;
      const chunkValue = decoder.decode(value);
      setGeneratedQue((prev: any) => prev + chunkValue);
    }

    setLoading(false);
  };

  return (
    <div className="flex max-w-5xl mx-auto flex-col items-center justify-center py-2 min-h-screen">
      <Head>
        <title>edebAI</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header />
      <main className="flex flex-1 w-full flex-col items-center justify-center text-center px-4 mt-12 sm:mt-20">
        <h1 className="sm:text-4xl text-3xl max-w-2xl font-bold text-slate-900">
          AI ile Edebiyat Soruları Cevapla.
        </h1>
        <p className="text-slate-500 mt-5">0 tane edebiyat sorusuna cevap verildi.</p>
        <div className="max-w-xl w-full">
          <div className="flex mt-10 items-center space-x-3">
            <p className="text-left font-medium">
              Sorunu sorabilirsin^^{" "}
            </p>
          </div>
          <textarea
            value={question}
            onChange={(e) => setQue(e.target.value)}
            rows={4}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black my-5"
            placeholder={
              "Mehmet Rauf tarzında 19. yüzyıl Fransa'sında gizem, aşk ve felsefi bulmacalarla harmanlanmış bir kısa hikaye yazar mısın?"
            }
          />

          {!loading && (
            <button
              className="bg-black rounded-xl text-white font-medium px-4 py-2 sm:mt-10 mt-8 hover:bg-black/80 w-full"
              onClick={(e) => generateAnswer(e)}
            >
              Cwick &rarr;
            </button>
          )}
          {loading && (
            <button
              className="bg-black rounded-xl text-white font-medium px-4 py-2 sm:mt-10 mt-8 hover:bg-black/80 w-full"
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
        <ResizablePanel>
          <AnimatePresence mode="wait">
            <motion.div className="space-y-10 my-10">
              
              {generatedQues && (
              <>
                <div>
                  <h2 className="sm:text-4xl text-3xl font-bold text-slate-900 mx-auto">
                  Cevap
                  </h2>
                </div>
              
                <div className="space-y-8 flex flex-col items-center justify-center max-w-xl mx-auto">
                  <div
                    className="bg-slate-100 rounded-xl shadow-md p-4 hover:bg-gray-100 transition cursor-copy border"
                    onClick={() => {
                      navigator.clipboard.writeText(generatedQues);
                      toast("Cevap kopyalandı", {
                        icon: "✍",
                      });
                    }}
                    key={generatedQues}
                  >
                    <div className="">
                      {generatedQues.split(". ").map((sentence:any, index:any)=> {
                        return (
                          <div key={index}>
                            {sentence.length > 0 && (
                              <li className="mb-2 list-disc">{sentence}</li>
                            )}
                          </div>
                        );
                        
                      })
                      }
                    </div>

                 </div>
                </div>
              </>
              )}
            </motion.div>
          </AnimatePresence>
        </ResizablePanel>
      </main>
      <Footer />
    </div>
  );
};

export default Home;
