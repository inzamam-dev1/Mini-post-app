import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './App.css';

const API_BASE = 'https://mini-post-app-1.onrender.com/api';

function App() {
  const [user, setUser] = useState(null);
  const [isLogin, setIsLogin] = useState(true);
  const [authData, setAuthData] = useState({ username: '', email: '', password: '' });
  
  // App States
  const [activeTab, setActiveTab] = useState('home'); // 'home' | 'search' | 'profile'
  const [posts, setPosts] = useState([]);
  const [text, setText] = useState('');
  const [image, setImage] = useState('');
  const [showLogout, setShowLogout] = useState(false);
  
  // Search States
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  // Comment States
  const [commentText, setCommentText] = useState({});
  const [visibleComments, setVisibleComments] = useState({});

  const fileInputRef = useRef(null);

  // --- INITIAL LOAD ---
  const fetchPosts = async () => {
    try {
      const res = await axios.get(`${API_BASE}/posts`);
      setPosts(res.data);
    } catch (err) { console.error("Error fetching", err); }
  };
  useEffect(() => { fetchPosts(); }, []);

  // --- AUTH HANDLERS ---
  const handleAuth = async (e) => {
    e.preventDefault();
    const endpoint = isLogin ? 'auth/login' : 'auth/signup';
    try {
      const res = await axios.post(`${API_BASE}/${endpoint}`, authData);
      setUser(res.data);
    } catch (err) { alert(err.response?.data?.message || "Auth Failed"); }
  };

  const handleLogout = () => { setUser(null); setShowLogout(false); };

  // --- SEARCH HANDLER ---
  const handleSearch = async (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    if (query.length > 1) {
      try {
        const res = await axios.get(`${API_BASE}/users/search?q=${query}`);
        setSearchResults(res.data);
      } catch (err) { console.error(err); }
    } else {
      setSearchResults([]);
    }
  };

  // --- POST & INTERACTION HANDLERS ---
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImage(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handlePost = async () => {
    if (!text && !image) return;
    try {
      await axios.post(`${API_BASE}/posts`, {
        author: user._id,
        authorName: user.username,
        text, image
      });
      setText(''); setImage(''); fetchPosts();
    } catch (err) { alert("Post failed! Image might be too large."); }
  };

  const handleLike = async (postId) => {
    try { await axios.post(`${API_BASE}/posts/${postId}/like`, { userId: user._id }); fetchPosts(); } catch (err) {}
  };

  const handleCommentSubmit = async (postId) => {
    const content = commentText[postId];
    if (!content) return;
    try {
      await axios.post(`${API_BASE}/posts/${postId}/comment`, { username: user.username, text: content });
      setCommentText(prev => ({ ...prev, [postId]: '' })); fetchPosts();
    } catch (err) {}
  };

  // --- RENDER ---
  if (!user) {
    return (
      <div className="auth-container">
        <div className="auth-card">
          <h1 className="brand-logo">Social App</h1>
          <form onSubmit={handleAuth}>
            {!isLogin && <input type="text" placeholder="Username" required onChange={(e) => setAuthData({...authData, username: e.target.value})} />}
            <input type="email" placeholder="Email" required onChange={(e) => setAuthData({...authData, email: e.target.value})} />
            <input type="password" placeholder="Password" required onChange={(e) => setAuthData({...authData, password: e.target.value})} />
            <button type="submit" className="auth-btn">{isLogin ? "Log In" : "Sign Up"}</button>
          </form>
          <p onClick={() => setIsLogin(!isLogin)} className="toggle-link">{isLogin ? "Create Account" : "Back to Login"}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="App">
      <header className="app-header">
        <div className="header-title">Social</div>
        <div className="header-right">
          <div className="user-profile-icon" onClick={() => setShowLogout(!showLogout)}>
            {user.username.charAt(0).toUpperCase()}
          </div>
          {showLogout && <div className="logout-dropdown"><button onClick={handleLogout}>Logout</button></div>}
        </div>
      </header>

      {/* --- HOME TAB CONTENT --- */}
      {activeTab === 'home' && (
        <>
          <div className="create-post-card">
            <div className="cp-header"><span className="cp-title">Create Post</span></div>
            <textarea className="cp-input-area" placeholder="What's on your mind?" value={text} onChange={(e) => setText(e.target.value)} rows={2} />
            {image && <div className="image-preview-container"><img src={image} alt="Preview" className="image-preview" /><button onClick={() => setImage('')} className="remove-img-btn">X</button></div>}
            <div className="cp-actions">
              <span className="cp-icons" onClick={() => fileInputRef.current.click()}>📷</span>
              <input type="file" ref={fileInputRef} style={{display: 'none'}} accept="image/*" onChange={handleImageUpload} />
              <button className="post-btn" onClick={handlePost} disabled={!text && !image}>Post</button>
            </div>
          </div>

          <div className="feed-container">
            {posts.map((post) => (
              <div key={post._id} className="feed-card">
                <div className="card-header">
                  <div className="user-avatar"></div>
                  <div className="user-info"><h4>{post.authorName}</h4><span>{new Date(post.createdAt).toLocaleTimeString()}</span></div>
                </div>
                {post.text && <p className="post-text">{post.text}</p>}
                {post.image && <img src={post.image} alt="Post" className="post-image" />}
                <div className="post-stats"><span>{post.likes.length} Likes</span><span>{post.comments.length} Comments</span></div>
                <div className="action-buttons">
                  <div className={`action-btn ${post.likes.includes(user._id) ? 'active-like' : ''}`} onClick={() => handleLike(post._id)}>{post.likes.includes(user._id) ? '💙 Liked' : '🤍 Like'}</div>
                  <div className="action-btn" onClick={() => setVisibleComments(prev => ({ ...prev, [post._id]: !prev[post._id] }))}>💬 Comment</div>
                </div>
                {visibleComments[post._id] && (
                  <div className="comment-section">
                    {post.comments.map((c, i) => <div key={i} className="comment-item"><strong>{c.username}</strong> {c.text}</div>)}
                    <div className="add-comment-row">
                      <input placeholder="Write a comment..." value={commentText[post._id] || ''} onChange={(e) => setCommentText({...commentText, [post._id]: e.target.value})} onKeyDown={(e) => e.key === 'Enter' && handleCommentSubmit(post._id)} />
                      <button onClick={() => handleCommentSubmit(post._id)}>Send</button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </>
      )}

      {/* --- SEARCH TAB CONTENT --- */}
      {activeTab === 'search' && (
        <div className="search-container">
          <div className="search-bar-wrapper">
            <span className="search-icon">🔍</span>
            <input 
              type="text" 
              placeholder="Search for people..." 
              value={searchQuery}
              onChange={handleSearch}
              autoFocus
            />
          </div>
          
          <div className="search-results">
            {searchQuery && searchResults.length === 0 ? (
              <p className="no-results">No users found.</p>
            ) : (
              searchResults.map(u => (
                <div key={u._id} className="user-result-card">
                  <div className="user-avatar-small">{u.username.charAt(0).toUpperCase()}</div>
                  <div className="user-result-info">
                    <h4>{u.username}</h4>
                    <span>User</span>
                  </div>
                  <button className="follow-btn-small">Follow</button>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* --- BOTTOM NAV --- */}
      <div className="bottom-nav">
        <div className={`nav-item ${activeTab === 'home' ? 'active' : ''}`} onClick={() => setActiveTab('home')}>🏠</div>
        <div className={`nav-item ${activeTab === 'search' ? 'active' : ''} ` } onClick={() => setActiveTab('search')}>🔍</div>
        <div className="nav-item">🏆</div>
        <div className="nav-item">👤</div>
      </div>
    </div>
  );
}

export default App;