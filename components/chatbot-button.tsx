'use client'

import { Icons } from './icons'
import { useState, useEffect } from 'react'

export interface ChatbotButtonComponentProps {
    textColor: string
    backgroundColor: string
}

export default function ChatbotButton({ textColor, backgroundColor }: ChatbotButtonComponentProps) {
    const [isChatVisible, setIsChatVisible] = useState(false)
    const [animate, setAnimate] = useState(false)

    useEffect(() => {
        const handleMessage = (event: MessageEvent) => {
            if (event.data === 'openChat') {
                console.log('Toggle chat visibility')
                setIsChatVisible(true)
            }

            if (event.data === 'closeChat') {
                setIsChatVisible(false)
            }
        }

        window.addEventListener('message', handleMessage)
        
        const hasScrollbar = document.body.scrollHeight > document.documentElement.clientHeight
        window.parent.postMessage({ type: 'checkScrollbar', hasScrollbar: hasScrollbar }, '*')

        return () => {
            window.removeEventListener('message', handleMessage)
        }
    }, [])

    function toggleChatVisibility() {
        setAnimate(true)
        setIsChatVisible(!isChatVisible)

        if (!isChatVisible) {
            window.parent.postMessage('openChat', '*')
        } else {
            window.parent.postMessage('closeChat', '*')
        }

        setTimeout(() => {
            setAnimate(false)
        }, 300)
    }

    return (
        <div 
            className="absolute top-0 left-0 bg-black w-14 h-14 rounded-full cursor-pointer backface-hidden overflow-hidden" 
            style={{ background: backgroundColor }}
        >
            <button 
                className={`user-select-none flex items-center justify-center absolute top-0 bottom-0 w-full transition-transform duration-300 ${animate ? 'scale-125' : ''}`}
                onClick={toggleChatVisibility}
            >
                {!isChatVisible && <Icons.message height={24} width={24} style={{ color: textColor }} />}
                {isChatVisible && <Icons.close style={{ color: textColor }} />}
            </button>
        </div>
    )
}
