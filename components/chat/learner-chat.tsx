"use client"

import type React from "react"

import { useChat } from "@ai-sdk/react"
import { DefaultChatTransport } from "ai"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Send, Sparkles, User } from "lucide-react"
import { useEffect, useRef, useState } from "react"

export default function LearnerChat() {
  const [inputValue, setInputValue] = useState("")

  const { messages, sendMessage, status, error } = useChat({
    transport: new DefaultChatTransport({ api: "/api/chat/learner" }),
    onError: (error) => {
      console.error(" Chat error:", error)
    },
  })

  useEffect(() => {
    console.log(" Messages updated:", messages)
    console.log(" Status:", status)
    if (error) {
      console.error(" Error state:", error)
    }
  }, [messages, status, error])

  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (inputValue.trim() && status !== "submitted") {
      console.log(" Sending message:", inputValue)
      sendMessage({ text: inputValue })
      setInputValue("")
    }
  }

  const isLoading = status === "submitted"

  return (
    <div className="flex flex-col h-[500px]">
      <ScrollArea className="flex-1 pr-4 overflow-hidden" ref={scrollRef}>
        <div className="space-y-4 pb-4">
          {messages.length === 0 && (
            <div className="text-center py-12 space-y-4">
              <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center mx-auto">
                <Sparkles className="w-8 h-8 text-accent" />
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-semibold">Welcome to Astro-Bio-AI!</h3>
                <p className="text-sm text-muted-foreground max-w-md mx-auto">
                  I'm your friendly guide to NASA's space biology research. Ask me anything about life in space!
                </p>
              </div>
              <div className="flex flex-wrap gap-2 justify-center pt-4">
                {[
                  "How do plants grow in space?",
                  "What happens to astronaut bones?",
                  "Can bacteria survive on Mars?",
                ].map((suggestion, i) => (
                  <Button
                    key={i}
                    variant="outline"
                    size="sm"
                    className="text-xs bg-transparent"
                    onClick={() => setInputValue(suggestion)}
                  >
                    {suggestion}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {error && (
            <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 text-sm text-destructive">
              <p className="font-semibold">Error:</p>
              <p>{error.message}</p>
            </div>
          )}

          {messages.map((message) => (
            <div key={message.id} className={`flex gap-3 ${message.role === "user" ? "justify-end" : "justify-start"}`}>
              {message.role === "assistant" && (
                <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0">
                  <Sparkles className="w-4 h-4 text-accent" />
                </div>
              )}
              <div
                className={`rounded-lg px-4 py-3 max-w-[80%] ${
                  message.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted text-foreground"
                }`}
              >
                {message.parts.map((part, index) => {
                  if (part.type === "text") {
                    return (
                      <p key={index} className="text-sm leading-relaxed whitespace-pre-wrap">
                        {part.text}
                      </p>
                    )
                  }
                  return null
                })}
              </div>
              {message.role === "user" && (
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <User className="w-4 h-4 text-primary" />
                </div>
              )}
            </div>
          ))}

          {isLoading && (
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0">
                <Sparkles className="w-4 h-4 text-accent animate-pulse" />
              </div>
              <div className="rounded-lg px-4 py-3 bg-muted">
                <div className="flex gap-1">
                  <div
                    className="w-2 h-2 rounded-full bg-muted-foreground/50 animate-bounce"
                    style={{ animationDelay: "0ms" }}
                  />
                  <div
                    className="w-2 h-2 rounded-full bg-muted-foreground/50 animate-bounce"
                    style={{ animationDelay: "150ms" }}
                  />
                  <div
                    className="w-2 h-2 rounded-full bg-muted-foreground/50 animate-bounce"
                    style={{ animationDelay: "300ms" }}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      <form onSubmit={handleSubmit} className="flex gap-2 pt-4 border-t border-border/50">
        <Input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Ask about space biology..."
          disabled={isLoading}
          className="flex-1"
        />
        <Button type="submit" disabled={isLoading || !inputValue.trim()} size="icon">
          <Send className="w-4 h-4" />
        </Button>
      </form>
    </div>
  )
}
