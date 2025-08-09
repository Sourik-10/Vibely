import { useState, useEffect } from "react";
import useAuthUser from "../hooks/useAuthUser";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { completeOnboarding } from "../lib/api";
import {
  LoaderIcon,
  MapPin,
  CameraIcon,
  ShuffleIcon,
  Sparkles,
  Upload,
  X,
} from "lucide-react";
import { LANGUAGES } from "../constants";
import ProfileImage from "../components/ProfileImage";

const OnboardingPage = () => {
  const { authUser } = useAuthUser();
  const queryClient = useQueryClient();

  const [formState, setFormState] = useState({
    fullName: "",
    bio: "",
    nativeLanguage: "",
    learningLanguage: "",
    location: "",
    profilePic: "",
  });

  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [previewImage, setPreviewImage] = useState("");

  // Update form state when authUser changes
  useEffect(() => {
    if (authUser) {
      setFormState({
        fullName: authUser.fullName || "",
        bio: authUser.bio || "",
        nativeLanguage: authUser.nativeLanguage || "",
        learningLanguage: authUser.learningLanguage || "",
        location: authUser.location || "",
        profilePic: authUser.profilePic || "",
      });
      setPreviewImage(authUser.profilePic || "");
    }
  }, [authUser]);

  const { mutate: onboardingMutation, isPending } = useMutation({
    mutationFn: completeOnboarding,
    onSuccess: () => {
      toast.success("Profile onboarded successfully");
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
    },

    onError: (error) => {
      toast.error(error.response.data.message);
    },
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Only upload if there's a new file selected
    if (selectedFile) {
      setIsUploading(true);
      try {
        const formData = new FormData();
        formData.append("profileImage", selectedFile);

        const response = await fetch(
          "http://localhost:5001/api/profile/upload-image",
          {
            method: "POST",
            body: formData,
            credentials: "include",
          }
        );

        if (response.ok) {
          const result = await response.json();
          // Update form state with the uploaded image URL
          setFormState((prev) => ({ ...prev, profilePic: result.profilePic }));
          setPreviewImage(result.profilePic);
          toast.success("Profile image uploaded successfully!");
        } else {
          const error = await response.json();
          toast.error(error.message || "Failed to upload image");
          return; // Don't proceed with onboarding if image upload fails
        }
      } catch (error) {
        toast.error("Error uploading image");
        console.error(error);
        return; // Don't proceed with onboarding if image upload fails
      } finally {
        setIsUploading(false);
      }
    }

    // Submit the onboarding form with the current form state
    // (which now includes either the uploaded image URL or generated avatar URL)
    onboardingMutation(formState);
  };

  const handleRandomAvatar = async () => {
    const randomAvatar = `https://api.dicebear.com/7.x/avataaars/svg?seed=${
      formState.fullName || "user"
    }&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf`;

    // Set preview immediately
    setPreviewImage(randomAvatar);
    setSelectedFile(null);

    // Save the generated avatar to Cloudinary
    try {
      setIsUploading(true);

      // Fetch the SVG from the URL and convert to blob
      const response = await fetch(randomAvatar);
      const svgBlob = await response.blob();

      // Create a file object from the blob
      const file = new File([svgBlob], "generated-avatar.svg", {
        type: "image/svg+xml",
      });

      // Upload to Cloudinary
      const formData = new FormData();
      formData.append("profileImage", file);

      const uploadResponse = await fetch(
        "http://localhost:5001/api/profile/upload-image",
        {
          method: "POST",
          body: formData,
          credentials: "include",
        }
      );

      if (uploadResponse.ok) {
        const result = await uploadResponse.json();
        // Update form state with the Cloudinary URL
        setFormState((prev) => ({ ...prev, profilePic: result.profilePic }));
        setPreviewImage(result.profilePic);
        toast.success("Random avatar generated and saved successfully!");
      } else {
        const error = await uploadResponse.json();
        toast.error(error.message || "Failed to save generated avatar");
        // Revert to the original avatar URL if upload fails
        setFormState((prev) => ({ ...prev, profilePic: randomAvatar }));
      }
    } catch (error) {
      console.error("Error saving generated avatar:", error);
      toast.error("Error saving generated avatar");
      // Revert to the original avatar URL if upload fails
      setFormState((prev) => ({ ...prev, profilePic: randomAvatar }));
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        // 5MB limit
        toast.error("File size must be less than 5MB");
        return;
      }
      if (!file.type.startsWith("image/")) {
        toast.error("Please select an image file");
        return;
      }

      setSelectedFile(file);

      // Create preview URL immediately
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageUrl = e.target.result;
        setFormState((prev) => ({ ...prev, profilePic: imageUrl }));
        setPreviewImage(imageUrl);
      };
      reader.onerror = (error) => {
        console.error("FileReader error:", error);
        toast.error("Error reading file");
      };
      reader.readAsDataURL(file);
    }
  };

  const removeSelectedFile = () => {
    setSelectedFile(null);
    // Reset to current profile pic or empty
    const resetImage = authUser?.profilePic || "";
    setFormState((prev) => ({ ...prev, profilePic: resetImage }));
    setPreviewImage(resetImage);
  };

  return (
    <div className="min-h-screen bg-base-100 flex items-center justify-center p-4">
      <div className="card bg-base-200 w-full max-w-3xl shadow-xl">
        <div className="card-body p-6 sm:p-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-center mb-6">
            Complete Your Profile
          </h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Loading overlay for image upload */}
            {isUploading && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-base-200 p-6 rounded-lg flex items-center gap-3">
                  <LoaderIcon className="animate-spin size-6" />
                  <span>Uploading image...</span>
                </div>
              </div>
            )}
            {/* PROFILE PIC CONTAINER */}
            <div className="flex flex-col items-center justify-center space-y-4">
              {/* IMAGE PREVIEW */}
              <div className="relative">
                <ProfileImage
                  src={previewImage}
                  alt="Profile Preview"
                  size="4xl"
                  fallbackIcon={CameraIcon}
                />
                {selectedFile && (
                  <button
                    type="button"
                    onClick={removeSelectedFile}
                    className="absolute -top-2 -right-2 bg-error text-error-content rounded-full p-1 hover:bg-error-focus"
                  >
                    <X className="size-4" />
                  </button>
                )}
              </div>

              {/* UPLOAD AND AVATAR BUTTONS */}
              <div className="flex flex-col sm:flex-row items-center gap-2">
                {/* File Upload */}
                <label className="btn btn-primary cursor-pointer">
                  <Upload className="size-4 mr-2" />
                  Upload Image
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                </label>

                {/* Generate Random Avatar BTN */}
                {/* <button
                  type="button"
                  onClick={handleRandomAvatar}
                  className="btn btn-accent"
                >
                  <ShuffleIcon className="size-4 mr-2" />
                  Generate Avatar
                </button> */}
              </div>

              {/* File Info */}
              {selectedFile && (
                <div className="text-center">
                  <p className="text-sm text-success">
                    Selected: {selectedFile.name}
                  </p>
                  <p className="text-xs opacity-70">
                    {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              )}
            </div>

            {/* FULL NAME */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Full Name</span>
              </label>
              <input
                type="text"
                name="fullName"
                value={formState.fullName}
                onChange={(e) =>
                  setFormState((prev) => ({
                    ...prev,
                    fullName: e.target.value,
                  }))
                }
                className="input input-bordered w-full"
                placeholder="Your full name"
              />
            </div>

            {/* BIO */}
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text">Bio</span>
              </label>
              <textarea
                name="bio"
                value={formState.bio}
                onChange={(e) =>
                  setFormState((prev) => ({ ...prev, bio: e.target.value }))
                }
                className="textarea textarea-bordered w-full h-32 resize-none"
                placeholder="Tell others about yourself and your language learning goals"
              />
            </div>

            {/* LANGUAGES */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* NATIVE LANGUAGE */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Native Language</span>
                </label>
                <select
                  name="nativeLanguage"
                  value={formState.nativeLanguage}
                  onChange={(e) =>
                    setFormState((prev) => ({
                      ...prev,
                      nativeLanguage: e.target.value,
                    }))
                  }
                  className="select select-bordered w-full"
                >
                  <option value="">Select your native language</option>
                  {LANGUAGES.map((lang) => (
                    <option key={`native-${lang}`} value={lang.toLowerCase()}>
                      {lang}
                    </option>
                  ))}
                </select>
              </div>

              {/* LEARNING LANGUAGE */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Learning Language</span>
                </label>
                <select
                  name="learningLanguage"
                  value={formState.learningLanguage}
                  onChange={(e) =>
                    setFormState((prev) => ({
                      ...prev,
                      learningLanguage: e.target.value,
                    }))
                  }
                  className="select select-bordered w-full"
                >
                  <option value="">Select language you're learning</option>
                  {LANGUAGES.map((lang) => (
                    <option key={`learning-${lang}`} value={lang.toLowerCase()}>
                      {lang}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* LOCATION */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Location</span>
              </label>
              <div className="relative">
                <MapPin className="absolute top-1/2 transform -translate-y-1/2 left-3 size-5 text-base-content opacity-70" />
                <input
                  type="text"
                  name="location"
                  value={formState.location}
                  onChange={(e) =>
                    setFormState((prev) => ({
                      ...prev,
                      location: e.target.value,
                    }))
                  }
                  className="input input-bordered w-full pl-10"
                  placeholder="City, Country"
                />
              </div>
            </div>

            {/* SUBMIT BUTTON */}

            <button
              className="btn btn-primary w-full"
              disabled={isPending}
              type="submit"
            >
              {!isPending ? (
                <>
                  <Sparkles className="size-5 mr-2" />
                  Complete Onboarding
                </>
              ) : (
                <>
                  <LoaderIcon className="animate-spin size-5 mr-2" />
                  Onboarding...
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
export default OnboardingPage;
