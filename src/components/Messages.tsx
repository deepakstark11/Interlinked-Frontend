import React, { useContext, useState } from 'react';
import { AuthContext } from './AuthContext';
import '../styles/Messages.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane, faSearch } from '@fortawesome/free-solid-svg-icons';

// Mock data for conversations
// TODO: Replace with API calls to fetch actual conversations when backend is ready
// Example API endpoints:
// - GET /api/conversations - Fetch all conversations for the current user
// - GET /api/conversations/:id/messages - Fetch messages for a specific conversation
// - POST /api/conversations/:id/messages - Send a new message
const mockConversations = [
  {
    id: 1,
    name: 'John Parker',
    role: 'Fire Chief',
    avatar: '/interlinkedlogo.jpg', // Using existing logo as placeholder
    lastMessage: 'I need an update on the current situation.',
    timestamp: '10:30 AM',
    unread: 2,
  },
  {
    id: 2,
    name: 'Sarah Wilson',
    role: 'Department Manager',
    avatar: '/interlinkedlogo.jpg',
    lastMessage: 'The team is ready for deployment.',
    timestamp: 'Yesterday',
    unread: 0,
  },
  {
    id: 3,
    name: 'Michael Rodriguez',
    role: 'Field Officer',
    avatar: '/interlinkedlogo.jpg',
    lastMessage: 'We have new data regarding the east sector.',
    timestamp: 'Jul 15',
    unread: 1,
  },
  {
    id: 4,
    name: 'Emergency Response Team',
    role: 'Team Chat',
    avatar: '/interlinkedlogo.jpg',
    lastMessage: 'Meeting scheduled for tomorrow at 9 AM.',
    timestamp: 'Jul 13',
    unread: 0,
  },
  {
    id: 5,
    name: 'Laura Chen',
    role: 'Logistics Coordinator',
    avatar: '/interlinkedlogo.jpg',
    lastMessage: 'Equipment delivery confirmed for Thursday.',
    timestamp: 'Jul 10',
    unread: 0,
  }
];

// Mock messages for a conversation
// TODO: Replace with API call to fetch messages when backend is ready
const mockMessages = [
  {
    id: 1,
    senderId: 1,
    text: 'I need an update on the current situation.',
    timestamp: '10:30 AM',
    isRead: true,
  },
  {
    id: 2,
    senderId: 'currentUser',
    text: 'We have contained 60% of the affected area. Teams are working on the east flank currently.',
    timestamp: '10:32 AM',
    isRead: true,
  },
  {
    id: 3,
    senderId: 1,
    text: 'That\'s good progress. What resources do you need?',
    timestamp: '10:35 AM',
    isRead: true,
  },
  {
    id: 4,
    senderId: 'currentUser',
    text: 'We could use two more water tankers and an additional team for the north sector.',
    timestamp: '10:38 AM',
    isRead: true,
  },
  {
    id: 5,
    senderId: 1,
    text: 'I\'ll coordinate with logistics to get those resources to you ASAP.',
    timestamp: '10:40 AM',
    isRead: false,
  },
];

const Messages: React.FC = () => {
  const auth = useContext(AuthContext);
  const [selectedConversation, setSelectedConversation] = useState<number | null>(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [newMessage, setNewMessage] = useState('');

  // Filter conversations based on search term
  const filteredConversations = mockConversations.filter(conversation =>
    conversation.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    conversation.lastMessage.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // TODO: Implement these functions when integrating with backend
  // const fetchConversations = async () => {
  //   try {
  //     const response = await fetch('/api/conversations');
  //     const data = await response.json();
  //     // Update state with conversation data
  //   } catch (error) {
  //     console.error('Error fetching conversations:', error);
  //   }
  // };
  
  // const fetchMessages = async (conversationId: number) => {
  //   try {
  //     const response = await fetch(`/api/conversations/${conversationId}/messages`);
  //     const data = await response.json();
  //     // Update state with message data
  //   } catch (error) {
  //     console.error('Error fetching messages:', error);
  //   }
  // };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim() === '') return;
    
    // TODO: Implement sending message to backend
    // Example implementation:
    // try {
    //   await fetch(`/api/conversations/${selectedConversation}/messages`, {
    //     method: 'POST',
    //     headers: {
    //       'Content-Type': 'application/json',
    //     },
    //     body: JSON.stringify({ text: newMessage }),
    //   });
    //   // On success, refresh messages
    //   // fetchMessages(selectedConversation);
    // } catch (error) {
    //   console.error('Error sending message:', error);
    // }
    
    // For now, we'll just clear the input
    setNewMessage('');
  };

  return (
    <div className="messages-container">
      <div className="messages-sidebar">
        <div className="messages-search">
          <div className="search-input-container">
            <FontAwesomeIcon icon={faSearch} className="search-icon" />
            <input
              type="text"
              placeholder="Search conversations"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <div className="conversations-list">
          {filteredConversations.map(conversation => (
            <div
              key={conversation.id}
              className={`conversation-item ${selectedConversation === conversation.id ? 'selected' : ''}`}
              onClick={() => setSelectedConversation(conversation.id)}
            >
              <div className="conversation-avatar">
                <img src={conversation.avatar} alt={conversation.name} />
              </div>
              <div className="conversation-info">
                <div className="conversation-header">
                  <h3>{conversation.name}</h3>
                  <span className="timestamp">{conversation.timestamp}</span>
                </div>
                <div className="conversation-subheader">
                  <span className="role">{conversation.role}</span>
                  {conversation.unread > 0 && (
                    <span className="unread-badge">{conversation.unread}</span>
                  )}
                </div>
                <p className="last-message">{conversation.lastMessage}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="messages-content">
        {selectedConversation ? (
          <>
            <div className="messages-header">
              {(() => {
                const convo = mockConversations.find(c => c.id === selectedConversation);
                return convo ? (
                  <>
                    <div className="selected-conversation-avatar">
                      <img src={convo.avatar} alt={convo.name} />
                    </div>
                    <div>
                      <h2>{convo.name}</h2>
                      <p className="selected-conversation-role">{convo.role}</p>
                    </div>
                  </>
                ) : null;
              })()}
            </div>

            <div className="messages-list">
              {mockMessages.map(message => (
                <div
                  key={message.id}
                  className={`message ${message.senderId === 'currentUser' ? 'sent' : 'received'}`}
                >
                  <div className="message-bubble">
                    <p>{message.text}</p>
                    <span className="message-timestamp">{message.timestamp}</span>
                  </div>
                </div>
              ))}
            </div>

            <form className="message-input" onSubmit={handleSendMessage}>
              <input
                type="text"
                placeholder="Type a message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
              />
              <button type="submit" className="send-button">
                <FontAwesomeIcon icon={faPaperPlane} />
              </button>
            </form>
          </>
        ) : (
          <div className="no-conversation-selected">
            <p>Select a conversation to start messaging</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Messages; 