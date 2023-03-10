import React, { useState } from "react";
import axios from "axios";


function App() {
  const [inputValue, setInputValue] = useState("");
  const [story, setStory] = useState("");
  const [image, setImage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "https://api.openai.com/v1/engines/davinci-codex/completions",
        {
          prompt: `${inputValue}. Once upon a time`,
          max_tokens: 60,
          n: 1,
          stop: ".",
        },
        {
          headers: {
            Authorization: `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`,
            "Content-Type": "application/json",
          },
        }
      );

      const storyText = response.data.choices[0].text.trim();
      setStory(storyText);

      try {
        const imageResponse = await axios.post(
          "https://api.openai.com/v1/images/generations",
          {
            model: "image-alpha-001",
            prompt: `${storyText}`,
            num_images: 1,
            size: "1024x1024",
            response_format: "url",
          },
          {
            headers: {
              Authorization: `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`,
              "Content-Type": "application/json",
            },
          }
        );

        const imageUrl = imageResponse.data.data[0].url;
        setImage(imageUrl);
      } catch (error) {
        console.log(error);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="container">
      <h1>AI Storyteller</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="storyPrompt">Enter a story prompt or keywords:</label>
        <br />
        <input
          type="text"
          id="storyPrompt"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />
        <br />
        <button type="submit">Generate Story</button>
      </form>
      {story && (
        <div className="story">
          <h2>Story:</h2>
          <p>{story}</p>
          {image && (
  <div className="image">
    <img src={image} alt="Generated by DALL-E" style={{ maxWidth: "100%" }} />
  </div>
)}
        </div>
      )}
    </div>
  );
}

export default App;
