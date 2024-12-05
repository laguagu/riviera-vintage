"use client";

import { Files } from "@/components/files";
import { FileIcon } from "@/components/icons";
import { Message as PreviewMessage } from "@/components/message";
import { useScrollToBottom } from "@/components/use-scroll-to-bottom";
import { Message } from "ai";
import { useChat } from "ai/react";
import { AnimatePresence, motion } from "framer-motion";
import { Session } from "next-auth";
import { useEffect, useState } from "react";

const suggestedActions = [
  {
    title: "Mikä on yhteenveto",
    label: "valituista asiakirjoista?",
    action: "mikä on näiden asiakirjojen yhteenveto?",
  },
  {
    title: "Antiikki liikkeiden aukioloajat",
    label: "Helsingissä tänään",
    action: `Antiikki liikkeiden aukioloajat Helsingissä ${new Date().toLocaleDateString()}`,
  },
];

export function Chat({
  id,
  initialMessages,
  session,
}: {
  id: string;
  initialMessages: Array<Message>;
  session: Session | null;
}) {
  const [selectedFilePathnames, setSelectedFilePathnames] = useState<
    Array<string>
  >([]);
  const [isFilesVisible, setIsFilesVisible] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    if (isMounted !== false && session && session.user) {
      localStorage.setItem(
        `${session.user.email}/selected-file-pathnames`,
        JSON.stringify(selectedFilePathnames),
      );
    }
  }, [selectedFilePathnames, isMounted, session]);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (session && session.user) {
      setSelectedFilePathnames(
        JSON.parse(
          localStorage.getItem(
            `${session.user.email}/selected-file-pathnames`,
          ) || "[]",
        ),
      );
    }
  }, [session]);

  const { messages, handleSubmit, input, setInput, append } = useChat({
    body: { id, selectedFilePathnames },
    // Jos ollaan etusivulla, käytetään tyhjää array:ta
    initialMessages: id === "" ? [] : initialMessages,
    onFinish: (message) => {
      console.log("onFinish", message);
      if (message.content.trim() !== "") {
        window.history.replaceState({}, "", `/${id}`);
      }
    },
  });

  const [messagesContainerRef, messagesEndRef] =
    useScrollToBottom<HTMLDivElement>();

  return (
    <div className="fixed inset-0 top-14 bg-dot-black/[0.2] dark:bg-zinc-900 pt-2 pb-6 flex">
      <div
        className={`max-w-2xl w-full mx-auto px-4 ${messages.length === 0 ? "self-center" : "h-full"}`}
      >
        {messages.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center space-y-3 max-w-md px-4 mx-auto mb-8 mt-20"
          >
            <h2 className="text-2xl font-semibold text-primary">
              Miten voin auttaa?
            </h2>
            <p className="text-lg text-zinc-600 dark:text-zinc-300">
              Avustaja auttaa sinua löytämään alan liikkeitä ja palveluita sekä
              vastaa kysymyksiisi antiikista.
            </p>
          </motion.div>
        )}
        <div
          className={`bg-fade-bottom dark:bg-zinc-800 rounded-lg shadow-lg border border-zinc-200 dark:border-zinc-700 flex flex-col ${messages.length > 0 ? "h-full" : ""}`}
        >
          {messages.length > 0 && (
            // Chat-näkymä kun viestejä on
            <div ref={messagesContainerRef} className="flex-1 overflow-y-auto">
              <div className="flex flex-col gap-4 p-4">
                {messages.map(
                  (message, index) =>
                    message.content.trim() !== "" && (
                      <PreviewMessage
                        key={`${id}-${index}`}
                        role={message.role}
                        content={message.content}
                      />
                    ),
                )}
                <div
                  ref={messagesEndRef}
                  className="flex-shrink-0 min-w-[24px] min-h-[24px]"
                />
              </div>
            </div>
          )}

          {/* Input-kenttä aina näkyvissä alhaalla */}
          <div className="border-t border-zinc-200 dark:border-zinc-700 p-4">
            <form
              className="flex flex-row gap-2 relative items-center"
              onSubmit={handleSubmit}
            >
              <input
                className="bg-zinc-100 rounded-md px-2 py-1.5 flex-1 outline-none dark:bg-zinc-700 text-zinc-800 dark:text-zinc-300"
                placeholder="Lähetä viesti..."
                value={input}
                onChange={(event) => {
                  setInput(event.target.value);
                }}
              />

              <div
                className="relative text-sm bg-zinc-100 rounded-lg size-9 flex-shrink-0 flex flex-row items-center justify-center cursor-pointer hover:bg-zinc-200 dark:text-zinc-50 dark:bg-zinc-700 dark:hover:bg-zinc-800"
                onClick={() => {
                  setIsFilesVisible(!isFilesVisible);
                }}
              >
                <FileIcon />
                <motion.div
                  className="absolute text-xs -top-2 -right-2 bg-blue-500 size-5 rounded-full flex flex-row justify-center items-center border-2 dark:border-zinc-900 border-white text-blue-50"
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  {selectedFilePathnames?.length}
                </motion.div>
              </div>
            </form>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isFilesVisible && (
          <Files
            setIsFilesVisible={setIsFilesVisible}
            selectedFilePathnames={selectedFilePathnames}
            setSelectedFilePathnames={setSelectedFilePathnames}
            session={session}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
