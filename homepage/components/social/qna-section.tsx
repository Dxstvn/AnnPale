"use client"

import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import {
  HelpCircle,
  Search,
  ThumbsUp,
  CheckCircle,
  Clock,
  TrendingUp,
  MessageSquare,
  Plus,
  Filter,
  ChevronUp,
  ChevronDown,
  Star,
  Sparkles
} from "lucide-react"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"
import { formatDistanceToNow } from "date-fns"
import { toast } from "sonner"

// Q&A data types
export interface Question {
  id: string
  question: string
  answer?: string
  category?: string
  askedBy?: {
    name: string
    avatar?: string
  }
  answeredBy?: {
    name: string
    avatar?: string
    isCreator: boolean
  }
  askedAt: Date
  answeredAt?: Date
  upvotes: number
  hasUpvoted?: boolean
  isPinned?: boolean
  isPopular?: boolean
  views?: number
}

export interface QnASectionData {
  questions: Question[]
  totalQuestions: number
  answeredQuestions: number
  categories?: string[]
  allowQuestions: boolean
  requireApproval?: boolean
}

interface QnASectionProps {
  data: QnASectionData
  creatorName: string
  onQuestionSubmit?: (question: string, category?: string) => void
  onQuestionUpvote?: (questionId: string) => void
  onAnswerSubmit?: (questionId: string, answer: string) => void
  className?: string
  variant?: "full" | "compact" | "accordion"
}

// Question card component
function QuestionCard({
  question,
  onUpvote,
  onAnswer,
  isCreator = false
}: {
  question: Question
  onUpvote?: (id: string) => void
  onAnswer?: (id: string, answer: string) => void
  isCreator?: boolean
}) {
  const [hasUpvoted, setHasUpvoted] = React.useState(question.hasUpvoted)
  const [upvotes, setUpvotes] = React.useState(question.upvotes)
  const [isAnswering, setIsAnswering] = React.useState(false)
  const [answer, setAnswer] = React.useState("")
  
  const handleUpvote = () => {
    const newState = !hasUpvoted
    setHasUpvoted(newState)
    setUpvotes(prev => newState ? prev + 1 : prev - 1)
    onUpvote?.(question.id)
  }
  
  const handleAnswer = () => {
    if (answer.trim()) {
      onAnswer?.(question.id, answer)
      setAnswer("")
      setIsAnswering(false)
      toast.success("Answer posted!")
    }
  }
  
  return (
    <Card className={cn(
      "transition-all",
      question.isPinned && "border-purple-500 bg-purple-50/50 dark:bg-purple-900/20",
      question.isPopular && "border-yellow-500"
    )}>
      <CardContent className="p-4">
        <div className="space-y-3">
          {/* Question header */}
          <div className="flex items-start justify-between">
            <div className="flex-1 space-y-2">
              <div className="flex items-center gap-2">
                {question.isPinned && (
                  <Badge className="bg-purple-600 text-xs">
                    <Star className="h-3 w-3 mr-0.5" />
                    Pinned
                  </Badge>
                )}
                {question.isPopular && (
                  <Badge className="bg-yellow-500 text-xs">
                    <TrendingUp className="h-3 w-3 mr-0.5" />
                    Popular
                  </Badge>
                )}
                {question.category && (
                  <Badge variant="secondary" className="text-xs">
                    {question.category}
                  </Badge>
                )}
              </div>
              
              <h4 className="font-medium text-sm">{question.question}</h4>
              
              <div className="flex items-center gap-3 text-xs text-gray-500">
                {question.askedBy && (
                  <span>Asked by {question.askedBy.name}</span>
                )}
                <span>{formatDistanceToNow(question.askedAt, { addSuffix: true })}</span>
                {question.views && (
                  <span>{question.views} views</span>
                )}
              </div>
            </div>
            
            <button
              onClick={handleUpvote}
              className={cn(
                "flex flex-col items-center gap-1 p-2 rounded-lg transition-colors",
                hasUpvoted 
                  ? "bg-purple-100 text-purple-600 dark:bg-purple-900/30" 
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800"
              )}
            >
              <ChevronUp className="h-4 w-4" />
              <span className="text-xs font-medium">{upvotes}</span>
            </button>
          </div>
          
          {/* Answer */}
          {question.answer ? (
            <div className="pl-4 border-l-2 border-green-500">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="text-xs font-medium text-green-600">
                  Answered by {question.answeredBy?.name}
                </span>
                {question.answeredAt && (
                  <span className="text-xs text-gray-500">
                    {formatDistanceToNow(question.answeredAt, { addSuffix: true })}
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                {question.answer}
              </p>
            </div>
          ) : (
            <>
              {isCreator && !isAnswering && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsAnswering(true)}
                >
                  <MessageSquare className="h-3 w-3 mr-1" />
                  Answer this question
                </Button>
              )}
              
              {isAnswering && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="space-y-2"
                >
                  <Textarea
                    placeholder="Write your answer..."
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                    className="min-h-[100px]"
                  />
                  <div className="flex gap-2">
                    <Button size="sm" onClick={handleAnswer}>
                      Post Answer
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => {
                        setIsAnswering(false)
                        setAnswer("")
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                </motion.div>
              )}
            </>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

// Ask question form
function AskQuestionForm({
  categories,
  onSubmit
}: {
  categories?: string[]
  onSubmit: (question: string, category?: string) => void
}) {
  const [isAsking, setIsAsking] = React.useState(false)
  const [question, setQuestion] = React.useState("")
  const [category, setCategory] = React.useState("")
  
  const handleSubmit = () => {
    if (question.trim()) {
      onSubmit(question, category || undefined)
      setQuestion("")
      setCategory("")
      setIsAsking(false)
      toast.success("Question submitted!")
    }
  }
  
  return (
    <div className="space-y-3">
      {!isAsking ? (
        <Button
          variant="outline"
          className="w-full justify-start"
          onClick={() => setIsAsking(true)}
        >
          <Plus className="h-4 w-4 mr-2" />
          Ask a Question
        </Button>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-3"
        >
          <Textarea
            placeholder="What would you like to know?"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            className="min-h-[100px]"
          />
          
          {categories && categories.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <Badge
                  key={cat}
                  variant={category === cat ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => setCategory(category === cat ? "" : cat)}
                >
                  {cat}
                </Badge>
              ))}
            </div>
          )}
          
          <div className="flex gap-2">
            <Button onClick={handleSubmit} disabled={!question.trim()}>
              Submit Question
            </Button>
            <Button 
              variant="outline"
              onClick={() => {
                setIsAsking(false)
                setQuestion("")
                setCategory("")
              }}
            >
              Cancel
            </Button>
          </div>
        </motion.div>
      )}
    </div>
  )
}

// Q&A stats
function QnAStats({
  totalQuestions,
  answeredQuestions
}: {
  totalQuestions: number
  answeredQuestions: number
}) {
  const answeredPercent = totalQuestions > 0 
    ? Math.round((answeredQuestions / totalQuestions) * 100)
    : 0
  
  return (
    <div className="grid grid-cols-3 gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
      <div className="text-center">
        <div className="text-2xl font-bold text-purple-600">{totalQuestions}</div>
        <p className="text-xs text-gray-500">Total Questions</p>
      </div>
      <div className="text-center">
        <div className="text-2xl font-bold text-green-600">{answeredQuestions}</div>
        <p className="text-xs text-gray-500">Answered</p>
      </div>
      <div className="text-center">
        <div className="text-2xl font-bold text-blue-600">{answeredPercent}%</div>
        <p className="text-xs text-gray-500">Response Rate</p>
      </div>
    </div>
  )
}

// Search bar
function QnASearch({
  onSearch
}: {
  onSearch: (query: string) => void
}) {
  const [query, setQuery] = React.useState("")
  
  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
      <Input
        placeholder="Search questions..."
        value={query}
        onChange={(e) => {
          setQuery(e.target.value)
          onSearch(e.target.value)
        }}
        className="pl-10"
      />
    </div>
  )
}

// Main Q&A section component
export function QnASection({
  data,
  creatorName,
  onQuestionSubmit,
  onQuestionUpvote,
  onAnswerSubmit,
  className,
  variant = "full"
}: QnASectionProps) {
  const [searchQuery, setSearchQuery] = React.useState("")
  const [selectedCategory, setSelectedCategory] = React.useState<string | null>(null)
  
  const filteredQuestions = React.useMemo(() => {
    let filtered = [...data.questions]
    
    if (searchQuery) {
      filtered = filtered.filter(q => 
        q.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        q.answer?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }
    
    if (selectedCategory) {
      filtered = filtered.filter(q => q.category === selectedCategory)
    }
    
    // Sort pinned first, then popular, then by date
    return filtered.sort((a, b) => {
      if (a.isPinned && !b.isPinned) return -1
      if (!a.isPinned && b.isPinned) return 1
      if (a.isPopular && !b.isPopular) return -1
      if (!a.isPopular && b.isPopular) return 1
      return b.askedAt.getTime() - a.askedAt.getTime()
    })
  }, [data.questions, searchQuery, selectedCategory])
  
  if (!data.allowQuestions) {
    return (
      <Card className={className}>
        <CardContent className="p-8 text-center">
          <HelpCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">Q&A is not available for this creator</p>
        </CardContent>
      </Card>
    )
  }
  
  if (variant === "accordion") {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <HelpCircle className="h-5 w-5" />
            Frequently Asked Questions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            {filteredQuestions.filter(q => q.answer).map((question, index) => (
              <AccordionItem key={question.id} value={`item-${index}`}>
                <AccordionTrigger className="text-left">
                  {question.question}
                </AccordionTrigger>
                <AccordionContent>
                  <p className="text-gray-600 dark:text-gray-400">
                    {question.answer}
                  </p>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>
    )
  }
  
  if (variant === "compact") {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="text-base">Q&A</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <QnAStats
            totalQuestions={data.totalQuestions}
            answeredQuestions={data.answeredQuestions}
          />
          <div className="space-y-2">
            {filteredQuestions.slice(0, 3).map((question) => (
              <div key={question.id} className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <p className="text-sm font-medium mb-1">{question.question}</p>
                {question.answer && (
                  <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2">
                    {question.answer}
                  </p>
                )}
              </div>
            ))}
          </div>
          <Button variant="outline" size="sm" className="w-full">
            View All Questions
          </Button>
        </CardContent>
      </Card>
    )
  }
  
  // Full variant (default)
  return (
    <div className={cn("space-y-6", className)}>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <HelpCircle className="h-5 w-5" />
            Q&A with {creatorName}
          </CardTitle>
          <CardDescription>
            Ask questions and get answers directly from the creator
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <QnAStats
            totalQuestions={data.totalQuestions}
            answeredQuestions={data.answeredQuestions}
          />
          
          <AskQuestionForm
            categories={data.categories}
            onSubmit={onQuestionSubmit || (() => {})}
          />
          
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1">
              <QnASearch onSearch={setSearchQuery} />
            </div>
            
            {data.categories && data.categories.length > 0 && (
              <div className="flex gap-2 flex-wrap">
                <Badge
                  variant={selectedCategory === null ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => setSelectedCategory(null)}
                >
                  All
                </Badge>
                {data.categories.map((cat) => (
                  <Badge
                    key={cat}
                    variant={selectedCategory === cat ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => setSelectedCategory(cat)}
                  >
                    {cat}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      
      {/* Questions list */}
      <div className="space-y-3">
        {filteredQuestions.length > 0 ? (
          filteredQuestions.map((question) => (
            <QuestionCard
              key={question.id}
              question={question}
              onUpvote={onQuestionUpvote}
              onAnswer={onAnswerSubmit}
              isCreator={false} // This would be determined by user context
            />
          ))
        ) : (
          <Card>
            <CardContent className="p-8 text-center">
              <HelpCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">
                {searchQuery 
                  ? "No questions match your search"
                  : "No questions yet. Be the first to ask!"
                }
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}