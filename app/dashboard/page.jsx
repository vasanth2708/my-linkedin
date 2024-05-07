"use client"
import React, { useState } from 'react';

const DashboardPage = () => {
  // State to hold the list of posts and the current form data
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState("");
  const [newImage, setNewImage] = useState(null);

  // Function to handle form submission
  const handlePost = async () => {
    // Example function that posts to LinkedIn
    const postToLinkedIn = async () => {
      console.log("Posting to LinkedIn:", newPost);
      // Here you would normally use the LinkedIn API to post
    };

    await postToLinkedIn();

    // Add the new post to the local state to display in the UI
    setPosts([...posts, { text: newPost, image: newImage }]);
    setNewPost(""); // Reset the text input
    setNewImage(null); // Reset the image
  };

  // Function to handle image file input
  const handleImageChange = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      setNewImage(reader.result);
    };
    reader.readAsDataURL(file);
  };

  return (
    <>
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
        <button onClick={handlePost} className="bg-blue-500 text-white p-2">Post to LinkedIn</button>
      </div>
      <div className="mt-5">
        <h2 className="text-xl font-bold mb-3">Posts</h2>
        {posts.map((post, index) => (
          <div key={index} className="border p-2 mb-2">
            <p>{post.text}</p>
            {post.image && <img src={post.image} alt="Post visual" style={{maxWidth: '200px'}} />}
          </div>
        ))}
      </div>
    </>
  );
};

export default DashboardPage;