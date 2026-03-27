import React, { useState } from 'react'
import { Search } from 'lucide-react'
import { chatService } from '../../services/chatService'
import { useChatStore } from '../../stores/chatStore'

const SearchBar: React.FC = () => {
    const [query, setQuery] = useState('')
    const [results, setResults] = useState<any[]>([])
    const [isSearching, setIsSearching] = useState(false)

    const { setSelectedConversation, conversations, setConversations } = useChatStore()

    const handleSearch = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value
        setQuery(val)

        if (val.trim().length > 0) {
            setIsSearching(true)
            try {
                const res = await chatService.searchUsers(val)
                if (res.success) {
                    setResults(res.users)
                }
            } catch (err) {
                console.error(err)
            }
        } else {
            setIsSearching(false)
            setResults([])
        }
    }

    const handleStartChat = async (userId: string) => {
        try {
            const res = await chatService.createConversation(userId)
            if (res.success) {
                const newConv = res.conversation

                const exists = conversations.find(c => c._id === newConv._id)
                if (!exists) {
                    const allConvsRes = await chatService.getConversations()
                    if (allConvsRes.success) {
                        setConversations(allConvsRes.conversations)
                        const populatedNewConv = allConvsRes.conversations.find((c: any) => c._id === newConv._id)
                        if (populatedNewConv) setSelectedConversation(populatedNewConv)
                    }
                } else {
                    setSelectedConversation(exists)
                }

                setQuery('')
                setIsSearching(false)
            }
        } catch (err) {
            console.error('Failed to start chat', err)
        }
    }

    return (
        <div className="p-4 border-b border-gray-200 relative">
            <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                    type="text"
                    value={query}
                    onChange={handleSearch}
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-gray-50 placeholder-gray-500 focus:outline-none focus:bg-white focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-colors"
                    placeholder="Search users to chat..."
                />
            </div>

            {isSearching && results.length > 0 && (
                <div className="absolute z-10 w-full left-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto">
                    {results.map(user => (
                        <div
                            key={user._id}
                            onClick={() => handleStartChat(user._id)}
                            className="p-3 hover:bg-gray-100 cursor-pointer border-b border-gray-100 flex items-center gap-3"
                        >
                            <div className="w-8 h-8 bg-indigo-100 text-indigo-700 rounded-full flex items-center justify-center font-bold">
                                {user.fullName.charAt(0).toUpperCase()}
                            </div>
                            <div>
                                <div className="text-sm font-medium text-gray-900">{user.fullName}</div>
                                <div className="text-xs text-gray-500">@{user.username}</div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

export default SearchBar
