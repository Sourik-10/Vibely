import { UserIcon } from "lucide-react";

const ProfileImage = ({
  src,
  alt = "Profile",
  size = "md",
  className = "",
  fallbackIcon = UserIcon,
}) => {
  const sizeClasses = {
    xs: "w-6 h-6",
    sm: "w-8 h-8",
    md: "w-10 h-10",
    lg: "w-12 h-12",
    xl: "w-16 h-16",
    "2xl": "w-20 h-20",
    "3xl": "w-24 h-24",
    "4xl": "w-32 h-32",
  };

  const iconSizes = {
    xs: "w-4 h-4",
    sm: "w-5 h-5",
    md: "w-6 h-6",
    lg: "w-7 h-7",
    xl: "w-8 h-8",
    "2xl": "w-10 h-10",
    "3xl": "w-12 h-12",
    "4xl": "w-16 h-16",
  };

  // If no src, show fallback icon
  if (!src) {
    const IconComponent = fallbackIcon;
    return (
      <div
        className={`${sizeClasses[size]} rounded-full bg-base-300 flex items-center justify-center border-2 border-dashed border-base-content/20 ${className}`}
      >
        <IconComponent
          className={`${iconSizes[size]} text-base-content opacity-60`}
        />
      </div>
    );
  }

  // Show the image directly - very simple approach
  return (
    <div
      className={`${sizeClasses[size]} rounded-full overflow-hidden bg-base-300 ${className}`}
    >
      <img
        src={src}
        alt={alt}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          display: "block",
        }}
      />
    </div>
  );
};

export default ProfileImage;
