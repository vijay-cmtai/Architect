// src/pages/admin/VideoUploadPage.jsx
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import {
  fetchVideos,
  fetchTopics,
  addVideoLink,
  deleteVideo,
  resetActionStatus,
} from "@/lib/features/videos/videoSlice";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Trash2, Link as LinkIcon } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const VideoUploadPage = () => {
  const dispatch = useDispatch();
  const { videos, topics, listStatus, actionStatus, error } = useSelector(
    (state) => state.videos
  );
  const { userInfo } = useSelector((state) => state.user);

  const [title, setTitle] = useState("");
  const [youtubeLink, setYoutubeLink] = useState("");
  const [topic, setTopic] = useState("");

  useEffect(() => {
    if (userInfo?.isAdmin) {
      dispatch(fetchVideos());
      dispatch(fetchTopics());
    }
  }, [dispatch, userInfo]);

  useEffect(() => {
    if (actionStatus === "succeeded") {
      toast.success("Action completed successfully!");
      dispatch(resetActionStatus());
    }
    if (actionStatus === "failed") {
      toast.error(error || "An error occurred.");
      dispatch(resetActionStatus());
    }
  }, [actionStatus, error, dispatch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title || !youtubeLink || !topic) {
      return toast.error("Please provide a Title, YouTube Link, and Topic.");
    }
    dispatch(addVideoLink({ title, youtubeLink, topic })).then(() => {
      setTitle("");
      setYoutubeLink("");
      setTopic("");
      dispatch(fetchTopics());
    });
  };

  const handleDelete = (videoId) => {
    if (window.confirm("Are you sure you want to delete this video link?")) {
      dispatch(deleteVideo(videoId));
    }
  };

  // Custom styles defined here to keep the code clean
  const formStyles = {
    label: "block text-sm font-medium text-gray-700 mb-2",
    input:
      "w-full px-4 py-3 bg-[#F0F5F7] border-transparent rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition",
    button:
      "bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-lg px-6 py-3 flex items-center justify-center",
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#F0F5F7]">
      <main className="flex-grow w-full max-w-5xl mx-auto py-10 px-4">
        <h1 className="text-4xl font-bold mb-8 text-[#1E2A3B]">
          Manage Video Links
        </h1>

        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 mb-10">
          <h2 className="text-2xl font-semibold mb-6 text-[#1E2A3B]">
            Add New Video Link
          </h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="title" className={formStyles.label}>
                Title
              </label>
              <Input
                id="title"
                type="text"
                placeholder="Enter a title for the video"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className={formStyles.input}
              />
            </div>
            <div>
              <label htmlFor="youtubeLink" className={formStyles.label}>
                YouTube Link
              </label>
              <Input
                id="youtubeLink"
                type="url"
                placeholder="https://www.youtube.com/watch?v=..."
                value={youtubeLink}
                onChange={(e) => setYoutubeLink(e.target.value)}
                required
                className={formStyles.input}
              />
            </div>
            <div>
              <label htmlFor="topic" className={formStyles.label}>
                Topic
              </label>
              <Input
                id="topic"
                type="text"
                placeholder="e.g., 3D Walkthrough, Vastu Tips"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                list="topic-suggestions"
                required
                className={formStyles.input}
              />
              <datalist id="topic-suggestions">
                {topics.map((t, i) => (
                  <option key={i} value={t} />
                ))}
              </datalist>
            </div>
            <Button
              type="submit"
              className={formStyles.button}
              disabled={actionStatus === "loading"}
            >
              {actionStatus === "loading" ? (
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              ) : (
                <LinkIcon className="mr-2 h-5 w-5" />
              )}
              Add Video Link
            </Button>
          </form>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-6 text-[#1E2A3B]">
            Added Video Links
          </h2>
          {listStatus === "loading" ? (
            <div className="flex justify-center p-12">
              <Loader2 className="h-10 w-10 animate-spin text-orange-500" />
            </div>
          ) : videos.length === 0 ? (
            // --- FIX IS HERE ---
            <div className="text-center py-12 bg-white rounded-xl border border-gray-200 shadow-sm">
              <p className="text-gray-500">
                No video links have been added yet.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {videos.map((video) => (
                // --- FIX IS HERE ---
                <div
                  key={video._id}
                  className="bg-white rounded-xl shadow-sm overflow-hidden relative group border border-gray-200 transition-shadow hover:shadow-lg"
                >
                  <div className="p-4">
                    {/* --- FIX IS HERE --- */}
                    <span className="text-xs bg-orange-100 text-orange-800 font-semibold px-2 py-1 rounded-full">
                      {video.topic}
                    </span>
                    <h3
                      className="font-bold text-base mt-2 truncate text-[#1E2A3B]"
                      title={video.title}
                    >
                      {video.title}
                    </h3>
                    <a
                      href={video.youtubeLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-orange-600 hover:underline mt-2 inline-block"
                    >
                      Watch Video
                    </a>
                  </div>
                  {/* --- FIX IS HERE --- */}
                  <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    {/* --- FIX IS HERE --- */}
                    <Button
                      variant="destructive"
                      size="icon"
                      className="h-9 w-9"
                      onClick={() => handleDelete(video._id)}
                    >
                      <Trash2 className="h-5 w-5" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default VideoUploadPage;
