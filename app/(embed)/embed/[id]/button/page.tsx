import ChatbotButton from '@/components/chatbot-button'
import { db } from '@/lib/db'
import { notFound } from 'next/navigation'

export interface ChatComponentProps {
  params: { id: string }
}

export default async function Button({ params }: ChatComponentProps) {
  const chatbot = await db.chatbot.findUnique({
    where: {
      id: params.id
    }
  })

  if (!chatbot) {
    return notFound()
  }

  return (
    <ChatbotButton 
      textColor={chatbot.bubbleTextColor} 
      backgroundColor={chatbot.bubbleColor} 
    />
  )
}
