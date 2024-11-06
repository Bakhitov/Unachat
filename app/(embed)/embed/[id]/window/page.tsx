import ChatWindow from '@/app/(dashboard)/dashboard/chatbots/[chatbotId]/chat/chatWindow/page'

export interface ChatComponentProps {
  params: { id: string }
  searchParams: Record<string, string>
}

export default function Chat({ params, searchParams }: ChatComponentProps) {
  console.log('Chat window params:', params, searchParams)

  return (
    <ChatWindow 
      params={{ 
        chatbotId: params.id, 
        withExitX: searchParams.withExitX === 'true',
        clientSidePrompt: searchParams.clientSidePrompt || '',
        defaultMessage: searchParams.defaultMessage || ''
      }} 
    />
  )
}
