import React, { useState, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import { Helmet } from "react-helmet-async";
import {
  submitCustomizationRequest,
  resetStatus,
} from "@/lib/features/customization/customizationSlice";
import { fetchVideos, fetchTopics } from "@/lib/features/videos/videoSlice";
import RequestPageLayout from "../components/RequestPageLayout";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { Loader2, PlayCircle, X, ShoppingCart } from "lucide-react"; // ✨ ShoppingCart आइकन इम्पोर्ट करें
import YouTube from "react-youtube";
import { Link } from "react-router-dom"; // ✨ Link को इम्पोर्ट करें
import { Button } from "@/components/ui/button"; // ✨ Button को इम्पोर्ट करें

export const formStyles = {
  label: "block text-sm font-semibold mb-2 text-gray-700",
  input:
    "w-full p-3 bg-gray-100 border-2 border-transparent rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition",
  select:
    "w-full p-3 bg-gray-100 border-2 border-transparent rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition",
  textarea:
    "w-full p-3 bg-gray-100 border-2 border-transparent rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition",
  fileInput:
    "w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100",
};

const VideoModal = ({ videoId, onClose }) => {
  if (!videoId) return null;

  const opts = {
    height: "100%",
    width: "100%",
    playerVars: {
      autoplay: 1,
      controls: 1,
    },
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl aspect-video bg-black rounded-lg shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute -top-3 -right-3 h-10 w-10 bg-white rounded-full flex items-center justify-center text-gray-700 hover:bg-gray-200 z-10"
          aria-label="Close video player"
        >
          <X size={24} />
        </button>
        <YouTube videoId={videoId} opts={opts} className="w-full h-full" />
      </div>
    </div>
  );
};

const ThreeDWalkthroughPage = () => {
  const dispatch = useDispatch();
  const { actionStatus, error } = useSelector((state) => state.customization);
  const [formKey, setFormKey] = useState(Date.now());

  const {
    videos,
    topics,
    listStatus: videoListStatus,
  } = useSelector((state) => state.videos);
  const [selectedTopic, setSelectedTopic] = useState("All");

  const [playingVideoId, setPlayingVideoId] = useState(null);

  useEffect(() => {
    dispatch(fetchVideos());
    dispatch(fetchTopics());
  }, [dispatch]);

  const handleSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    formData.append("requestType", "3D Video Walkthrough");
    dispatch(submitCustomizationRequest(formData));
  };

  useEffect(() => {
    if (actionStatus === "succeeded") {
      toast.success(
        "Request submitted successfully! Our team will contact you shortly."
      );
      dispatch(resetStatus());
      setFormKey(Date.now());
    }
    if (actionStatus === "failed") {
      toast.error(String(error) || "Submission failed. Please try again.");
      dispatch(resetStatus());
    }
  }, [actionStatus, error, dispatch]);

  const filteredVideos = useMemo(() => {
    if (!videos || videos.length === 0) return [];
    if (selectedTopic === "All") {
      return videos;
    }
    return videos.filter((video) => video.topic === selectedTopic);
  }, [videos, selectedTopic]);

  const thumbnailOptions = (videoId) => ({
    height: "100%",
    width: "100%",
    playerVars: {
      autoplay: 0,
      controls: 0,
      showinfo: 0,
      modestbranding: 1,
      rel: 0,
      fs: 0,
      iv_load_policy: 3,
    },
  });

  return (
    <>
      <Helmet>
        <title>
          3D Elevation & Video Walkthrough | Interactive Home Designs
        </title>
        <meta
          name="description"
          content="Explore stunning 3D elevations and immersive video walkthroughs to visualize your dream home. Experience detailed designs and interactive tours for the perfect house plan."
        />
      </Helmet>

      <VideoModal
        videoId={playingVideoId}
        onClose={() => setPlayingVideoId(null)}
      />

      <Navbar />
      <form key={formKey} onSubmit={handleSubmit}>
        <RequestPageLayout
          title="Request a 3D Video Walkthrough"
          imageUrl="https://images.pexels.com/photos/1732414/pexels-photo-1732414.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
          imageAlt="Example of a 3D house walkthrough"
          isLoading={actionStatus === "loading"}
        >
          <div>
            <label htmlFor="name" className={formStyles.label}>
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              className={formStyles.input}
              required
            />
          </div>
          <div>
            <label htmlFor="email" className={formStyles.label}>
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              className={formStyles.input}
              required
            />
          </div>
          <div>
            <label htmlFor="whatsappNumber" className={formStyles.label}>
              WhatsApp Number
            </label>
            <input
              type="tel"
              id="whatsappNumber"
              name="whatsappNumber"
              className={formStyles.input}
              required
            />
          </div>
          <div>
            <label htmlFor="country" className={formStyles.label}>
              Country
            </label>
            <input
              type="text"
              id="country"
              name="country"
              className={formStyles.input}
              defaultValue="India"
              required
            />
          </div>
          <div>
            <label htmlFor="projectScope" className={formStyles.label}>
              Project Scope (e.g., Number of Floors)
            </label>
            <input
              type="text"
              id="projectScope"
              name="projectScope"
              className={formStyles.input}
              placeholder="e.g., G+1, 2000 sqft"
              required
            />
          </div>
          <div>
            <label htmlFor="description" className={formStyles.label}>
              Describe your Vision
            </label>
            <textarea
              id="description"
              name="description"
              placeholder="e.g., I want to showcase the flow from the living room..."
              className={formStyles.textarea}
              rows={4}
            ></textarea>
          </div>
          <div>
            <label className={formStyles.label}>
              Upload Existing Plans (Optional)
            </label>
            <input
              type="file"
              name="referenceFile"
              className={formStyles.fileInput}
            />
          </div>
        </RequestPageLayout>
      </form>
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-4xl font-bold text-gray-900">
              Our 3D Walkthrough Portfolio
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Explore our collection of 3D video walkthroughs.
            </p>
          </div>
          <div className="mt-10 flex justify-center">
            <div className="w-full max-w-md">
              <select
                value={selectedTopic}
                onChange={(e) => setSelectedTopic(e.target.value)}
                className={formStyles.select}
                aria-label="Filter videos by topic"
              >
                <option value="All">All Topics</option>
                {topics.map((topic) => (
                  <option key={topic} value={topic}>
                    {topic}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="mt-12">
            {videoListStatus === "loading" ? (
              <div className="flex justify-center p-8">
                <Loader2 className="h-10 w-10 animate-spin text-orange-500" />
              </div>
            ) : filteredVideos.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 rounded-xl">
                <p className="text-gray-500">No videos found for this topic.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredVideos.map((video) => (
                  <div
                    key={video._id}
                    className="group flex flex-col bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
                  >
                    <div
                      className="relative aspect-video bg-gray-900 cursor-pointer"
                      onClick={() => setPlayingVideoId(video.youtubeVideoId)}
                    >
                      {video.youtubeVideoId ? (
                        <>
                          <YouTube
                            videoId={video.youtubeVideoId}
                            opts={thumbnailOptions(video.youtubeVideoId)}
                            className="absolute top-0 left-0 w-full h-full"
                            iframeClassName="pointer-events-none"
                          />
                          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <PlayCircle className="h-16 w-16 text-white text-opacity-80" />
                          </div>
                        </>
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-500">
                          Invalid Video Link
                        </div>
                      )}
                    </div>
                    <div className="p-4 flex flex-col flex-grow">
                      <span className="text-xs bg-orange-100 text-orange-800 font-semibold px-2 py-1 rounded-full self-start">
                        {video.topic}
                      </span>
                      <h3
                        className="font-bold text-base mt-2 truncate text-gray-800"
                        title={video.title}
                      >
                        {video.title}
                      </h3>
                      <button
                        onClick={() => setPlayingVideoId(video.youtubeVideoId)}
                        className="text-sm text-orange-600 hover:underline mt-1 inline-block text-left"
                      >
                        Watch Video
                      </button>

                      {/* ✨ यहाँ Buy Now का बटन जोड़ा गया है ✨ */}
                      <div className="mt-auto pt-4">
                        <Link to="/products" className="w-full block">
                          <Button className="w-full bg-orange-500 hover:bg-orange-600">
                            <ShoppingCart className="mr-2 h-4 w-4" />
                            Buy Now
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ThreeDWalkthroughPage;
