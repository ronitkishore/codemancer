"use client";
import { useState } from "react";

export default function LinkRepository() {
  const [repositoryUrl, setRepositoryUrl] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch("/api/linkRepository", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ repositoryUrl }),
      });

      if (response.ok) {
        setRepositoryUrl("");
        // Redirect to the main page or show a success message
        // TODO: Implement the desired behavior
      } else {
        // Handle error case
        console.error("Failed to link repository");
      }
    } catch (error) {
      console.error("Error linking repository:", error);
    }
  };

  return (
    <div>
      <h1>Link Repository</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Repository URL:
          <input
            type="text"
            value={repositoryUrl}
            onChange={(e) => setRepositoryUrl(e.target.value)}
          />
        </label>
        <button type="submit">Link Repository</button>
      </form>
    </div>
  );
}
