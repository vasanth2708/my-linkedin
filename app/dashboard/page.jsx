"use client";
import React, { useState, useEffect } from 'react';
import { ClerkProvider, useUser } from '@clerk/nextjs'; 

const DashboardPage = () => {
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState('');
  const [newImage, setNewImage] = useState(null);

  const { isSignedIn, user } = useUser(); 

  const postToLinkedIn = async () => {
    if (!isSignedIn) {
      console.error('User is not logged in. Please sign in first.');
      return; 
    }

    const accessToken = "";
    const url = 'https://api.linkedin.com/v2/ugcPosts';
    const headers = {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
      'X-Restli-Protocol-Version': '2.0.0',
    };

    const body = JSON.stringify({
      "author": "urn:li:person:3j7tckflVK",
      "lifecycleState": "PUBLISHED",
      "specificContent": {
        "com.linkedin.ugc.ShareContent": {
          "shareCommentary": {
            "text": newPost
          },
          "shareMediaCategory": newImage ? "IMAGE" : "NONE"
        }
      },
      "visibility": {
        "com.linkedin.ugc.MemberNetworkVisibility": "PUBLIC"
      }
    });

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: headers,
        body: body,
      });

      if (response.ok) {
        console.log('Post successful!');
        const postData = await response.json();
        setPosts([...posts, postData]);
      } else {
        throw new Error('Failed to post to LinkedIn');
      }
    } catch (error) {
      console.error('Error posting to LinkedIn:', error);
    }
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      setNewImage(reader.result);
    };
    reader.readAsDataURL(file);
  };

  return (
      <div className="container mx-auto px-4">
        <h1 className="text-2xl font-bold mb-5">Dashboard</h1>
        <p className="mb-5">Welcome to the Dashboard</p>
        <div>
          <textarea
            value={newPost}
            onChange={(e) => setNewPost(e.target.value)}
            placeholder="What's on your mind?"
            className="border p-2 mb-2 w-full"
          />
          <input type="file" onChange={handleImageChange} className="mb-2" />
          <button onClick={postToLinkedIn} className="bg-blue-500 text-white p-2">Post to LinkedIn</button>
        </div>
        <div className="mt-5">
          <h2 className="text-xl font-bold mb-3">Posts</h2>
          {posts.map((post, index) => (
            <div key={index} className="border p-2 mb-2">
              <p>{post.text}</p>
              {post.specificContent?.com.linkedin.ugc.ShareContent?.shareMediaArray?.[0]?.mediaReference?.mediaUrl && ( // Check for image existence
                <img
                  src={post.specificContent.com.linkedin.ugc.ShareContent.shareMediaArray[0].mediaReference.mediaUrl}
                  alt="Post visual"
                  style={{ maxWidth: '200px' }}
                />
              )}
            </div>
          ))}
        </div>
      </div>
  );
};

export default DashboardPage;
